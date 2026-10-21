/* ==========================================================================
   ZYNERO — site behaviour
   Navigation, reveal-on-scroll, offer cards and the contact form.
   No third-party code, no tracking, no cookies.
   ========================================================================== */
(function () {
  "use strict";

  var SUPPORT_EMAIL = "support@zynero.in";
  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  /* ---------- Header: border on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("mobile-panel");

  function setNav(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (open) {
      var first = panel.querySelector("a");
      if (first) first.focus();
    }
  }
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setNav(false);
    });
  }

  /* ---------- Footer year ---------- */
  var yearEls = document.querySelectorAll("[data-year]");
  for (var y = 0; y < yearEls.length; y++) yearEls[y].textContent = String(new Date().getFullYear());

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---------- Helpers ---------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }
  var SVG_NS = "http://www.w3.org/2000/svg";
  function icon(pathD) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    var p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", pathD);
    svg.appendChild(p);
    return svg;
  }
  var CHECK = "M20 6 9 17l-5-5";
  var ARROW = "M5 12h14M13 6l6 6-6 6";

  function isSafeUrl(url) {
    try {
      var u = new URL(url);
      return u.protocol === "https:";
    } catch (e) {
      return false;
    }
  }
  function isActive(offer) {
    if (!offer || !offer.store || !offer.rate || !isSafeUrl(offer.url)) return false;
    if (!offer.validUntil) return true;
    var end = new Date(offer.validUntil + "T23:59:59");
    return !isNaN(end) && end >= new Date();
  }
  function formatDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  /* ---------- Offers page ---------- */
  var offerApp = document.getElementById("offer-app");
  if (offerApp) {
    var all = (Array.isArray(window.ZYNERO_OFFERS) ? window.ZYNERO_OFFERS : []).filter(isActive);
    var launch = document.getElementById("offers-launch");
    var grid = document.getElementById("offer-grid");
    var filters = document.getElementById("offer-filters");
    var search = document.getElementById("offer-search");
    var noResults = document.getElementById("offer-no-results");
    var countEl = document.getElementById("offer-count");
    var state = { category: "All", q: "" };

    if (all.length) {
      offerApp.hidden = false;
      if (launch) launch.hidden = true;

      var cats = ["All"];
      all.forEach(function (o) {
        if (o.category && cats.indexOf(o.category) === -1) cats.push(o.category);
      });
      cats.forEach(function (c) {
        var b = el("button", "filter-btn", c);
        b.type = "button";
        b.setAttribute("aria-pressed", c === "All" ? "true" : "false");
        b.addEventListener("click", function () {
          state.category = c;
          Array.prototype.forEach.call(filters.children, function (x) {
            x.setAttribute("aria-pressed", x === b ? "true" : "false");
          });
          render();
        });
        filters.appendChild(b);
      });
      if (search) {
        search.addEventListener("input", function () {
          state.q = search.value.trim().toLowerCase();
          render();
        });
      }
      render();
    }

    function card(o) {
      var art = el("article", "offer");
      var top = el("div", "offer-top");
      var store = el("div", "offer-store");
      store.appendChild(el("h3", "", o.store));
      if (o.category) store.appendChild(el("span", "chip", o.category));
      top.appendChild(store);
      var rate = el("div", "offer-rate", o.rate);
      if (o.rateNote) rate.appendChild(el("small", "", o.rateNote));
      top.appendChild(rate);
      art.appendChild(top);

      var body = el("div", "offer-body");
      if (Array.isArray(o.conditions) && o.conditions.length) {
        var ul = el("ul", "offer-terms");
        ul.setAttribute("aria-label", "Conditions");
        o.conditions.forEach(function (c) {
          var li = el("li");
          li.appendChild(icon(CHECK));
          li.appendChild(el("span", "", c));
          ul.appendChild(li);
        });
        body.appendChild(ul);
      }
      var dl = el("dl", "offer-meta");
      [
        ["Tracks", o.trackingTime],
        ["Confirms", o.confirmationTime],
        ["Valid until", o.validUntil ? formatDate(o.validUntil) : ""]
      ].forEach(function (pair) {
        if (!pair[1]) return;
        var d = el("div");
        d.appendChild(el("dt", "", pair[0]));
        d.appendChild(el("dd", "", pair[1]));
        dl.appendChild(d);
      });
      if (dl.children.length) body.appendChild(dl);

      var a = el("a", "btn btn--violet btn--block", "Shop via ZYNERO");
      a.href = o.url;
      a.target = "_blank";
      a.rel = "sponsored noopener noreferrer";
      a.setAttribute("aria-label", "Shop " + o.store + " via ZYNERO (opens in a new tab)");
      a.appendChild(icon(ARROW));
      body.appendChild(a);
      art.appendChild(body);
      return art;
    }

    function render() {
      var list = all.filter(function (o) {
        var inCat = state.category === "All" || o.category === state.category;
        var hay = (o.store + " " + (o.category || "") + " " + (o.conditions || []).join(" ")).toLowerCase();
        return inCat && (!state.q || hay.indexOf(state.q) !== -1);
      });
      grid.textContent = "";
      list.forEach(function (o) {
        grid.appendChild(card(o));
      });
      if (noResults) noResults.hidden = list.length > 0;
      if (countEl) countEl.textContent = list.length + (list.length === 1 ? " offer" : " offers");
    }
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var topicSelect = form.querySelector("#topic");
    var params = new URLSearchParams(window.location.search);
    var preset = params.get("topic");
    if (preset && topicSelect) {
      for (var i = 0; i < topicSelect.options.length; i++) {
        if (topicSelect.options[i].value === preset) topicSelect.selectedIndex = i;
      }
    }
    var status = document.getElementById("form-status");

    function fieldOf(input) {
      return input.closest(".field") || input.closest(".consent");
    }
    function validate(input) {
      var ok = input.checkValidity();
      var f = fieldOf(input);
      if (f) f.classList.toggle("has-error", !ok);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    }
    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (input) {
      input.addEventListener("blur", function () {
        if (input.value) validate(input);
      });
      input.addEventListener("input", function () {
        var f = fieldOf(input);
        if (f && f.classList.contains("has-error")) validate(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var inputs = form.querySelectorAll("input, select, textarea");
      var firstBad = null;
      Array.prototype.forEach.call(inputs, function (input) {
        if (!validate(input) && !firstBad) firstBad = input;
      });
      if (firstBad) {
        firstBad.focus();
        return;
      }
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var topicText = topicSelect.options[topicSelect.selectedIndex].text;
      var ref = form.reference.value.trim();
      var msg = form.message.value.trim();

      var subject = "[ZYNERO] " + topicText + " — " + name;
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Topic: " + topicText + "\n" +
        (ref ? "Order ID / reference: " + ref + "\n" : "") +
        "\n" + msg + "\n";
      var href =
        "mailto:" + SUPPORT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (status) {
        status.textContent = "";
        status.appendChild(
          document.createTextNode("Your email app should now open with your message ready to send. If it didn’t, write to us at ")
        );
        var link = el("a", "", SUPPORT_EMAIL);
        link.href = "mailto:" + SUPPORT_EMAIL;
        status.appendChild(link);
        status.appendChild(document.createTextNode("."));
        status.classList.add("is-visible");
      }
      window.location.href = href;
    });
  }
})();
