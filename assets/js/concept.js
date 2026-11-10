/* Solana GV90-style concept.
   SOLANA_WEBHOOK_URL is intentionally empty: submit shows the success state
   and does not post anywhere. */
var SOLANA_WEBHOOK_URL = "";
var SOLANA_TAG = "Solana_Website";
var SOLANA_SOURCE = "solana-gv90-concept";

(function () {
  "use strict";

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

  var opener = null;
  var state = { realtor: "", working: "" };
  var sending = false;
  var submitted = false;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function q(k) {
    try { return new URLSearchParams(location.search).get(k) || ""; } catch (e) { return ""; }
  }

  var chapter = $("#chapter");
  if (chapter && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) chapter.textContent = en.target.getAttribute("data-chapter");
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    $all("[data-chapter]").forEach(function (el) { io.observe(el); });
  }

  var form = $("#lead-form");
  var drawer = $("#drawer");
  var sheet = $("#sheet");

  function seg(name) { return form.querySelector('[data-seg="' + name + '"]'); }
  function msg(input, text) {
    var err = input.parentNode.querySelector(".err");
    if (err) err.textContent = text || "";
    input.setAttribute("aria-invalid", text ? "true" : "false");
  }
  function pick(name, value) {
    state[name] = value;
    var group = seg(name);
    $all("button", group).forEach(function (b) {
      b.setAttribute("aria-checked", b.value === value ? "true" : "false");
    });
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

  function setPlan(plan) {
    form.elements.preferred_plan.value = plan || "";
    var pill = $("#plan-pill");
    pill.hidden = !plan;
    pill.querySelector("span").textContent = plan || "";
    $("#drawer-title").textContent = plan ? "Register · " + plan : "Register";
  }

  function openDrawer(plan, trigger) {
    if (submitted) {
      form.hidden = true;
      $("#done").hidden = false;
    }
    opener = trigger || document.activeElement;
    setPlan(plan || "");
    drawer.hidden = false;
    document.body.classList.add("drawer-open");
    sheet.focus();
  }
  function closeDrawer() {
    drawer.hidden = true;
    document.body.classList.remove("drawer-open");
    if (opener && opener.focus) opener.focus();
  }

  $all("[data-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openDrawer(btn.getAttribute("data-plan") || "", btn);
    });
  });
  $all("[data-close]").forEach(function (btn) {
    btn.addEventListener("click", closeDrawer);
  });
  document.addEventListener("keydown", function (e) {
    if (drawer.hidden) return;
    if (e.key === "Escape") { closeDrawer(); return; }
    if (e.key !== "Tab") return;
    var items = $all("a[href],button:not([disabled]),input:not([type='hidden'])", sheet).filter(function (el) {
      return !el.closest("[hidden]");
    });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

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
    var submit = form.querySelector("[data-submit]");
    submit.disabled = true;
    submit.textContent = "Sending…";
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
      formLocation: "drawer",
      form_location: "drawer",
      inquiry: "Pricing & floorplans",
      plans: plan,
      tags: SOLANA_TAG,
      source: SOLANA_SOURCE,
      entryPoint: "register",
      pageSection: "concept",
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
    setTimeout(function () {
      submitted = true;
      sending = false;
      form.hidden = true;
      $("#intro").hidden = true;
      var done = $("#done");
      done.hidden = false;
      done.focus();
    }, 450);
  });

  var down = $("#down");
  if (down) {
    down.addEventListener("click", function () {
      var next = $("#overview");
      if (next) next.scrollIntoView({ block: "start" });
    });
  }
})();
