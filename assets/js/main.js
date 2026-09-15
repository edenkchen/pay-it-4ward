/* ==========================================================================
   Pay It 4Ward Pickleball Academy — site scripts
   Preloader · navigation · photo carousel · gallery grid · reveal · form
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- utils */
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ================================================================
     1. PRELOADER — logo splash shown on every page load
     ================================================================ */
  (function preloader() {
    var el = $("#preloader");
    if (!el) return;

    var MIN_MS = 700;                 // keep the logo on screen at least this long
    var start = Date.now();
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      var wait = Math.max(0, MIN_MS - (Date.now() - start));
      setTimeout(function () {
        el.classList.add("is-done");
        document.body.style.removeProperty("overflow");
        setTimeout(function () { el.setAttribute("hidden", ""); }, 600);
      }, wait);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("load", finish);
    setTimeout(finish, 3500);         // safety net if something stalls
  })();

  /* ================================================================
     2. NAVIGATION — mobile toggle + sticky shadow + current page
     ================================================================ */
  (function nav() {
    var toggle = $("#navToggle");
    var links  = $("#navLinks");
    var header = $("#siteHeader");

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      $$("a", links).forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // mark the current page in the nav
    var here = location.pathname.split("/").pop() || "index.html";
    $$(".nav__links a").forEach(function (a) {
      var target = a.getAttribute("href");
      if (target === here) a.setAttribute("aria-current", "page");
    });
  })();

  /* ================================================================
     3. CAROUSEL — builds slides from assets/js/gallery-config.js
     ================================================================ */
  (function carousel() {
    var root = $("#carousel");
    if (!root) return;

    var track = $(".carousel__track", root);
    var dots  = $(".carousel__dots", root);
    var prev  = $(".carousel__btn--prev", root);
    var next  = $(".carousel__btn--next", root);

    var photos = Array.isArray(window.P4W_GALLERY) ? window.P4W_GALLERY : [];
    var index = 0;
    var timer = null;
    var AUTOPLAY_MS = 5200;

    /* ---- build the slides ---- */
    if (photos.length) {
      photos.forEach(function (photo, i) {
        var slide = document.createElement("div");
        slide.className = "carousel__slide";
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", (i + 1) + " of " + photos.length);

        var img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt || "";
        img.loading = i === 0 ? "eager" : "lazy";
        img.decoding = "async";
        slide.appendChild(img);

        if (photo.caption) {
          var cap = document.createElement("div");
          cap.className = "carousel__caption";
          cap.textContent = photo.caption;
          slide.appendChild(cap);
        }
        track.appendChild(slide);
      });
    } else {
      /* no photos yet — show three friendly placeholders */
      [
        ["🎾", "Photos coming soon", "Drop images into assets/gallery/ and list them in assets/js/gallery-config.js"],
        ["🏓", "Clinics & group sessions", "This slot is ready for your court photos"],
        ["🏆", "Student milestones", "Add a caption with each picture"]
      ].forEach(function (ph, i) {
        var slide = document.createElement("div");
        slide.className = "carousel__slide";
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", (i + 1) + " of 3");
        slide.innerHTML =
          '<div class="carousel__placeholder">' +
            '<div class="ph-icon">' + ph[0] + "</div>" +
            "<strong>" + ph[1] + "</strong>" +
            "<small>" + ph[2] + "</small>" +
          "</div>";
        track.appendChild(slide);
      });
    }

    var slides = $$(".carousel__slide", track);
    var count = slides.length;
    if (!count) return;

    /* ---- dots ---- */
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Go to photo " + (i + 1));
      b.addEventListener("click", function () { go(i); restart(); });
      dots.appendChild(b);
    });
    var dotBtns = $$("button", dots);

    function go(i) {
      index = (i + count) % count;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dotBtns.forEach(function (d, n) {
        d.setAttribute("aria-selected", String(n === index));
      });
      slides.forEach(function (s, n) {
        s.setAttribute("aria-hidden", String(n !== index));
      });
    }

    function nextSlide() { go(index + 1); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }
    function play()  { if (count > 1 && !timer) timer = setInterval(nextSlide, AUTOPLAY_MS); }
    function restart() { stop(); play(); }

    prev && prev.addEventListener("click", function () { go(index - 1); restart(); });
    next && next.addEventListener("click", function () { go(index + 1); restart(); });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", play);

    /* ---- keyboard ---- */
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft")  { go(index - 1); restart(); }
      if (e.key === "ArrowRight") { go(index + 1); restart(); }
    });

    /* ---- swipe ---- */
    var x0 = null;
    root.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX; stop();
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      x0 = null;
      play();
    });

    /* ---- pause when tab is hidden ---- */
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : play();
    });

    go(0);
    play();
  })();

  /* ================================================================
     4. GALLERY PAGE — same photo list rendered as a grid
     ================================================================ */
  (function galleryGrid() {
    var grid = $("#galleryGrid");
    if (!grid) return;

    var photos = Array.isArray(window.P4W_GALLERY) ? window.P4W_GALLERY : [];

    if (!photos.length) {
      var n = 6;
      for (var i = 0; i < n; i++) {
        var fig = document.createElement("figure");
        fig.innerHTML =
          '<figcaption>📷<br>Photo slot ' + (i + 1) +
          "<br><small>Add images to assets/gallery/</small></figcaption>";
        grid.appendChild(fig);
      }
      return;
    }

    photos.forEach(function (photo) {
      var fig = document.createElement("figure");
      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      fig.appendChild(img);
      grid.appendChild(fig);
    });
  })();

  /* ================================================================
     5. SCROLL REVEAL
     ================================================================ */
  (function reveal() {
    var items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + "ms";
      io.observe(el);
    });
  })();

  /* ================================================================
     6. CONTACT FORM
     Works with Formspree. If no endpoint is configured yet, the form
     falls back to opening a pre-filled text message / email instead of
     silently failing.
     ================================================================ */
  (function contactForm() {
    var form = $("#contactForm");
    if (!form) return;

    var status = $("#formStatus");
    var action = form.getAttribute("action") || "";
    var configured = action.indexOf("YOUR_FORM_ID") === -1 && action.indexOf("http") === 0;

    function say(msg, ok) {
      if (!status) return;
      status.hidden = false;
      status.textContent = msg;
      status.className = "form__status " + (ok ? "form__status--ok" : "form__status--err");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);

      if (!configured) {
        // No Formspree endpoint yet — hand the message off to the phone's SMS app.
        var body =
          "Pickleball lesson inquiry%0A%0A" +
          "Name: " + encodeURIComponent(data.get("name") || "") + "%0A" +
          "Email: " + encodeURIComponent(data.get("email") || "") + "%0A" +
          "Level: " + encodeURIComponent(data.get("level") || "") + "%0A" +
          "Message: " + encodeURIComponent(data.get("message") || "");
        say("Opening your messaging app so you can send this to Coach Kai directly.", true);
        window.location.href = "sms:+19174598600?&body=" + body;
        return;
      }

      var btn = $("button[type=submit]", form);
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            say("Thanks! Your message is on its way — Coach Kai will get back to you soon.", true);
          } else {
            say("Something went wrong. Please call or text 917-459-8600 instead.", false);
          }
        })
        .catch(function () {
          say("Network hiccup. Please call or text 917-459-8600 instead.", false);
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
  })();

  /* ================================================================
     6b. SELF-ASSESSMENT QUIZ
     Questions live in assets/js/quiz-config.js. The result is handed to
     the contact page through sessionStorage so Kai sees it when someone
     reaches out. Nothing is sent anywhere until they submit the form.
     ================================================================ */
  (function quiz() {
    var root = $("#quiz");
    if (!root) return;

    var cfg = window.P4W_QUIZ;
    if (!cfg || !cfg.questions || !cfg.questions.length) return;

    var qs = cfg.questions;
    var answers = new Array(qs.length).fill(null);
    var step = 0;

    var bar    = $("#quizBar", root);
    var body   = $("#quizBody", root);
    var result = $("#quizResult", root);

    var LETTERS = ["A", "B", "C", "D", "E"];

    function progress() {
      var done = answers.filter(function (a) { return a !== null; }).length;
      if (bar) bar.style.width = Math.round((done / qs.length) * 100) + "%";
    }

    function render() {
      var q = qs[step];
      body.innerHTML = "";

      var count = document.createElement("p");
      count.className = "quiz__count";
      count.textContent = "Question " + (step + 1) + " of " + qs.length;
      body.appendChild(count);

      var h = document.createElement("p");
      h.className = "quiz__q";
      h.textContent = q.q;
      body.appendChild(h);

      if (q.help) {
        var help = document.createElement("p");
        help.className = "quiz__help";
        help.textContent = q.help;
        body.appendChild(help);
      }

      var list = document.createElement("div");
      list.className = "quiz__options";

      q.options.forEach(function (opt, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "quiz__option";
        b.setAttribute("aria-pressed", String(answers[step] === i));

        var key = document.createElement("span");
        key.className = "quiz__key";
        key.textContent = LETTERS[i] || String(i + 1);
        b.appendChild(key);

        var txt = document.createElement("span");
        txt.textContent = opt.label;
        b.appendChild(txt);

        b.addEventListener("click", function () {
          answers[step] = i;
          progress();
          $$(".quiz__option", list).forEach(function (o, n) {
            o.setAttribute("aria-pressed", String(n === i));
          });
          setTimeout(function () {
            if (step < qs.length - 1) { step++; render(); }
            else { finish(); }
          }, 220);
        });

        list.appendChild(b);
      });
      body.appendChild(list);

      var nav = document.createElement("div");
      nav.className = "quiz__nav";
      var back = document.createElement("button");
      back.type = "button";
      back.className = "quiz__back";
      back.textContent = "← Back";
      back.hidden = step === 0;
      back.addEventListener("click", function () { step--; render(); });
      nav.appendChild(back);
      body.appendChild(nav);

      progress();
    }

    function pick(table, score) {
      for (var i = 0; i < table.length; i++) {
        if (score <= table[i].max) return table[i];
      }
      return table[table.length - 1];
    }

    function finish() {
      var skill = 0, commit = 0, focus = [];

      qs.forEach(function (q, i) {
        var opt = q.options[answers[i]];
        if (!opt) return;
        if (q.type === "commitment") commit += opt.points;
        else {
          skill += opt.points;
          if (opt.focus) focus.push({ text: opt.focus, points: opt.points });
        }
      });

      var band = pick(cfg.levelBands, skill);
      var mood = pick(cfg.commitment, commit);

      // weakest areas first, at most three
      focus.sort(function (a, b) { return a.points - b.points; });
      var focusText = focus.slice(0, 3).map(function (f) { return f.text; });

      var suggestion = mood.suggest === "group"
        ? { key: "group",      name: "Small group session (2–3 players)" }
        : { key: "individual", name: "Individual lesson" };

      // hand the result to the contact page
      var payload = {
        band: band.band,
        name: band.name,
        focus: focusText,
        mood: mood.label,
        suggest: suggestion.key,
        suggestName: suggestion.name,
        answers: qs.map(function (q, i) {
          var o = q.options[answers[i]];
          return { q: q.q, a: o ? o.label : "" };
        })
      };
      try { sessionStorage.setItem("p4w_quiz", JSON.stringify(payload)); } catch (e) {}

      body.hidden = true;
      if (bar) bar.style.width = "100%";

      result.innerHTML =
        '<div class="result__band">' +
          "<b>" + band.band + "</b>" +
          "<strong>" + band.name + "</strong>" +
          "<small>Your self-assessed starting point</small>" +
        "</div>" +
        "<p>" + band.blurb + "</p>" +
        '<p class="result__caveat">This is a self-assessment, not an official ' +
          "USA Pickleball or DUPR rating — those come from rated matches. It just " +
          "gives Kai a sensible place to start on day one, and he'll adjust once " +
          "he sees you play.</p>" +
        "<h3>What to work on first</h3>" +
        '<ul class="result__focus">' +
          (focusText.length
            ? focusText.map(function (f) { return "<li>" + f + "</li>"; }).join("")
            : "<li>Sharpening what you already do well — Kai will find the gaps on court.</li>") +
        "</ul>" +
        '<span class="result__tag">' + mood.label + "</span>" +
        "<p>" + mood.note + "</p>" +
        "<h3>Suggested starting point</h3>" +
        "<p><strong>" + suggestion.name + "</strong> — but either option is open to you; " +
          "pick whichever you'd enjoy more.</p>" +
        '<div class="btn-row" style="margin-top:22px">' +
          '<a class="btn" href="contact.html?from=quiz">Take this to Kai</a>' +
          '<button class="btn btn--ghost" type="button" id="quizReset">Start over</button>' +
        "</div>";

      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "center" });

      var reset = $("#quizReset", result);
      reset && reset.addEventListener("click", function () {
        answers = new Array(qs.length).fill(null);
        step = 0;
        try { sessionStorage.removeItem("p4w_quiz"); } catch (e) {}
        result.hidden = true;
        body.hidden = false;
        render();
        root.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    render();
  })();

  /* ================================================================
     6c. CARRY THE QUIZ RESULT INTO THE CONTACT FORM
     ================================================================ */
  (function prefillFromQuiz() {
    var form = $("#contactForm");
    if (!form) return;

    var raw = null;
    try { raw = sessionStorage.getItem("p4w_quiz"); } catch (e) { return; }
    if (!raw) return;

    var data;
    try { data = JSON.parse(raw); } catch (e) { return; }
    if (!data || !data.band) return;

    // level select
    var level = $("#level", form);
    if (level) {
      var wanted = data.name.toLowerCase();
      $$("option", level).forEach(function (o) {
        if (o.textContent.toLowerCase().indexOf(wanted) !== -1) level.value = o.value;
      });
    }

    // lesson type select
    var interest = $("#interest", form);
    if (interest) {
      var key = data.suggest === "group" ? "group" : "individual";
      $$("option", interest).forEach(function (o) {
        if (o.textContent.toLowerCase().indexOf(key) !== -1) interest.value = o.value;
      });
    }

    // message
    var msg = $("#message", form);
    if (msg && !msg.value.trim()) {
      var lines = [
        "I took the self-assessment and came out at " + data.band + " (" + data.name + ").",
        ""
      ];
      if (data.focus && data.focus.length) {
        lines.push("Things to work on:");
        data.focus.forEach(function (f) { lines.push("- " + f); });
        lines.push("");
      }
      if (data.answers && data.answers.length) {
        lines.push("My answers:");
        data.answers.forEach(function (a) { lines.push("- " + a.q + " " + a.a); });
      }
      msg.value = lines.join("\n");
    }

    var flag = $("#quizFlag");
    if (flag) {
      flag.hidden = false;
      flag.textContent = "Filled in from your self-assessment (" + data.band +
                         " · " + data.name + "). Edit anything you like before sending.";
    }
  })();

  /* ================================================================
     7. FOOTER YEAR
     ================================================================ */
  $$("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
