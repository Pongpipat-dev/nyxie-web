// UI strings. Thai and English are equal: every key exists in both.
const S = {
  th: {
    skip: "ข้ามไปยังเนื้อหา",
    "type.resource-packs": "Resource Packs", "type.shaders": "Shaders", "type.mods": "Mods", "type.modpacks": "Modpacks", "type.datapacks": "Data Packs", "type.plugins": "Plugins", "type.maps": "Worlds",
    "type1.resource-packs": "รีซอร์สแพ็ก", "type1.shaders": "Shader", "type1.mods": "ม็อด", "type1.modpacks": "โมดแพ็ก", "type1.datapacks": "ดาต้าแพ็ก", "type1.plugins": "ปลั๊กอิน", "type1.maps": "เวิลด์",
    top10: "ยอดนิยม", tutorials: "สอนติดตั้ง", saved: "ที่บันทึกไว้", account: "บัญชี", admin: "แอดมิน",
    searchPh: "ค้นหาแพ็ก Shader ม็อด เวิลด์ หรือบทสอน", searchBtn: "ค้นหา", searchAll: "ดูผลทั้งหมดของ “{q}”",
    signIn: "เข้าสู่ระบบ", signUp: "สมัครสมาชิก", signOut: "ออกจากระบบ", menu: "เมนู", close: "ปิด",
    themeDark: "ธีมมืด", themeLight: "ธีมสว่าง", lang: "English",
    // setup
    setup: "เครื่องของฉัน", setupSet: "ตั้งค่าเครื่องของฉัน", setupEdit: "แก้ไข",
    setupTitle: "เครื่องของฉัน", setupLead: "บอกเราครั้งเดียว แล้วทุกหน้าจะบอกว่าแพ็กไหนใช้กับเครื่องคุณได้",
    edition: "รุ่นเกม", version: "เวอร์ชัน Minecraft", pc: "สเปกคอม",
    "pc.low": "สเปกเบา", "pc.mid": "สเปกกลาง", "pc.high": "สเปกแรง",
    "pcHint.low": "โน้ตบุ๊ก / การ์ดจอออนบอร์ด", "pcHint.mid": "การ์ดจอระดับ GTX 1650 – RTX 3050", "pcHint.high": "RTX 3060 ขึ้นไป",
    "ed.java": "Java", "ed.bedrock": "Bedrock", "plat.both": "Java + Bedrock",
    save: "บันทึก", cancel: "ยกเลิก", clear: "ล้างค่า", saved_: "บันทึกแล้ว",
    // fit
    "fit.ok": "ใช้ได้กับเครื่องคุณ", "fit.heavy": "หนักสำหรับเครื่องคุณ", "fit.no": "ใช้กับเครื่องคุณไม่ได้", "fit.none": "ยังไม่ได้ตั้งค่าเครื่อง",
    "fitShort.ok": "ใช้ได้", "fitShort.heavy": "หนักเครื่อง", "fitShort.no": "ใช้ไม่ได้",
    "why.platform": "แพ็กนี้รองรับ {p} เท่านั้น", "why.version": "รองรับเวอร์ชัน {v}", "why.perf": "ทีมแนะนำ{pc}ขึ้นไป", "why.ok": "ตรงกับ {ed} {v} และ{pc}",
    fitsOnly: "เฉพาะที่ใช้กับเครื่องฉันได้", fitsCount: "{n} จาก {t} ใช้กับเครื่องคุณได้",
    "perf.light": "เบา", "perf.medium": "ปานกลาง", "perf.heavy": "หนัก",
    // home
    homeT: "แพ็ก Minecraft ที่ทีมเราทดสอบแล้ว และเช็กกับเครื่องคุณให้",
    homeP: "ทุกแพ็กผ่านการติดตั้งและให้คะแนนโดยทีม Nyxie ดาวน์โหลดตรงจากหน้าของผู้สร้างเสมอ",
    bestForYou: "ดีที่สุดสำหรับเครื่องคุณ", topRated: "คะแนนสูงสุด", recentlyChecked: "ตรวจล่าสุด", viewAll: "ดูทั้งหมด",
    browse: "เลือกดูตามประเภท", packsN: "{n} แพ็ก",
    // list
    filters: "ตัวกรอง", sortBy: "เรียงตาม", "sort.score": "คะแนน Nyxie", "sort.popular": "ยอดนิยม", "sort.checked": "ตรวจล่าสุด", "sort.name": "ชื่อ A–Z",
    platform: "แพลตฟอร์ม", resolution: "ความละเอียด", style: "สไตล์", category: "หมวดหมู่", perf: "ความหนักเครื่อง",
    all: "ทั้งหมด", clearAll: "ล้างตัวกรอง", showResults: "ดู {n} รายการ",
    resultsN: "{n} รายการ", noResults: "ไม่พบแพ็กที่ตรงกับตัวกรอง", noResultsP: "ลองเอาตัวกรองออกบางตัว หรือปิด “เฉพาะที่ใช้กับเครื่องฉันได้”",
    prev: "ก่อนหน้า", next: "ถัดไป", page: "หน้า {n}",
    by: "โดย {c}", sample: "ตัวอย่าง", sampleTip: "ข้อมูลตัวอย่าง ยังไม่ใช่รีวิวจริง",
    download: "ดาวน์โหลด", downloads: "ดาวน์โหลด", score: "คะแนน Nyxie", views: "เข้าชม",
    // detail
    back: "กลับ", like: "ถูกใจ", liked: "ถูกใจแล้ว", bookmark: "บันทึก", bookmarked: "บันทึกแล้ว", report: "แจ้งปัญหา",
    "rv.title": "รีวิวจากทีม Nyxie", "rv.pros": "ข้อดี", "rv.cons": "ข้อเสีย", "rv.rig": "เครื่องที่ทดสอบ", "rv.setup": "เวอร์ชันและการตั้งค่า", "rv.fps": "FPS ก่อน → หลัง", "rv.fromCreator": "รายละเอียดจากผู้สร้าง",
    testFacts: "ข้อมูลการทดสอบ", checked: "ตรวจล่าสุด", versions: "เวอร์ชัน", requirements: "สิ่งที่ต้องมี", license: "สิทธิ์การใช้งาน", fileSize: "ขนาดไฟล์", creator: "ผู้สร้าง",
    description: "รายละเอียด", install: "วิธีติดตั้ง", gallery: "ภาพตัวอย่าง", compare: "เทียบก่อน / หลัง", before: "ก่อน", after: "หลัง",
    noDesc: "ยังไม่มีรายละเอียด", brokenLink: "ลิงก์นี้ถูกแจ้งว่าเสีย ทีมกำลังตรวจสอบ", noLink: "ยังไม่มีลิงก์ดาวน์โหลด (ข้อมูลตัวอย่าง)",
    leaveT: "กำลังออกจาก Nyxie", leaveP: "ไฟล์นี้อยู่บนเว็บของผู้สร้างซึ่ง Nyxie ไม่ได้ควบคุม ตรวจดูว่าเป็นหน้าของผู้สร้างจริง และสแกนไฟล์ก่อนเปิด", leaveGo: "ไปที่หน้าดาวน์โหลด",
    reportT: "แจ้งปัญหาของแพ็กนี้", "reason.broken-link": "ลิงก์เสีย", "reason.wrong-info": "ข้อมูลไม่ถูกต้อง", "reason.unsafe": "ไฟล์น่าสงสัย", "reason.other": "อื่น ๆ",
    note: "รายละเอียดเพิ่มเติม (ไม่บังคับ)", send: "ส่ง", reportThanks: "ขอบคุณ ทีมจะตรวจสอบเร็ว ๆ นี้",
    comments: "ความคิดเห็น", commentPh: "เขียนความคิดเห็น…", post: "โพสต์", reply: "ตอบกลับ", edit: "แก้ไข", del: "ลบ", edited: "แก้ไขแล้ว",
    noComments: "ยังไม่มีความคิดเห็น เป็นคนแรกที่แชร์ประสบการณ์", signInToComment: "เข้าสู่ระบบเพื่อแสดงความคิดเห็น", teamReply: "ทีม Nyxie",
    confirmDel: "ลบรายการนี้ใช่ไหม?",
    // search
    searchT: "ผลการค้นหา", searchFor: "ผลการค้นหา “{q}”", searchEmpty: "ไม่พบอะไรที่ตรงกับ “{q}”", searchEmptyP: "ลองคำที่สั้นลง ชื่อผู้สร้าง หรือสไตล์ เช่น PvP, Medieval",
    typeQuery: "พิมพ์คำที่ต้องการค้นหา",
    // top / tutorials / saved
    top10T: "ยอดนิยม", top10P: "จัดอันดับจากคะแนน Nyxie ของทุกประเภท",
    tutorialsT: "สอนติดตั้ง", tutorialsP: "คู่มือสั้น ๆ สำหรับติดตั้งแพ็ก Shader และม็อด",
    savedT: "แพ็กที่บันทึกไว้", savedEmpty: "ยังไม่มีแพ็กที่บันทึก", savedEmptyP: "กดไอคอนบุ๊กมาร์กที่แพ็กไหนก็ได้เพื่อเก็บไว้ที่นี่", needSignIn: "เข้าสู่ระบบเพื่อดูหน้านี้",
    // auth
    orEmail: "หรือใช้อีเมล", oauthOff: "ยังไม่ได้เปิดใช้การเข้าสู่ระบบด้วย {p}", oauthErr: "เข้าสู่ระบบด้วย {p} ไม่สำเร็จ ลองอีกครั้ง",
    email: "อีเมล", password: "รหัสผ่าน", displayName: "ชื่อที่แสดง", forgot: "ลืมรหัสผ่าน?", haveAccount: "มีบัญชีแล้ว?", noAccount: "ยังไม่มีบัญชี?",
    resetT: "ตั้งรหัสผ่านใหม่", resetSend: "ส่งลิงก์ตั้งรหัสผ่าน", resetSent: "ส่งลิงก์ไปที่อีเมลแล้ว", checkEmail: "เช็กอีเมลเพื่อยืนยันบัญชี แล้วกลับมาเข้าสู่ระบบ",
    pwMin: "อย่างน้อย 8 ตัวอักษร", newPassword: "รหัสผ่านใหม่", changePw: "เปลี่ยนรหัสผ่าน", pwChanged: "เปลี่ยนรหัสผ่านแล้ว",
    welcome: "ยินดีต้อนรับ {n}", signedOut: "ออกจากระบบแล้ว",
    accountT: "บัญชีของฉัน", profile: "โปรไฟล์", avatarUrl: "ลิงก์รูปโปรไฟล์ (ไม่บังคับ)", preferences: "การแสดงผล", language: "ภาษา", theme: "ธีม",
    // errors
    errGeneric: "มีบางอย่างผิดพลาด ลองอีกครั้ง", errLoad: "โหลดข้อมูลไม่สำเร็จ ตรวจการเชื่อมต่อแล้วลองใหม่", retry: "ลองอีกครั้ง",
    errAuth: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", notFound: "ไม่พบหน้านี้", notFoundP: "ลิงก์อาจผิด หรือแพ็กถูกนำออกแล้ว", home: "หน้าแรก",
    // footer
    footTag: "ทีมเราทดสอบทุกแพ็กก่อนแนะนำ ดาวน์โหลดไปที่หน้าของผู้สร้างเสมอ",
    disclaimer: "เว็บไซต์อิสระสำหรับค้นหาและรีวิวคอนเทนต์ Minecraft ไม่มีส่วนเกี่ยวข้อง ไม่ได้รับการรับรอง และไม่ได้เชื่อมโยงกับ Mojang Studios หรือ Microsoft",
    "page.about": "เกี่ยวกับ Nyxie", "page.contact": "ติดต่อเรา", "page.privacy": "นโยบายความเป็นส่วนตัว", "page.cookies": "นโยบายคุกกี้", "page.terms": "ข้อกำหนดการใช้งาน", "page.download-safety": "ความปลอดภัยในการดาวน์โหลด",
    pageEmpty: "เนื้อหาหน้านี้ยังไม่ได้เขียน", legal: "ข้อกฎหมาย", checkFit: "เช็กกับเครื่อง", checkedLbl: "ตรวจ", searchShort: "ค้นหาใน Nyxie",
    // Modrinth explore
    more: "เพิ่มเติม", show: "แสดง", perPage: "จำนวนรายการต่อหน้า", "dl.title": "ดาวน์โหลด {n}", "dl.latest": "ล่าสุด (ทุกเวอร์ชัน)", "dl.btn": "ดาวน์โหลดไฟล์ {e} · {s}", "dl.more": "ไฟล์อื่นในเวอร์ชันนี้", "dl.allOn": "ทุกเวอร์ชันบน Modrinth", "dl.note": "ไฟล์โหลดตรงจาก cdn.modrinth.com ของผู้สร้าง Nyxie ไม่ได้เก็บหรือแก้ไขไฟล์ ควรสแกนไฟล์ก่อนเปิด", "dl.mrpack": "ไฟล์ .mrpack เป็นโมดแพ็ก ต้องเปิดผ่าน launcher ที่รองรับ เช่น Modrinth App, Prism Launcher หรือ ATLauncher", untested: "ยังไม่ได้ทดสอบ", untestedTip: "นำเข้าจาก Modrinth ทีม Nyxie ยังไม่ได้ทดสอบและให้คะแนน ความหนักเครื่องเป็นค่าประมาณจากแท็กของผู้สร้าง", "mr.title": "สำรวจ Modrinth", "mr.lead": "ค้นหาม็อด โมดแพ็ก รีซอร์สแพ็ก Shader ดาต้าแพ็ก และปลั๊กอินแบบสดจาก Modrinth",
    "mr.notTested": "ข้อมูลส่วนนี้ดึงสดจาก Modrinth ทีม Nyxie ยังไม่ได้ทดสอบ ยกเว้นรายการที่มีป้าย “Nyxie ทดสอบแล้ว”",
    "mr.tested": "Nyxie ทดสอบแล้ว", "mr.testedTip": "ทีม Nyxie รีวิวโปรเจกต์นี้แล้ว คลิกเพื่ออ่านผลทดสอบ",
    "mr.types": "ประเภทโปรเจกต์", "mr.type.mod": "ม็อด", "mr.type.modpack": "โมดแพ็ก", "mr.type.resourcepack": "รีซอร์สแพ็ก", "mr.type.shader": "Shader", "mr.type.datapack": "ดาต้าแพ็ก", "mr.type.plugin": "ปลั๊กอิน",
    "mr.searchPh": "ค้นหา{t}", "mr.loader": "ตัวโหลด", "mr.mySetup": "เครื่องของฉัน", "mr.resultsN": "{n} โปรเจกต์",
    "mr.sort.relevance": "เกี่ยวข้องที่สุด", "mr.sort.downloads": "ดาวน์โหลดมากสุด", "mr.sort.follows": "ผู้ติดตามมากสุด", "mr.sort.newest": "ใหม่ล่าสุด", "mr.sort.updated": "อัปเดตล่าสุด",
    "mr.noResultsP": "ลองคำค้นอื่น หรือล้างตัวกรองเวอร์ชันและตัวโหลด", "mr.followers": "ผู้ติดตาม", "mr.updated": "อัปเดตล่าสุด", "mr.updatedAgo": "อัปเดต {t}",
    "mr.errT": "โหลดข้อมูลจาก Modrinth ไม่สำเร็จ", "mr.errP": "Modrinth อาจไม่ตอบสนองชั่วคราว ลองใหม่อีกครั้งในอีกสักครู่", "mr.retry": "ลองใหม่",
    "mr.openOn": "เปิดใน Modrinth", "mr.readReview": "อ่านรีวิวของ Nyxie", "mr.import": "นำเข้าเป็นแพ็ก Nyxie", "mr.importAgain": "นำเข้าเป็นแพ็กใหม่",
    "mr.source": "ซอร์สโค้ด", "mr.issues": "แจ้งบั๊ก", "mr.wiki": "วิกิ", "mr.facts": "ข้อมูลโปรเจกต์", "mr.client": "ฝั่งไคลเอนต์", "mr.server": "ฝั่งเซิร์ฟเวอร์",
    "mr.side.required": "จำเป็น", "mr.side.optional": "ไม่บังคับ", "mr.side.unsupported": "ไม่รองรับ", "mr.published": "เผยแพร่", "mr.readFull": "อ่านคำอธิบายเต็มบน Modrinth",
    "mr.files": "เวอร์ชันและไฟล์", "mr.version": "เวอร์ชัน", "mr.file": "ไฟล์", "mr.allVersions": "ทุกเวอร์ชัน Minecraft", "mr.allLoaders": "ทุกตัวโหลด",
    "mr.vt.beta": "เบต้า", "mr.vt.alpha": "อัลฟา", "mr.showMore": "แสดงเพิ่ม ({n} รายการ)",
    "mr.noVersions": "ไม่มีไฟล์ที่ตรงกับตัวกรอง", "mr.noVersionsP": "ลองเปลี่ยนเวอร์ชัน Minecraft หรือตัวโหลด", "mr.noSetupVersion": "โปรเจกต์นี้ยังไม่มีไฟล์สำหรับ Minecraft {v} ตามเครื่องของคุณ",
  },
  en: {
    skip: "Skip to content",
    "type.resource-packs": "Resource Packs", "type.shaders": "Shaders", "type.mods": "Mods", "type.modpacks": "Modpacks", "type.datapacks": "Data Packs", "type.plugins": "Plugins", "type.maps": "Worlds",
    "type1.resource-packs": "Resource pack", "type1.shaders": "Shader", "type1.mods": "Mod", "type1.modpacks": "Modpack", "type1.datapacks": "Data pack", "type1.plugins": "Plugin", "type1.maps": "World",
    top10: "Popular", tutorials: "Tutorials", saved: "Saved", account: "Account", admin: "Admin",
    searchPh: "Search packs, shaders, mods, worlds or tutorials", searchBtn: "Search", searchAll: "See all results for “{q}”",
    signIn: "Sign in", signUp: "Sign up", signOut: "Sign out", menu: "Menu", close: "Close",
    themeDark: "Dark theme", themeLight: "Light theme", lang: "ภาษาไทย",
    setup: "My setup", setupSet: "Set my setup", setupEdit: "Edit",
    setupTitle: "My setup", setupLead: "Tell us once, and every page shows which packs work on your machine.",
    edition: "Edition", version: "Minecraft version", pc: "PC power",
    "pc.low": "Low-end PC", "pc.mid": "Mid-range PC", "pc.high": "High-end PC",
    "pcHint.low": "Laptop / integrated graphics", "pcHint.mid": "GTX 1650 – RTX 3050 class GPU", "pcHint.high": "RTX 3060 or better",
    "ed.java": "Java", "ed.bedrock": "Bedrock", "plat.both": "Java + Bedrock",
    save: "Save", cancel: "Cancel", clear: "Clear", saved_: "Saved",
    "fit.ok": "Fits your setup", "fit.heavy": "Heavy for your PC", "fit.no": "Won't run on your setup", "fit.none": "Setup not set",
    "fitShort.ok": "Fits", "fitShort.heavy": "Heavy", "fitShort.no": "Won't run",
    "why.platform": "This pack is {p} only", "why.version": "Supports {v}", "why.perf": "The team recommends a {pc} or better", "why.ok": "Matches {ed} {v} on a {pc}",
    fitsOnly: "Only packs that fit my setup", fitsCount: "{n} of {t} fit your setup",
    "perf.light": "Light", "perf.medium": "Medium", "perf.heavy": "Heavy",
    homeT: "Minecraft packs our team has tested, checked against your setup",
    homeP: "Every pack is installed and scored by the Nyxie team. Downloads always go to the creator's own page.",
    bestForYou: "Best for your setup", topRated: "Top rated", recentlyChecked: "Recently checked", viewAll: "View all",
    browse: "Browse by type", packsN: "{n} packs",
    filters: "Filters", sortBy: "Sort by", "sort.score": "Nyxie score", "sort.popular": "Most popular", "sort.checked": "Recently checked", "sort.name": "Name A–Z",
    platform: "Platform", resolution: "Resolution", style: "Style", category: "Category", perf: "Performance",
    all: "All", clearAll: "Clear filters", showResults: "Show {n} results",
    resultsN: "{n} results", noResults: "No packs match these filters", noResultsP: "Remove a filter, or turn off “Only packs that fit my setup”.",
    prev: "Previous", next: "Next", page: "Page {n}",
    by: "by {c}", sample: "Sample", sampleTip: "Sample data, not a real review yet",
    download: "Download", downloads: "downloads", score: "Nyxie score", views: "views",
    back: "Back", like: "Like", liked: "Liked", bookmark: "Save", bookmarked: "Saved", report: "Report a problem",
    "rv.title": "Nyxie team review", "rv.pros": "Pros", "rv.cons": "Cons", "rv.rig": "Test PC", "rv.setup": "Version and settings", "rv.fps": "FPS without → with", "rv.fromCreator": "From the creator",
    testFacts: "Test facts", checked: "Last checked", versions: "Versions", requirements: "Requirements", license: "License", fileSize: "File size", creator: "Creator",
    description: "Description", install: "How to install", gallery: "Screenshots", compare: "Before / after", before: "Before", after: "After",
    noDesc: "No description yet.", brokenLink: "This link was reported broken. The team is checking it.", noLink: "No download link yet (sample data).",
    leaveT: "You're leaving Nyxie", leaveP: "This file is hosted on the creator's website, which Nyxie doesn't control. Check that the page belongs to the creator, and scan files before opening them.", leaveGo: "Go to download page",
    reportT: "Report a problem with this pack", "reason.broken-link": "Broken link", "reason.wrong-info": "Wrong information", "reason.unsafe": "Suspicious file", "reason.other": "Something else",
    note: "Details (optional)", send: "Send", reportThanks: "Thanks. The team will check it soon.",
    comments: "Comments", commentPh: "Write a comment…", post: "Post", reply: "Reply", edit: "Edit", del: "Delete", edited: "edited",
    noComments: "No comments yet. Be the first to share how it ran.", signInToComment: "Sign in to comment", teamReply: "Nyxie team",
    confirmDel: "Delete this?",
    searchT: "Search", searchFor: "Results for “{q}”", searchEmpty: "Nothing matches “{q}”", searchEmptyP: "Try a shorter word, a creator, or a style such as PvP or Medieval.",
    typeQuery: "Type something to search",
    top10T: "Popular", top10P: "Ranked by Nyxie score across every type.",
    tutorialsT: "Tutorials", tutorialsP: "Short guides for installing packs, shaders and mods.",
    savedT: "Saved packs", savedEmpty: "Nothing saved yet", savedEmptyP: "Use the bookmark on any pack to keep it here.", needSignIn: "Sign in to see this page",
    orEmail: "or use email", oauthOff: "Sign-in with {p} isn't set up yet", oauthErr: "Couldn't sign in with {p}. Try again.",
    email: "Email", password: "Password", displayName: "Display name", forgot: "Forgot password?", haveAccount: "Have an account?", noAccount: "No account yet?",
    resetT: "Reset password", resetSend: "Send reset link", resetSent: "Reset link sent to your email", checkEmail: "Check your email to confirm your account, then sign in.",
    pwMin: "At least 8 characters", newPassword: "New password", changePw: "Change password", pwChanged: "Password changed",
    welcome: "Welcome, {n}", signedOut: "Signed out",
    accountT: "My account", profile: "Profile", avatarUrl: "Profile picture URL (optional)", preferences: "Display", language: "Language", theme: "Theme",
    errGeneric: "Something went wrong. Try again.", errLoad: "Couldn't load data. Check your connection and try again.", retry: "Try again",
    errAuth: "Wrong email or password", notFound: "Page not found", notFoundP: "The link may be wrong, or the pack was removed.", home: "Home",
    footTag: "We test every pack before recommending it. Downloads always go to the creator's page.",
    disclaimer: "An independent Minecraft content discovery and review website. Not affiliated with, endorsed by, or connected to Mojang Studios or Microsoft.",
    "page.about": "About Nyxie", "page.contact": "Contact", "page.privacy": "Privacy Policy", "page.cookies": "Cookie Policy", "page.terms": "Terms of Service", "page.download-safety": "Download Safety",
    pageEmpty: "This page hasn't been written yet.", legal: "Legal", checkFit: "Check fit", checkedLbl: "Checked", searchShort: "Search Nyxie",
    // Modrinth explore
    more: "More", show: "Show", perPage: "Results per page", "dl.title": "Download {n}", "dl.latest": "Latest (any version)", "dl.btn": "Download {e} file · {s}", "dl.more": "Other files in this version", "dl.allOn": "All versions on Modrinth", "dl.note": "The file comes straight from the creator's upload on cdn.modrinth.com. Nyxie doesn't host or change it. Scan files before opening them.", "dl.mrpack": "A .mrpack file is a modpack. Open it with a launcher that supports it, such as the Modrinth App, Prism Launcher or ATLauncher.", untested: "Not tested yet", untestedTip: "Imported from Modrinth. The Nyxie team hasn't tested or scored it yet; the performance weight is an estimate from the creator's tags.", "mr.title": "Explore Modrinth", "mr.lead": "Search mods, modpacks, resource packs, shaders, data packs and plugins live from Modrinth.",
    "mr.notTested": "This section is live data from Modrinth. The Nyxie team hasn't tested these, except items marked “Tested by Nyxie”.",
    "mr.tested": "Tested by Nyxie", "mr.testedTip": "The Nyxie team has reviewed this project. Click to read the test results.",
    "mr.types": "Project types", "mr.type.mod": "Mods", "mr.type.modpack": "Modpacks", "mr.type.resourcepack": "Resource packs", "mr.type.shader": "Shaders", "mr.type.datapack": "Data packs", "mr.type.plugin": "Plugins",
    "mr.searchPh": "Search {t}", "mr.loader": "Loader", "mr.mySetup": "my setup", "mr.resultsN": "{n} projects",
    "mr.sort.relevance": "Relevance", "mr.sort.downloads": "Most downloads", "mr.sort.follows": "Most followed", "mr.sort.newest": "Newest", "mr.sort.updated": "Recently updated",
    "mr.noResultsP": "Try another search, or clear the version and loader filters.", "mr.followers": "Followers", "mr.updated": "Updated", "mr.updatedAgo": "Updated {t}",
    "mr.errT": "Couldn't load data from Modrinth", "mr.errP": "Modrinth may be briefly unavailable. Try again in a moment.", "mr.retry": "Try again",
    "mr.openOn": "Open on Modrinth", "mr.readReview": "Read the Nyxie review", "mr.import": "Import as a Nyxie pack", "mr.importAgain": "Import as a new pack",
    "mr.source": "Source", "mr.issues": "Issues", "mr.wiki": "Wiki", "mr.facts": "Project details", "mr.client": "Client side", "mr.server": "Server side",
    "mr.side.required": "Required", "mr.side.optional": "Optional", "mr.side.unsupported": "Unsupported", "mr.published": "Published", "mr.readFull": "Read the full description on Modrinth",
    "mr.files": "Versions and files", "mr.version": "Version", "mr.file": "File", "mr.allVersions": "All Minecraft versions", "mr.allLoaders": "All loaders",
    "mr.vt.beta": "Beta", "mr.vt.alpha": "Alpha", "mr.showMore": "Show more ({n} left)",
    "mr.noVersions": "No files match these filters", "mr.noVersionsP": "Try another Minecraft version or loader.", "mr.noSetupVersion": "This project has no files for Minecraft {v} (your setup) yet.",
  },
};

