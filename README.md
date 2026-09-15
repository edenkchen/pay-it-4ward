# Pay It 4Ward — Pickleball Academy

Website for **Pay It 4Ward**, a pickleball academy run by coach **Kai Chen**.
Static HTML/CSS/JS — no build step, no dependencies. Just edit and push.

**Live site:** _add your GitHub Pages URL here once Pages is turned on_

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Home — hero, student reviews, photo slider, approach, coach preview |
| `about.html` | About Coach Kai |
| `programs.html` | Lessons, programs, and FAQ |
| `gallery.html` | Full photo gallery + slider |
| `contact.html` | Contact details and message form |

---

## The three things you'll actually want to change

### 1. Swap in the real logo

Replace **`assets/img/logo.svg`** with your logo. Two options:

- **Easiest:** save your logo as an SVG named `logo.svg` and overwrite that file.
  Everything updates automatically — nav, footer, favicon, and the loading screen.
- **PNG instead:** drop `logo.png` into `assets/img/`, then find-and-replace
  `assets/img/logo.svg` → `assets/img/logo.png` across the five `.html` files.

The logo appears in the top-left of every page, in the footer, as the browser tab
icon, and on the loading splash that plays when any page opens.

> If your logo already includes the words "Pay It 4Ward", delete the
> `<span class="brand__text">…</span>` block in each page's header so the name
> isn't printed twice.

### 2. Add photos to the slider and gallery

1. Put image files in **`assets/gallery/`**
2. Open **`assets/js/gallery-config.js`** and add one line per photo:

```js
window.P4W_GALLERY = [
  { src: "assets/gallery/clinic-01.jpg", alt: "Group clinic on court 3", caption: "Saturday morning clinic" },
  { src: "assets/gallery/kai-serve.jpg", alt: "Coach Kai demonstrating a serve", caption: "Serve mechanics" },
];
```

That's it. The homepage slider **and** the gallery page both read from this one
list. Until you add photos, friendly placeholders show instead of broken images.

*Sizing tip:* 1600 × 900 px (16:9) looks best in the slider. Keep files under
about 500 KB each so pages stay fast.

**Photo of Kai:** add `assets/img/coach-kai.jpg`, then in `index.html` and
`about.html` replace the `<div class="ph">…</div>` placeholder with:

```html
<img src="assets/img/coach-kai.jpg" alt="Coach Kai Chen on the court">
```

### 3. Turn on the contact form

The form currently falls back to opening the visitor's messaging app addressed to
917-459-8600. To get form submissions by email instead:

1. Sign up free at [formspree.io](https://formspree.io) and create a form.
2. Copy the endpoint it gives you (looks like `https://formspree.io/f/abcdwxyz`).
3. In `contact.html`, replace `https://formspree.io/f/YOUR_FORM_ID` with it.

Submissions then arrive in the inbox you registered, and visitors see a success
message without leaving the page.

---

## Publishing with GitHub Pages

1. Push this folder to a GitHub repository.
2. Repo → **Settings** → **Pages**
3. **Source:** `Deploy from a branch` · **Branch:** `main` · **Folder:** `/ (root)`
4. Save. In a minute or two the site is live at
   `https://<your-username>.github.io/<repo-name>/`

To use a custom domain later, add a file named `CNAME` at the root containing
just your domain (e.g. `payit4ward.com`), then point the domain's DNS at GitHub.

---

## Editing content

Everything is plain HTML — open a file, find the text, change it, save.

- **Phone number:** search all files for `917-459-8600` and `+19174598600`
- **Reviews:** in the `<section id="reviews">` block of `index.html` (and repeated
  near the bottom of `about.html`). Copy an existing `<figure class="review">`
  block to add a third.
- **Prices:** `programs.html` — each card says "Contact for rates"; replace with
  real numbers when you're ready.
- **Colors:** `assets/css/styles.css`, the `:root` block at the very top. Change
  `--lime`, `--coral`, `--teal` and the whole site follows.

---

## Running it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Opening the HTML files directly also works.)

---

## Structure

```
.
├── index.html · about.html · programs.html · gallery.html · contact.html
├── assets/
│   ├── css/styles.css          design system + all styles
│   ├── js/main.js              preloader, nav, carousel, form
│   ├── js/gallery-config.js    ← the photo list you edit
│   ├── img/                    logo, ball graphic, coach photo
│   └── gallery/                ← drop photos here
├── .nojekyll                   tells GitHub Pages to serve files as-is
└── README.md
```
