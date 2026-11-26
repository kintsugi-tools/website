/* Kintsugi, cinematic site behavior. No framework, no build step. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Copy install commands (exact string) ---------- */
  function bindCopy(root) {
    var scope = root || document;
    var buttons = scope.querySelectorAll("[data-copy]");
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].dataset.bound) continue;
      buttons[i].dataset.bound = "1";
      buttons[i].addEventListener("click", function () {
        var btn = this;
        var text = btn.getAttribute("data-copy") || "";
        var done = function () {
          btn.textContent = "Copied";
          btn.setAttribute("data-copied", "true");
          clearTimeout(btn._copyTimer);
          btn._copyTimer = setTimeout(function () {
            btn.textContent = "Copy";
            btn.removeAttribute("data-copied");
          }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
        } else {
          fallback(text, done);
        }
      });
    }
  }

  function fallback(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }

  /* ---------- Scroll reveals ---------- */
  function bindReveals() {
    var items = document.querySelectorAll(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-in");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (!el.style.getPropertyValue("--d") && el.dataset.delay) {
            el.style.setProperty("--d", el.dataset.delay + "ms");
          }
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  /* ---------- Chapter visual state ---------- */
  function bindChapterVisuals() {
    var els = document.querySelectorAll(".chapter-visual");
    if (!els.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    }, { threshold: 0.15 });
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  }

  /* ---------- Lazy, in-view video clips ---------- */
  function bindClips() {
    var clips = document.querySelectorAll("video.clip[data-src]");
    if (!clips.length) return;
    if (reduce || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    for (var i = 0; i < clips.length; i++) io.observe(clips[i]);
  }

  /* ---------- Signature: gold thread draws across the dark ---------- */
  function bindThread() {
    var section = document.querySelector(".thread");
    if (!section) return;
    var svg = section.querySelector(".thread-svg");
    var gold = section.querySelector(".thread-gold");
    var nodes = section.querySelectorAll(".thread-node");
    if (!svg || !gold) return;
    try {
      svg.style.setProperty("--thread-len", gold.getTotalLength().toFixed(1));
    } catch (e) { /* keep CSS fallback */ }

    function paint(p) {
      section.style.setProperty("--thread", p.toFixed(3));
      for (var i = 0; i < nodes.length; i++) {
        var at = parseFloat(nodes[i].getAttribute("data-at") || "0.5");
        if (p >= at) nodes[i].classList.add("lit");
        else nodes[i].classList.remove("lit");
      }
    }

    if (reduce) { paint(1); return; }

    var ticking = false;
    function update() {
      ticking = false;
      var rect = section.getBoundingClientRect();
      var travel = rect.height - window.innerHeight;
      var p = travel > 0 ? (-rect.top) / travel : 0;
      p = Math.max(0, Math.min(1, p));
      paint(1 - Math.pow(1 - p, 2.1));
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- Parallax (subtle, transform only) ---------- */
  function bindParallax() {
    if (reduce) return;
    var items = document.querySelectorAll("[data-parallax]");
    if (!items.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = 0; i < items.length; i++) {
        var el = items[i];
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        var speed = parseFloat(el.dataset.parallax) || 0.08;
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) * -speed;
        el.style.setProperty("--py", offset.toFixed(1) + "px");
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- Count-up numbers ---------- */
  function bindCounters() {
    var items = document.querySelectorAll("[data-count]");
    if (!items.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].textContent = items[i].dataset.count;
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || "";
        var prefix = el.dataset.prefix || "";
        var decimals = (el.dataset.count.split(".")[1] || "").length;
        if (isNaN(target)) { el.textContent = el.dataset.count; return; }
        var start = null;
        var dur = 1400;
        function frame(ts) {
          if (start === null) start = ts;
          var t = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          var value = target * eased;
          el.textContent = prefix + (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US")) + suffix;
          if (t < 1) requestAnimationFrame(frame);
          else el.textContent = prefix + el.dataset.count + suffix;
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.5 });
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  /* ---------- Header scrolled state ---------- */
  function bindHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function update() { header.classList.toggle("scrolled", window.scrollY > 18); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Pointer glow on cards / hero stage ---------- */
  function bindPointerGlow() {
    if (reduce || !finePointer) return;
    var cards = document.querySelectorAll(".bento-card, .stage");
    for (var i = 0; i < cards.length; i++) {
      (function (el) {
        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          var x = ((e.clientX - r.left) / r.width) * 100;
          var y = ((e.clientY - r.top) / r.height) * 100;
          if (el.classList.contains("stage")) {
            el.style.setProperty("--mx", ((x - 50) / 9).toFixed(1) + "px");
            el.style.setProperty("--my", ((y - 50) / 9).toFixed(1) + "px");
          } else {
            el.style.setProperty("--bx", x.toFixed(1) + "%");
            el.style.setProperty("--by", y.toFixed(1) + "%");
          }
        });
        el.addEventListener("pointerleave", function () {
          el.style.setProperty("--mx", "0px");
          el.style.setProperty("--my", "0px");
        });
      })(cards[i]);
    }
  }

  /* ---------- Theme toggle (persisted) ---------- */
  function bindTheme() {
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    try {
      if ((localStorage.getItem("kintsugi-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "")) === "dark") document.documentElement.setAttribute("data-theme", "dark");
    } catch (e) { /* no-op */ }
    function label() {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
    btn.addEventListener("click", function () {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      if (dark) document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", "dark");
      try { localStorage.setItem("kintsugi-theme", dark ? "light" : "dark"); } catch (e) { /* no-op */ }
      label();
    });
    label();
  }

  /* ---------- Mobile menu ---------- */
  function bindNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!btn || !nav) return;
    function set(open, refocus) {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (refocus) btn.focus();
    }
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") set(false, true);
    });
    matchMedia("(min-width: 721px)").addEventListener("change", function (e) { if (e.matches) set(false); });
  }

  function init() {
    bindNav();
    bindCopy(document);
    bindReveals();
    bindChapterVisuals();
    bindClips();
    bindThread();
    bindParallax();
    bindCounters();
    bindHeader();
    bindPointerGlow();
    bindTheme();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