// Languages in the picker: [code, native name, English name, flag (ISO 3166), rtl].
// The code doubles as the BCP 47 locale for dates and numbers.
// th and en live above; every other language is a file in ./locales/ loaded on demand.
// Missing keys fall back to English.
export const LANGS = [
  ["en", "English (United States)", "", "us"],
  ["de-CH", "Deutsch (Schweiz)", "German (Switzerland)", "ch"],
  ["de", "Deutsch (Deutschland)", "German (Germany)", "de"],
  ["it", "Italiano (Italia)", "Italian (Italy)", "it"],
  ["ko", "한국어 (대한민국)", "Korean", "kr"],
  ["pt-BR", "Português (Brasil)", "Portuguese (Brazil)", "br"],
  ["ru", "Русский", "Russian", "ru"],
  ["uk", "Українська", "Ukrainian", "ua"],
  ["pl", "Polski", "Polish", "pl"],
  ["zh-TW", "正體中文 (臺灣)", "Chinese (Traditional)", "tw"],
  ["zh-CN", "简体中文 (中国大陆)", "Chinese (Simplified)", "cn"],
  ["fr", "Français", "French", "fr"],
  ["hu", "Magyar (Magyarország)", "Hungarian", "hu"],
  ["es-419", "Español (Latinoamérica)", "Spanish (Latin America)", "mx"],
  ["vi", "Tiếng Việt", "Vietnamese", "vn"],
  ["es", "Español (España)", "Spanish (Spain)", "es"],
  ["nl", "Nederlands", "Dutch", "nl"],
  ["sv", "Svenska", "Swedish", "se"],
  ["tr", "Türkçe", "Turkish", "tr"],
  ["ja", "日本語", "Japanese", "jp"],
  ["ms", "Bahasa Melayu", "Malay", "my"],
  ["cs", "Čeština", "Czech", "cz"],
  ["sr-Latn", "Srpski (Latinica)", "Serbian (Latin)", "rs"],
  ["pt-PT", "Português (Portugal)", "Portuguese (Portugal)", "pt"],
  ["nb", "Norsk (Bokmål)", "Norwegian Bokmål", "no"],
  ["id", "Bahasa Indonesia", "Indonesian", "id"],
  ["ro", "Română (România)", "Romanian", "ro"],
  ["fil", "Filipino", "", "ph"],
  ["da", "Dansk", "Danish", "dk"],
  ["he", "עברית (ישראל)", "Hebrew", "il", true],
  ["fi", "Suomi", "Finnish", "fi"],
  ["th", "ไทย", "Thai", "th"],
];
const META = Object.fromEntries(LANGS.map((l) => [l[0], l]));
const locale = () => (lang === "en" ? "en-US" : lang);

