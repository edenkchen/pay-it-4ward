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
     7. FOOTER YEAR
     ================================================================ */
  $$("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
