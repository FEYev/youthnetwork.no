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

function setLanguage(lang) {
  localStorage.setItem("yn_lang", lang);

  if (lang === "no") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname + ";";
    window.location.reload();
    return;
  }

  if (lang === "en") {
    document.cookie = "googtrans=/no/en; path=/;";
    document.cookie = "googtrans=/no/en; path=/; domain=" + location.hostname + ";";
    window.location.reload();
  }
}

function setupLanguageButtons() {
  const savedLang = localStorage.getItem("yn_lang") || "no";

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const text = btn.textContent.trim().toLowerCase();
    btn.classList.toggle("active", text === savedLang);
    btn.setAttribute("aria-pressed", String(text === savedLang));
  });
}

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

function setCurrentYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setCurrentYear();
  setupLanguageButtons();

  const div = document.createElement("div");
  div.id = "google_translate_element";
  div.style.display = "none";
  document.body.appendChild(div);
});