// Swiss German writes "ss" where Germany writes "ß", so it reuses the German file.
const LOADERS = { "de-CH": () => import("./locales/de.js").then((m) => Object.fromEntries(Object.entries(m.default).map(([k, v]) => [k, v.replace(/ß/g, "ss")]))) };
async function load(code) {
  if (S[code]) return;
  S[code] = await (LOADERS[code] ? LOADERS[code]() : import(`./locales/${code}.js`).then((m) => m.default));
}

function detect() {
  try { const s = localStorage.getItem("nyxie.lang"); if (META[s]) return s; } catch (e) {}
  for (const nav of navigator.languages || [navigator.language || ""]) {
    const n = nav.toLowerCase();
    const hit = LANGS.find(([c]) => c.toLowerCase() === n) || LANGS.find(([c]) => n.split("-")[0] === c.toLowerCase().split("-")[0]);
    if (hit) return hit[0];
  }
  return "en";
}

let lang = detect();
function apply() {
  document.documentElement.lang = lang;
  document.documentElement.dir = META[lang][4] ? "rtl" : "ltr";
}
try { await load(lang); } catch (e) { lang = "en"; }
apply();

export const getLang = () => lang;
// Short name for the language button, e.g. "ภาษาไทย", "Deutsch".
export const langName = () => (lang === "th" ? "ภาษาไทย" : lang === "en" ? "English" : META[lang][1].replace(/\s*\(.*\)$/, ""));
export async function setLang(l) {
  if (!META[l]) return;
  await load(l);
  lang = l;
  try { localStorage.setItem("nyxie.lang", lang); } catch (e) {}
  apply();
}

export function t(key, vars) {
  let s = (S[lang] && S[lang][key]) ?? S.en[key] ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
  return s;
}

export function fmtDate(d) {
  if (!d) return "—";
  const dt = new Date(String(d).length === 10 ? d + "T00:00:00" : d);
  if (isNaN(dt)) return "—";
  return dt.toLocaleDateString(locale(), { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDay(d) {
  if (!d) return "";
  const dt = new Date(String(d).length === 10 ? d + "T00:00:00" : d);
  return isNaN(dt) ? "" : dt.toLocaleDateString(locale(), { day: "numeric", month: "short" });
}

export function fmtNum(n) {
  n = +n || 0;
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e4) return Math.round(n / 1e3) + "K";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function timeAgo(ts) {
  const s = Math.max(1, (Date.now() - new Date(ts).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
  const steps = [[60, "second"], [60, "minute"], [24, "hour"], [7, "day"], [4.35, "week"], [12, "month"], [Infinity, "year"]];
  let v = s;
  for (const [n, u] of steps) { if (v < n) return rtf.format(-Math.floor(v), u); v /= n; }
}
