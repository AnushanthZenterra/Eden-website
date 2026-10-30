/* Eden short lead form for static pages (blog). Same Zapier hook and field names as the site drawer. */
(function () {
  var HOOK = "https://hooks.zapier.com/hooks/catch/11699296/4tw2rgd/";
  function q(k) { try { return new URLSearchParams(location.search).get(k) || ""; } catch (e) { return ""; } }
  function msg(el, t) { var m = el.parentNode.querySelector(".el-err"); if (m) { m.textContent = t || ""; m.hidden = !t; } el.setAttribute("aria-invalid", t ? "true" : "false"); }
  var RULES = {
    firstName: function (v) { return v ? "" : "Please enter your first name."; },
    lastName: function (v) { return v ? "" : "Please enter your last name."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Please enter a valid email address."; },
    phone: function (v) { return v.replace(/\D/g, "").length >= 10 ? "" : "Please enter a 10-digit phone number."; }
  };
  function init(form) {
    var loc = form.getAttribute("data-location") || "blog_inline";
    var seg = function (name) { return form.querySelector('[data-seg="' + name + '"]'); };
    var val = { realtor: "", working: "" };
    function pick(name, v) {
      val[name] = v;
      var g = seg(name); [].forEach.call(g.querySelectorAll("button"), function (b) { b.setAttribute("aria-checked", b.value === v ? "true" : "false"); });
      var e = g.parentNode.querySelector(".el-err"); if (e) { e.hidden = true; e.textContent = ""; }
      if (name === "realtor") { var w = form.querySelector('[data-wrap="working"]'); w.hidden = v !== "No"; if (v !== "No") val.working = ""; }
    }
    [].forEach.call(form.querySelectorAll("[data-seg] button"), function (b) {
      b.addEventListener("click", function () { pick(b.parentNode.getAttribute("data-seg"), b.value); });
    });
    var consentEl = form.elements.sms_consent;
    if (consentEl) consentEl.addEventListener("change", function () { if (consentEl.checked) msg(consentEl, ""); });
    Object.keys(RULES).forEach(function (k) {
      var el = form.elements[k];
      el.addEventListener("blur", function () { if (el.value.trim() || el.getAttribute("aria-invalid") === "true") msg(el, RULES[k](el.value.trim())); });
    });
    var sending = false;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (sending) return;
      var first = null;
      Object.keys(RULES).forEach(function (k) { var el = form.elements[k], t = RULES[k](el.value.trim()); msg(el, t); if (t && !first) first = el; });
      [["realtor", "Please choose Yes or No."], ["working", "Please choose Yes or No."]].forEach(function (r) {
        var g = seg(r[0]); if (r[0] === "working" && val.realtor !== "No") return;
        var e = g.parentNode.querySelector(".el-err"); var bad = !val[r[0]];
        e.hidden = !bad; e.textContent = bad ? r[1] : ""; if (bad && !first) first = g.querySelector("button");
      });
      var consent = form.elements.sms_consent;
      var cErr = consent && consent.checked ? "" : "Please tick the consent box to continue.";
      if (consent) { msg(consent, cErr); if (cErr && !first) first = consent; }
      if (first) { first.focus(); return; }
      sending = true;
      var btn = form.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = "Sending…";
      var isR = val.realtor === "Yes" ? "yes" : "no";
      var p = {
        firstName: form.elements.firstName.value.trim(), lastName: form.elements.lastName.value.trim(),
        email: form.elements.email.value.trim(), phone: form.elements.phone.value.trim(),
        beds: "", realtor: isR, is_realtor: val.realtor, working_with_realtor: isR === "no" ? val.working : "",
        offer: "pricing_floorplans", plan: form.elements.preferred_plan.value, preferred_plan: form.elements.preferred_plan.value, appointment: "no",
        formLocation: loc, form_location: loc, inquiry: "Pricing & floorplans", plans: "",
        tags: "Eden_Website", source: "edenbyzenterra.ca", entryPoint: loc, pageSection: "blog",
        utm_source: q("utm_source"), utm_medium: q("utm_medium"), utm_campaign: q("utm_campaign"), utm_term: q("utm_term"), utm_content: q("utm_content"),
        gclid: q("gclid"), fbclid: q("fbclid"), landingPage: location.pathname + location.search, referrer: document.referrer || "",
        submittedAt: new Date().toISOString()
      };
      p.sms_consent = "yes";
      ["description", "notes", "message"].forEach(function (k) {
        if (Object.prototype.hasOwnProperty.call(p, k)) {
          var cur = p[k] == null ? "" : String(p[k]);
          p[k] = cur ? (cur.replace(/\s*$/, "") + "\nSMS Consent: Yes") : "SMS Consent: Yes";
        }
      });
      try { fetch(HOOK, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }).catch(function () {}); } catch (e) {}
      try { (window.dataLayer = window.dataLayer || []).push({ event: "generate_lead", form_source: loc, form_location: loc, offer: "pricing", is_realtor: val.realtor }); } catch (e) {}
      setTimeout(function () {
        var box = form.parentNode.querySelector(".el-done");
        form.hidden = true; box.hidden = false; box.focus();
      }, 450);
    });
  }
  function boot() { [].forEach.call(document.querySelectorAll("form[data-eden-lead]"), init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
