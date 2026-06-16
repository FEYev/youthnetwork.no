/**
 * Youth Network — Auto-translate system
 */

const PAGE_KEY = window.location.pathname.endsWith("/")
  ? "index.html"
  : window.location.pathname.split("/").pop();

const CACHE_KEY = "yn_translation_cache_en_" + PAGE_KEY;
const LANG_KEY  = "yn_lang";

/* ---------- Collect all translatable text nodes ---------- */
function getNodes() {
  return [...document.querySelectorAll("[data-i18n]")];
}

/* ---------- Store original NO text on first load ---------- */
function storeOriginals() {
  getNodes().forEach(el => {
    if (!el.dataset.origText) {
      el.dataset.origText = el.textContent.trim();
    }
  });
}

/* ---------- Restore Norwegian ---------- */
function applyNO() {
  getNodes().forEach(el => {
    if (el.dataset.origText) el.textContent = el.dataset.origText;
  });
  document.documentElement.lang = "no";
  document.body.dataset.lang = "no";
  localStorage.setItem(LANG_KEY, "no");
  setLangButtons("no");

  const titleKey = document.body.dataset.titleKey;
  if (titleKey) {
    const orig = document.body.dataset.origTitle;
    if (orig) document.title = orig;
  }
}

/* ---------- Apply cached English ---------- */
function applyCachedEN(cache) {
  getNodes().forEach(el => {
    const key = el.dataset.i18n;
    if (cache[key]) el.textContent = cache[key];
  });
  document.documentElement.lang = "en";
  document.body.dataset.lang = "en";
  localStorage.setItem(LANG_KEY, "en");
  setLangButtons("en");

  if (cache["__title__"]) document.title = cache["__title__"];
}

/* ---------- Translate via MyMemory API ---------- */
async function translateAll() {
  const nodes = getNodes();

  // Collect unique texts
  const texts = [...new Set(nodes.map(el => el.dataset.origText).filter(Boolean))];

  // Title
  const origTitle = document.body.dataset.origTitle || document.title;

  // Build batch: max 500 chars per request to stay inside free limit
  const cache = {};

  async function translateText(text) {
    if (!text || text.trim().length === 0) return text;
    // Skip if already English-looking (short codes like OID numbers)
    if (/^[A-Z0-9\s\+\@\.\:\/]+$/.test(text) && text.length < 30) return text;
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=no|en`;
      const res = await fetch(url);
      if (!res.ok) return text;
      const data = await res.json();
      return data?.responseData?.translatedText || text;
    } catch {
      return text;
    }
  }

  // Translate in small parallel batches
  const BATCH = 5;
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(t => translateText(t)));
    batch.forEach((t, idx) => { cache[t] = results[idx]; });
  }

  // Translate title
  cache["__title__"] = await translateText(origTitle);

  // Map data-i18n keys → translated text
  const keyCache = {};
  nodes.forEach(el => {
    const key = el.dataset.i18n;
    const orig = el.dataset.origText;
    if (orig && cache[orig]) keyCache[key] = cache[orig];
  });
  keyCache["__title__"] = cache["__title__"];

  // Save to localStorage
  localStorage.setItem(CACHE_KEY, JSON.stringify(keyCache));
  return keyCache;
}

/* ---------- Language button state ---------- */
function setLangButtons(lang) {
  document.querySelectorAll("[data-lang-button]").forEach(btn => {
    const active = btn.dataset.langButton === lang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

/* ---------- Show loading indicator ---------- */
function showLoading(show) {
  let el = document.getElementById("yn-translate-loading");
  if (show) {
    if (!el) {
      el = document.createElement("div");
      el.id = "yn-translate-loading";
      el.style.cssText = "position:fixed;top:90px;right:20px;background:#9c1aa7;color:#fff;padding:10px 18px;border-radius:999px;font-size:.88rem;font-weight:700;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2);";
      el.textContent = "Translating…";
      document.body.appendChild(el);
    }
    el.style.display = "block";
  } else {
    if (el) el.style.display = "none";
  }
}

/* ---------- Switch to English ---------- */
async function switchToEN() {
  // Check cache first
  const raw = localStorage.getItem(CACHE_KEY);
  if (raw) {
    try {
      const cache = JSON.parse(raw);
      applyCachedEN(cache);
      return;
    } catch {}
  }

  // Need to fetch
  showLoading(true);
  try {
    const cache = await translateAll();
    applyCachedEN(cache);
  } catch (err) {
    console.warn("Translation failed:", err);
  } finally {
    showLoading(false);
  }
}

/* ---------- Navigation toggle ---------- */
function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav    = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Year ---------- */
function setCurrentYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setCurrentYear();
  storeOriginals();

  // Save original title
  document.body.dataset.origTitle = document.title;

  // Language buttons
  document.querySelectorAll("[data-lang-button]").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.langButton;
      if (lang === "en") {
        switchToEN();
      } else {
        applyNO();
      }
    });
  });

  // Restore saved language
  const saved = localStorage.getItem(LANG_KEY) || "no";
  if (saved === "en") {
    switchToEN();
  } else {
    setLangButtons("no");
  }
});
