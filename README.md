# Youth Network static website

This is a simple static website for Youth Network, ready for GitHub Pages.

## File structure

```text
/index.html
/about.html
/focus-areas.html
/projects.html
/news.html
/events.html
/contact.html
/assets/css/style.css
/assets/js/language.js
/assets/img/logo.png
/README.md
```

## How to upload to GitHub

1. Create a new repository on GitHub, for example `youth-network-website`.
2. Unzip the website package on your computer.
3. Upload all files and folders to the root of the repository. The file `index.html` must be in the root, not inside an extra folder.
4. Commit the files.

## How to enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings**.
3. Open **Pages** from the left menu.
4. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
5. Save. GitHub will publish the website after a short time.

## How to edit text

Most visible text is written in the HTML files and also in `assets/js/language.js` for the language switch.

For a small edit that only needs Norwegian, edit the text in the relevant HTML file.

For a proper bilingual edit, update the same text key in both languages inside `assets/js/language.js`:

```js
translations.no["example.key"] = "Norwegian text";
translations.en["example.key"] = "English text";
```

In the current files, text is stored as `data-i18n` keys. Keep these attributes if you want the NO/EN switch to continue working.

## How to add news

1. Open `news.html`.
2. Copy one of the existing `<article class="news-card">` blocks.
3. Change the date label, title and text.
4. For bilingual support, add matching keys in `assets/js/language.js` under both `no` and `en`.

The existing news cards are placeholders and are marked with comments in the HTML.

## How to add events

1. Open `events.html`.
2. Copy one of the existing `<article class="event-card">` blocks.
3. Change the date, title, location and description.
4. For bilingual support, add matching keys in `assets/js/language.js` under both `no` and `en`.

The existing event cards are placeholders and are marked with comments in the HTML.

## How to replace the logo

1. Prepare a new logo file in PNG format.
2. Name it `logo.png`.
3. Replace the file at `assets/img/logo.png`.
4. Keep the same filename so all pages continue to load the logo automatically.

## How the Norwegian/English language switch works

The website uses `assets/js/language.js`.

- Norwegian is the default language.
- The buttons **NO** and **EN** in the header change all elements that have a `data-i18n` attribute.
- The selected language is saved in the browser with `localStorage`, so the choice remains when moving between pages.
- No Google Translate, external widget, backend or database is used.

## Local testing

You can test the website by opening `index.html` directly in a browser. No server or build tool is required.
