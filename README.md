# Pay It 4Ward — Pickleball Academy

Website for **Pay It 4Ward**, a pickleball academy run by coach **Kai Chen**.
Static HTML/CSS/JS — no build step, no dependencies. Just edit and push.

**Live site:** https://edenkchen.github.io/pay-it-4ward/

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Home — hero, student reviews, photo slider, approach, coach preview |
| `about.html` | About Coach Kai |
| `programs.html` | The two lesson options, the 5-question assessment, ways to give back, FAQ |
| `gallery.html` | Full photo gallery + slider |
| `contact.html` | Contact details and message form |

---

## The things you'll actually want to change

### 1. The logo

The academy logo lives at **`assets/img/logo.png`** — a transparent PNG of the
circular badge. It appears in the top-left of every page, in the footer, as the
browser tab icon, and on the loading splash that plays when any page opens.

To change it later, overwrite that one file and every use updates. Keep it
square and transparent; around 500 x 500 px is plenty.

The flyer tagline is saved separately at `assets/img/tagline.png`. The site
doesn't use the image — "Feelin' stuck?" is set in live text above the homepage
headline so it stays sharp at any size.

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

### 3. Fill in the Venmo / Zelle handles

Lessons are free; the site asks people to pay it forward instead. On
`programs.html`, the "A donation" card currently shows **placeholders**:

```html
<li>Venmo: <span class="handle">@add-handle-here</span></li>
<li>Zelle: <span class="handle">add phone or email here</span></li>
```

Replace the text inside each `<span class="handle">`. If Kai would rather keep
his payment details off a public page, delete those two `<li>` lines and tell
people to ask him directly instead.

### 4. Edit the 5-question assessment

All the questions, answers, scoring and level bands live in one file:
**`assets/js/quiz-config.js`**. Nothing else needs touching.

- Each answer is worth **0-3 points**.
- Questions tagged `skill` add up to 0-9 and pick a band from `levelBands`.
- Questions tagged `commitment` add up to 0-6 and pick a note from `commitment`.
- An answer's optional `focus` line becomes part of the "what to work on" list
  (the lowest-scoring answers win, up to three).

To reword a question or answer, just change its text. To retune the bands,
change the `max` values. The file has comments explaining the shape.

The result is handed to the contact page through the browser's `sessionStorage`,
so the message field arrives pre-filled. Nothing is sent anywhere until the
visitor presses Send.

### 5. Turn on the contact form

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
- **Lessons:** `programs.html` holds the two options (individual and small
  group), the assessment, and the "ways to give back" cards.
- **The free / pay-it-forward message:** appears in the dark `freebar` block on
  both `index.html` and `programs.html`, and in the FAQ.
- **Colors:** `assets/css/styles.css`, the `:root` block at the very top. The
  palette is taken from the logo — `--lime` is the ball yellow `#EFD335`,
  `--coral` is the sky blue `#2BA3EE`, `--teal` is the forest green `#3F7A20`,
  and `--ink` is the near-black green background. Change them there and the
  whole site follows. (The variable names are historical; the values are what
  matter.)

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
│   ├── js/main.js              preloader, nav, carousel, quiz, form
│   ├── js/gallery-config.js    ← the photo list you edit
│   ├── js/quiz-config.js       ← the 5 questions and scoring
│   ├── img/                    logo.png, tagline.png, ball.svg, coach photo
│   └── gallery/                ← drop photos here
├── .nojekyll                   tells GitHub Pages to serve files as-is
└── README.md
```
