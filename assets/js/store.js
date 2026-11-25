import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

export const state = {
  ready: false,
  loadError: null,
  user: null,      // auth user
  profile: null,   // public.profiles row
  packs: [],       // published packs (all of them for admins)
  tutorials: [],
  bookmarks: new Set(),
  setup: readSetup(),
};

const listeners = new Set();
export const onChange = (fn) => (listeners.add(fn), () => listeners.delete(fn));
export const emit = () => listeners.forEach((fn) => fn());

export const isAdmin = () => state.profile?.role === "admin";

// ---------- My Setup (device first, profile when signed in) ----------
function readSetup() {
  try { const s = JSON.parse(localStorage.getItem("nyxie.setup")); if (s && s.edition && s.version && s.pc) return s; } catch (e) {}
  return null;
}
export async function saveSetup(s) {
  state.setup = s;
  try { s ? localStorage.setItem("nyxie.setup", JSON.stringify(s)) : localStorage.removeItem("nyxie.setup"); } catch (e) {}
  if (state.user) await sb.from("profiles").update({ setup: s }).eq("id", state.user.id);
  emit();
}

// ---------- Loading ----------
const PACK_COLS = "id,slug,name,type,summary,description,creator,source_url,license,file_size,requirements,versions,platform,resolution,style,category,perf,score,thumbnail_url,images,before_url,after_url,install_steps,review,pros,cons,test_rig,test_setup,fps_base,fps_with,status,is_sample,link_broken,views,downloads,checked_at,updated_at,created_at";

export async function loadCatalog() {
  const [p, tu] = await Promise.all([
    sb.from("packs").select(PACK_COLS).order("score", { ascending: false, nullsFirst: false }),
    sb.from("tutorials").select("id,slug,title,summary,body,published,updated_at").order("id"),
  ]);
  if (p.error) throw p.error;
  if (tu.error) throw tu.error;
  state.packs = p.data;
  state.tutorials = tu.data;
}

export async function loadUser(session) {
  state.user = session?.user ?? null;
  state.profile = null;
  state.bookmarks = new Set();
  if (!state.user) return;
  const [pr, bm] = await Promise.all([
    sb.from("profiles").select("*").eq("id", state.user.id).maybeSingle(),
    sb.from("bookmarks").select("pack_id").eq("user_id", state.user.id),
  ]);
  state.profile = pr.data || null;
  state.bookmarks = new Set((bm.data || []).map((r) => r.pack_id));
  // Profile setup wins over an empty device; a device setup fills an empty profile.
  if (state.profile?.setup && !state.setup) {
    state.setup = state.profile.setup;
    try { localStorage.setItem("nyxie.setup", JSON.stringify(state.setup)); } catch (e) {}
  } else if (state.setup && !state.profile?.setup) {
    await sb.from("profiles").update({ setup: state.setup }).eq("id", state.user.id);
  }
}

export async function boot() {
  const { data } = await sb.auth.getSession();
  await Promise.all([loadUser(data.session), loadCatalog()]);
  state.ready = true;
  // The callback must stay synchronous: awaiting Supabase queries inside it deadlocks
  // the auth lock (supabase-js re-emits SIGNED_IN on tab focus), which left the
  // profile null and hid the admin menu. Defer the work out of the callback instead.
  sb.auth.onAuthStateChange((ev, session) => {
    if (ev === "INITIAL_SESSION" || ev === "TOKEN_REFRESHED") return;
    // Same user re-signalled (e.g. tab refocus): keep the loaded profile as is.
    if (ev === "SIGNED_IN" && session?.user?.id && session.user.id === state.user?.id && state.profile) return;
    setTimeout(async () => {
      const was = state.user?.id;
      await loadUser(session);
      if (was !== state.user?.id) { await loadCatalog().catch(() => {}); }
      emit();
    }, 0);
  });
}

// ---------- Queries ----------
export const published = () => state.packs.filter((p) => p.status === "published");
export const packBySlug = (slug) => state.packs.find((p) => p.slug === slug);
export const packById = (id) => state.packs.find((p) => p.id === id);

export async function toggleBookmark(pack) {
  const on = state.bookmarks.has(pack.id);
  const q = on
    ? sb.from("bookmarks").delete().eq("user_id", state.user.id).eq("pack_id", pack.id)
    : sb.from("bookmarks").insert({ user_id: state.user.id, pack_id: pack.id });
  const { error } = await q;
  if (error) throw error;
  on ? state.bookmarks.delete(pack.id) : state.bookmarks.add(pack.id);
  return !on;
}

export async function likeInfo(packId) {
  const { count } = await sb.from("likes").select("pack_id", { count: "exact", head: true }).eq("pack_id", packId);
  let mine = false;
  if (state.user) {
    const r = await sb.from("likes").select("pack_id").eq("pack_id", packId).eq("user_id", state.user.id).maybeSingle();
    mine = !!r.data;
  }
  return { count: count || 0, mine };
}
export async function toggleLike(packId, mine) {
  const q = mine
    ? sb.from("likes").delete().eq("user_id", state.user.id).eq("pack_id", packId)
    : sb.from("likes").insert({ user_id: state.user.id, pack_id: packId });
  const { error } = await q;
  if (error) throw error;
}

export async function loadComments(packId) {
  const { data, error } = await sb.from("comments")
    .select("id,pack_id,user_id,parent_id,body,created_at,edited_at,profiles(display_name,avatar_url,role)")
    .eq("pack_id", packId).order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

const viewed = new Set();
export function recordView(p) {
  if (viewed.has(p.id) || p.status !== "published") return;
  viewed.add(p.id);
  sb.rpc("record_view", { p_pack: p.id }).then(() => {}, () => {});
}
export function recordDownload(p) {
  p.downloads = (p.downloads || 0) + 1;
  sb.rpc("record_download", { p_pack: p.id }).then(() => {}, () => {});
}
