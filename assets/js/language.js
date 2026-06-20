/**
 * Youth Network — Automatic Google Translate system
 * Norwegian is the original language.
 */

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "no",
      includedLanguages: "no,en",
      autoDisplay: false
    },
    "google_translate_element"
  );
}

/**
 * Delete Google Translate cookies from all likely paths/domains.
 * This is needed because Google Translate may keep EN active
 * even after the visible text briefly returns to Norwegian.
 */
function clearGoogleTranslateCookies() {
  const hostname = window.location.hostname;
  const domainParts = hostname.split(".");
  const rootDomain =
    domainParts.length >= 2
      ? "." + domainParts.slice(-2).join(".")
      : hostname;

  const cookieSettings = [
    "path=/",
    "path=/; domain=" + hostname,
    "path=/; domain=." + hostname,
    "path=/; domain=" + rootDomain
  ];

  cookieSettings.forEach((setting) => {
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; " + setting + ";";
  });
}

/**
 * Set Google Translate cookie for English.
 */
function setGoogleTranslateToEnglish() {
  const hostname = window.location.hostname;
  const domainParts = hostname.split(".");
  const rootDomain =
    domainParts.length >= 2
      ? "." + domainParts.slice(-2).join(".")
      : hostname;

  document.cookie = "googtrans=/no/en; path=/;";
  document.cookie = "googtrans=/no/en; path=/; domain=" + hostname + ";";
  document.cookie = "googtrans=/no/en; path=/; domain=" + rootDomain + ";";
}

/**
 * Main language switch.
 */
function setLanguage(lang) {
  if (lang === "no") {
    localStorage.setItem("yn_lang", "no");
    clearGoogleTranslateCookies();

    // Force reload without Google Translate cookie
    window.location.href = window.location.pathname + window.location.search;
    return;
  }

  if (lang === "en") {
    localStorage.setItem("yn_lang", "en");
    setGoogleTranslateToEnglish();

    // Force reload so Google Translate applies cleanly
    window.location.href = window.location.pathname + window.location.search;
  }
}

/**
 * Button active state.
 * Works with NO/EN text or flag buttons using onclick.
 */
function setupLanguageButtons() {
  const savedLang = localStorage.getItem("yn_lang") || "no";

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const onclickValue = btn.getAttribute("onclick") || "";
    const isNo = onclickValue.includes("'no'") || onclickValue.includes('"no"');
    const isEn = onclickValue.includes("'en'") || onclickValue.includes('"en"');

    const active =
      (savedLang === "no" && isNo) ||
      (savedLang === "en" && isEn);

    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

/**
 * Mobile navigation.
 */
function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/**
 * Footer year.
 */
function setCurrentYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = new Date().getFullYear();
}

/**
 * Initial setup.
 */
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setCurrentYear();
  setupLanguageButtons();

  if (!document.getElementById("google_translate_element")) {
    const div = document.createElement("div");
    div.id = "google_translate_element";
    div.style.display = "none";
    document.body.appendChild(div);
  }

  const savedLang = localStorage.getItem("yn_lang") || "no";

  // If user selected Norwegian, remove any leftover Google Translate state.
  if (savedLang === "no") {
    clearGoogleTranslateCookies();
    document.documentElement.lang = "no";
  }
});
