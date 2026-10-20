/* Solana preview lead handler.
   SOLANA_WEBHOOK_URL is intentionally empty: submit shows the success state
   and does not post anywhere. Do not point this at another community's hook. */
var SOLANA_WEBHOOK_URL = "";
var SOLANA_TAG = "Solana_Website";
var SOLANA_SOURCE = "solana-preview";

(function () {
  "use strict";
  var PAGES = ["home", "location", "floorplans", "amenities", "homes", "developer", "faq", "register"];
  var TITLES = {
    home: "Solana by Zenterra | Condos in Willoughby, Langley BC",
    location: "Solana by Zenterra | Location",
    floorplans: "Solana by Zenterra | Floorplans",
    amenities: "Solana by Zenterra | Amenities",
    homes: "Solana by Zenterra | The Homes",
    developer: "Solana by Zenterra | The Developer",
    faq: "Solana by Zenterra | FAQ",
    register: "Solana by Zenterra | Get Pricing"
  };
  var page = "home";
  var lastPlan = "";
  var submitted = false;
  var sending = false;
  var compare = [];
  var nudgeTimer = null;
  var nudgeReason = "dwell";
  var started = Date.now();

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function q(k) {
    try { return new URLSearchParams(location.search).get(k) || ""; } catch (e) { return ""; }
  }

  function readPage() {
    var h = decodeURIComponent((location.hash || "").replace(/^#\/?/, "")).split("?")[0].trim();
    return PAGES.indexOf(h) >= 0 ? h : "home";
  }

  function showPage(next, push) {
    page = PAGES.indexOf(next) >= 0 ? next : "home";
    $all(".page").forEach(function (el) { el.classList.toggle("is-on", el.id === "page-" + page); });
    $all("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = TITLES[page] || TITLES.home;
    if (push) {
      var hash = "#" + page;
      if (location.hash !== hash) history.pushState(null, "", hash);
    }
    closeMenu();
    closeDetail();
    window.scrollTo(0, 0);
    scheduleNudge();
    renderCompare();
    syncBar();
  }

  function closeMenu() {
    var menu = $("#menu");
    var burger = $("#burger");
    if (menu) menu.classList.remove("is-on");
    if (burger) burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  var RULES = {
    firstName: function (v) { return v ? "" : "Please enter your first name."; },
    lastName: function (v) { return v ? "" : "Please enter your last name."; },
    email: function (v) {
      if (!v) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "That email doesn't look quite right. Please check it.";
    },
    phone: function (v) {
      var d = v.replace(/\D/g, "");
      if (!d) return "Please enter your phone number.";
      return (d.length === 10 || (d.length === 11 && d[0] === "1")) ? "" : "Please enter a 10-digit phone number so our team can reach you.";
    }
  };

  function msg(input, text) {
    var err = input.parentNode.querySelector(".err");
    if (err) err.textContent = text || "";
    input.setAttribute("aria-invalid", text ? "true" : "false");
  }

  function bindForm(form) {
    var state = { realtor: "", working: "" };
    function seg(name) { return form.querySelector('[data-seg="' + name + '"]'); }
    function pick(name, value) {
      state[name] = value;
      var group = seg(name);
      $all("button", group).forEach(function (b) { b.setAttribute("aria-checked", b.value === value ? "true" : "false"); });
      var err = group.parentNode.querySelector(".err");
      if (err) err.textContent = "";
      if (name === "realtor") {
        var wrap = form.querySelector('[data-wrap="working"]');
        var show = value === "No";
        wrap.hidden = !show;
        if (!show) {
          state.working = "";
          $all("button", seg("working")).forEach(function (b) { b.setAttribute("aria-checked", "false"); });
        }
      }
    }
    $all("[data-seg] button", form).forEach(function (b) {
      b.addEventListener("click", function () { pick(b.parentNode.getAttribute("data-seg"), b.value); });
    });
    Object.keys(RULES).forEach(function (k) {
      var el = form.elements[k];
      el.addEventListener("blur", function () {
        if (el.value.trim() || el.getAttribute("aria-invalid") === "true") msg(el, RULES[k](el.value.trim()));
      });
    });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (sending || submitted) return;
      var first = null;
      Object.keys(RULES).forEach(function (k) {
        var el = form.elements[k];
        var t = RULES[k](el.value.trim());
        msg(el, t);
        if (t && !first) first = el;
      });
      [["realtor", "Please choose Yes or No."], ["working", "Please choose Yes or No."]].forEach(function (pair) {
        if (pair[0] === "working" && state.realtor !== "No") return;
        var group = seg(pair[0]);
        var err = group.parentNode.querySelector(".err");
        var bad = !state[pair[0]];
        err.textContent = bad ? pair[1] : "";
        $all("button", group).forEach(function (b) { b.setAttribute("aria-invalid", bad ? "true" : "false"); });
        if (bad && !first) first = group.querySelector("button");
      });
      if (first) { first.focus(); return; }
      sending = true;
      $all("[data-submit]").forEach(function (btn) { btn.disabled = true; btn.textContent = "Sending…"; });
      var isYes = state.realtor === "Yes";
      var plan = (form.elements.preferred_plan.value || "").trim();
      var payload = {
        firstName: form.elements.firstName.value.trim(),
        lastName: form.elements.lastName.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        beds: "",
        realtor: isYes ? "yes" : "no",
        is_realtor: state.realtor,
        working_with_realtor: isYes ? "" : state.working,
        offer: "pricing_floorplans",
        plan: plan,
        preferred_plan: plan,
        appointment: "no",
        formLocation: form.getAttribute("data-location") || "drawer",
        form_location: form.getAttribute("data-location") || "drawer",
        inquiry: "Pricing & floorplans",
        plans: compare.map(function (id) {
          var card = document.querySelector('.plan-card[data-id="' + id + '"]');
          return card ? card.getAttribute("data-plan") : id;
        }).join(", "),
        tags: SOLANA_TAG,
        source: SOLANA_SOURCE,
        entryPoint: form.getAttribute("data-location") || "drawer",
        pageSection: page,
        utm_source: q("utm_source"), utm_medium: q("utm_medium"), utm_campaign: q("utm_campaign"),
        utm_term: q("utm_term"), utm_content: q("utm_content"),
        gclid: q("gclid"), fbclid: q("fbclid"),
        landingPage: location.pathname + location.search,
        referrer: document.referrer || "",
        submittedAt: new Date().toISOString()
      };
      if (SOLANA_WEBHOOK_URL) {
        try {
          fetch(SOLANA_WEBHOOK_URL, {
            method: "POST", mode: "no-cors", keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }).catch(function () {});
        } catch (e) {}
      }
      markNudge();
      setTimeout(function () {
        submitted = true;
        sending = false;
        $all(".form-intro").forEach(function (el) { el.hidden = true; });
        $all(".lead-form").forEach(function (f) { f.hidden = true; });
        $all(".lead-done").forEach(function (d) { d.hidden = false; });
        var done = form.parentNode.querySelector(".lead-done");
        if (done) done.focus();
        closeNudge();
        syncBar();
      }, 450);
    });
  }

  function mountForms() {
    var tpl = $("#lead-tpl");
    $all("[data-form-slot]").forEach(function (slot) {
      var node = tpl.content.cloneNode(true);
      var form = node.querySelector("form");
      form.setAttribute("data-location", slot.getAttribute("data-location") || "drawer");
      slot.appendChild(node);
      bindForm(slot.querySelector("form"));
    });
  }

  function setPlan(slot, plan) {
    if (!slot) return;
    var form = slot.querySelector("form");
    var pill = slot.querySelector("[data-plan-pill]");
    if (form) form.elements.preferred_plan.value = plan || "";
    if (pill) {
      pill.hidden = !plan;
      var span = pill.querySelector("span");
      if (span) span.textContent = plan || "";
    }
    var title = slot.querySelector("[data-form-title]");
    if (title) title.textContent = plan ? "Get pricing for " + plan : "Get Pricing";
  }

  function openDrawer(opts) {
    opts = opts || {};
    markNudge();
    closeNudge();
    closeMenu();
    var drawer = $("#drawer");
    var slot = $("#drawer-slot");
    var plan = opts.plan || "";
    if (plan) lastPlan = plan;
    var form = slot.querySelector("form");
    if (form) form.setAttribute("data-location", opts.location || "drawer");
    setPlan(slot, plan);
    if (opts.email && form) form.elements.email.value = opts.email;
    drawer.classList.add("is-on");
    drawer.hidden = false;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    var sheet = $(".drawer-sheet");
    if (sheet) sheet.focus();
    syncBar();
  }

  function closeDrawer() {
    var drawer = $("#drawer");
    drawer.classList.remove("is-on");
    drawer.hidden = true;
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    syncBar();
  }

  function trapTab(e) {
    if (e.key !== "Tab") return;
    var box = $(".drawer-sheet");
    if (!box) return;
    var els = $all("a[href],button:not([disabled]),input:not([type='hidden'])", box).filter(function (el) {
      return !el.closest("[hidden]");
    });
    if (!els.length) return;
    var first = els[0], last = els[els.length - 1], ae = document.activeElement;
    if (e.shiftKey && (ae === first || !box.contains(ae))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (ae === last || !box.contains(ae))) { e.preventDefault(); first.focus(); }
  }

  function seenNudge() {
    try { return localStorage.getItem("solana.nudge") === "1"; } catch (e) { return true; }
  }
  function markNudge() {
    try { localStorage.setItem("solana.nudge", "1"); } catch (e) {}
  }
  function closeNudge() {
    var n = $("#nudge");
    if (n) { n.classList.remove("is-on"); n.hidden = true; }
    syncBar();
  }
  function showNudge() {
    if (seenNudge() || submitted || $("#drawer").classList.contains("is-on") || page === "register") return;
    if ($("#menu") && $("#menu").classList.contains("is-on")) return;
    var ae = document.activeElement;
    if (ae && /^(input|textarea|select)$/i.test(ae.tagName || "")) {
      nudgeTimer = setTimeout(showNudge, 8000);
      return;
    }
    markNudge();
    var n = $("#nudge");
    n.hidden = false;
    n.classList.add("is-on");
    if (lastPlan) setPlan($("#nudge-slot"), lastPlan);
    syncBar();
  }
  function scheduleNudge() {
    if (nudgeTimer) { clearTimeout(nudgeTimer); nudgeTimer = null; }
    if (seenNudge() || submitted || page === "register") return;
    nudgeReason = "dwell";
    nudgeTimer = setTimeout(showNudge, 45000);
  }

  function syncBar() {
    var hide = page === "register" || $("#drawer").classList.contains("is-on") || $("#nudge").classList.contains("is-on") || document.body.classList.contains("menu-open");
    document.body.classList.toggle("bar-off", hide);
  }

  function applyFilters() {
    var beds = document.querySelector(".filters [data-beds][aria-pressed='true']");
    var bldg = document.querySelector(".filters [data-building][aria-pressed='true']");
    var bed = beds ? beds.getAttribute("data-beds") : "all";
    var building = bldg ? bldg.getAttribute("data-building") : "all";
    var n = 0;
    $all(".plan-card").forEach(function (card) {
      var ok = (bed === "all" || card.getAttribute("data-beds") === bed) &&
        (building === "all" || card.getAttribute("data-building") === building);
      card.hidden = !ok;
      if (ok) n++;
    });
    var count = $("#plan-count");
    if (count) count.textContent = "Showing " + n + " of 5";
  }

  function renderCompare() {
    var bar = $("#compare-bar");
    var label = $("#compare-label");
    if (label) label.textContent = compare.length ? compare.length + " of 3 selected" : "Compare floorplans";
    var panel = $("#compare-panel");
    if (bar) bar.classList.toggle("is-on", page === "floorplans" && compare.length > 0 && !(panel && panel.classList.contains("is-on")));
    $all("[data-compare]").forEach(function (btn) {
      var on = compare.indexOf(btn.getAttribute("data-compare")) >= 0;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "In compare" : "Compare";
    });
    var grid = $("#compare-grid");
    if (!grid) return;
    grid.innerHTML = "";
    compare.forEach(function (id) {
      var card = document.querySelector('.plan-card[data-id="' + id + '"]');
      if (!card) return;
      var el = document.createElement("article");
      el.className = "cmp-card";
      var img = card.querySelector("img");
      el.innerHTML = "<h3>" + card.getAttribute("data-plan") + "</h3><p>" + card.getAttribute("data-summary") + "</p>";
      if (img) el.insertBefore(img.cloneNode(true), el.firstChild);
      var rm = document.createElement("button");
      rm.type = "button";
      rm.className = "btn btn-line";
      rm.textContent = "Remove";
      rm.addEventListener("click", function () { toggleCompare(id); });
      el.appendChild(rm);
      grid.appendChild(el);
    });
  }

  function toggleCompare(id) {
    var i = compare.indexOf(id);
    if (i >= 0) compare.splice(i, 1);
    else if (compare.length < 3) compare.push(id);
    if (compare.length < 2) {
      $("#compare-panel").classList.remove("is-on");
      $("#compare-panel").hidden = true;
    }
    renderCompare();
  }

  function openDetail(id) {
    $all(".plan-detail").forEach(function (d) {
      var on = d.id === "detail-" + id;
      d.classList.toggle("is-on", on);
      d.hidden = !on;
    });
    $("#plan-browser").hidden = true;
    var det = document.getElementById("detail-" + id);
    if (det) {
      var h = det.querySelector("h2");
      if (h) h.focus();
    }
    lastPlan = (document.querySelector('.plan-card[data-id="' + id + '"]') || {}).getAttribute &&
      document.querySelector('.plan-card[data-id="' + id + '"]').getAttribute("data-plan") || lastPlan;
    setPlan($("#floorplans-slot"), lastPlan);
  }

  function closeDetail() {
    $all(".plan-detail").forEach(function (d) { d.classList.remove("is-on"); d.hidden = true; });
    var browser = $("#plan-browser");
    if (browser) browser.hidden = false;
  }

  function fmtTime(now) {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Vancouver", hour: "numeric", minute: "2-digit", hour12: true
      }).format(now).replace(/\s*([ap])\.?m\.?/i, function (_, p) { return " " + p.toUpperCase() + "M"; });
    } catch (e) { return ""; }
  }

  function boot() {
    mountForms();
    var clock = $("#clock");
    function tick() { if (clock) clock.textContent = fmtTime(new Date()); }
    tick();
    setInterval(tick, 20000);

    document.body.addEventListener("click", function (e) {
      var nav = e.target.closest("[data-nav]");
      if (nav) {
        e.preventDefault();
        document.documentElement.classList.add("is-ready");
        showPage(nav.getAttribute("data-nav"), true);
        return;
      }
      var open = e.target.closest("[data-open-drawer]");
      if (open) {
        e.preventDefault();
        var plan = open.getAttribute("data-plan") || "";
        if (open.hasAttribute("data-plan-compare")) {
          plan = compare.map(function (id) {
            var card = document.querySelector('.plan-card[data-id="' + id + '"]');
            return card ? card.getAttribute("data-plan") : id;
          }).join(", ");
        }
        openDrawer({
          location: open.getAttribute("data-location") || "cta",
          plan: plan
        });
        return;
      }
      var det = e.target.closest("[data-open-detail]");
      if (det) {
        e.preventDefault();
        openDetail(det.getAttribute("data-open-detail"));
        return;
      }
      var cmp = e.target.closest("[data-compare]");
      if (cmp) {
        e.preventDefault();
        toggleCompare(cmp.getAttribute("data-compare"));
        return;
      }
      if (e.target.closest("[data-close-drawer]")) { e.preventDefault(); closeDrawer(); }
      if (e.target.closest("[data-close-nudge]")) { e.preventDefault(); markNudge(); closeNudge(); }
      if (e.target.closest("[data-close-detail]")) { e.preventDefault(); closeDetail(); }
      if (e.target.closest("[data-open-compare]")) {
        e.preventDefault();
        if (compare.length < 2) return;
        $("#compare-panel").hidden = false;
        $("#compare-panel").classList.add("is-on");
        $("#compare-bar").classList.remove("is-on");
        $("#compare-panel").scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (e.target.closest("[data-close-compare]")) {
        e.preventDefault();
        $("#compare-panel").classList.remove("is-on");
        $("#compare-panel").hidden = true;
        renderCompare();
      }
      if (e.target.closest("[data-clear-compare]")) {
        e.preventDefault();
        compare = [];
        $("#compare-panel").classList.remove("is-on");
        $("#compare-panel").hidden = true;
        renderCompare();
      }
      var beds = e.target.closest(".filters [data-beds]");
      if (beds) {
        $all(".filters [data-beds]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        beds.setAttribute("aria-pressed", "true");
        applyFilters();
      }
      var bldg = e.target.closest(".filters [data-building]");
      if (bldg) {
        $all(".filters [data-building]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        bldg.setAttribute("aria-pressed", "true");
        applyFilters();
      }
    });

    $("#burger").addEventListener("click", function () {
      var menu = $("#menu");
      var on = !menu.classList.contains("is-on");
      menu.classList.toggle("is-on", on);
      $("#burger").setAttribute("aria-expanded", on ? "true" : "false");
      document.body.classList.toggle("menu-open", on);
      syncBar();
    });
    $("#ann-x").addEventListener("click", function () {
      document.body.classList.add("ann-off");
    });
    $("#quick-email").addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (this.elements.email.value || "").trim();
      openDrawer({ location: "hero_band", email: email });
    });

    document.addEventListener("keydown", function (e) {
      if ($("#drawer").classList.contains("is-on")) trapTab(e);
      if (e.key === "Escape") {
        if ($("#drawer").classList.contains("is-on")) closeDrawer();
        else if ($("#nudge").classList.contains("is-on")) { markNudge(); closeNudge(); }
        else closeMenu();
      }
    });
    window.addEventListener("hashchange", function () {
      document.documentElement.classList.add("is-ready");
      showPage(readPage(), false);
    });
    window.addEventListener("scroll", function () {
      if (!nudgeTimer) return;
      var d = document.documentElement;
      var max = d.scrollHeight - window.innerHeight;
      if (max > 200 && window.scrollY / max >= 0.5) {
        clearTimeout(nudgeTimer);
        nudgeTimer = null;
        nudgeReason = "scroll_50";
        showNudge();
      }
    }, { passive: true });
    document.addEventListener("mouseout", function (e) {
      if (e.relatedTarget || e.clientY > 0 || window.innerWidth < 1080) return;
      if (Date.now() - started < 15000) return;
      if (!nudgeTimer && seenNudge()) return;
      if (nudgeTimer) { clearTimeout(nudgeTimer); nudgeTimer = null; }
      showNudge();
    });

    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (ents) {
        var on = ents.some(function (en) { return en.isIntersecting; });
        document.body.classList.toggle("form-in-view", on);
      });
      $all("[data-form-slot]").forEach(function (el) { obs.observe(el); });
    }

    var start = readPage();
    if (!location.hash) history.replaceState(null, "", "#home");
    showPage(start, false);
    applyFilters();
    renderCompare();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
