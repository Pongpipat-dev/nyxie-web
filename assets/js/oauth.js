// Social sign-in buttons (Supabase OAuth).
// `id` is the Supabase provider key.
import { html, raw } from "./ui.js";
import { t } from "./i18n.js";
import { sb } from "./store.js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const svg = (body, mono = true) => raw(`<svg class="ic oa-ic" viewBox="0 0 24 24" aria-hidden="true"${mono ? ' fill="currentColor"' : ""}>${body}</svg>`);

export const PROVIDERS = [
  { id: "google", name: "Google", icon: svg('<path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.28a12 12 0 0 0 0 10.78l4.01-3.1Z"/><path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.28 6.61l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77Z"/>', false) },
  { id: "discord", name: "Discord", icon: svg('<path fill="#5865F2" d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.25a18.27 18.27 0 0 0-5.49 0 12.64 12.64 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.22-1.99a.08.08 0 0 0-.04-.1 13.1 13.1 0 0 1-1.87-.9.08.08 0 0 1 0-.12c.12-.1.25-.19.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08 0c.12.1.25.2.37.3a.08.08 0 0 1 0 .12c-.6.35-1.22.65-1.87.9a.08.08 0 0 0-.04.1c.36.7.77 1.36 1.22 1.99a.08.08 0 0 0 .09.03 19.84 19.84 0 0 0 6-3.03.08.08 0 0 0 .03-.06c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.15-1.09-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.94 2.42-2.16 2.42Z"/>', false) },
  { id: "apple", name: "Apple", icon: svg('<path d="M12.15 6.9c-.95 0-2.42-1.08-3.96-1.04-2.04.03-3.91 1.18-4.96 3.01-2.12 3.68-.55 9.1 1.52 12.09 1.01 1.45 2.2 3.09 3.79 3.04 1.52-.07 2.09-.99 3.93-.99 1.83 0 2.35.99 3.96.95 1.64-.03 2.68-1.48 3.68-2.95 1.15-1.69 1.63-3.33 1.66-3.42-.04-.01-3.18-1.22-3.22-4.86-.03-3.04 2.48-4.49 2.6-4.56-1.43-2.09-3.63-2.32-4.39-2.38-2-.15-3.68 1.09-4.61 1.09Zm3.38-3.07c.84-1.01 1.4-2.43 1.25-3.83-1.21.05-2.66.8-3.53 1.82-.78.9-1.46 2.34-1.27 3.71 1.34.1 2.71-.69 3.55-1.7Z"/>') },
];

export const oauthButtons = () => html`<div class="oa-grid">${PROVIDERS.map((p) =>
  html`<button type="button" class="btn btn-sec oa-btn" data-act="oauth" data-p="${p.id}">${p.icon}<span>${p.name}</span></button>`)}</div>
  <div class="oa-or"><span>${t("orEmail")}</span></div>`;

// Which providers are switched on in Supabase (public settings endpoint), fetched once.
let enabled = null;
async function enabledProviders() {
  if (!enabled) enabled = fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_KEY } })
    .then((r) => r.json()).then((s) => s.external || {}).catch(() => { enabled = null; return {}; });
  return enabled;
}

const BACK_KEY = "nyxie.oauthBack";

// Returns an error message to show, or nothing when the browser is being redirected.
export async function startOAuth(id) {
  const p = PROVIDERS.find((x) => x.id === id);
  if (!p) return;
  const on = await enabledProviders();
  if (!on[id]) return t("oauthOff", { p: p.name });
  // Come back to the page the user was on once the provider sends them back.
  try { sessionStorage.setItem(BACK_KEY, location.hash); } catch (e) {}
  const { error } = await sb.auth.signInWithOAuth({ provider: id, options: { redirectTo: location.origin + location.pathname } });
  if (error) return t("oauthErr", { p: p.name });
}

// After the redirect back, restore the route the user started from.
export function restoreOAuthRoute(signedIn) {
  let back = null;
  try { back = sessionStorage.getItem(BACK_KEY); sessionStorage.removeItem(BACK_KEY); } catch (e) {}
  if (signedIn && back && back !== location.hash) history.replaceState(null, "", location.pathname + location.search + back);
}
