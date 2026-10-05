/* Eden blog builder - pure function, no dependencies.
   build({ posts: [{ file, text }], today }) -> { "blog/index.html": "...", ... }
   Used by scripts/build-blog.mjs (Node) and by the design tool's export. */
(function (root) {
  var SITE = "https://www.edenbyzenterra.ca";
  var GTM = "GTM-M4MNHS77";
  var LOGO = "https://res.cloudinary.com/jvsvq2qw/image/upload/f_auto,q_auto,w_600/v1787251813/eden-logo-ivory_pziaut.png";
  var ZLOGO = "https://res.cloudinary.com/jvsvq2qw/image/upload/f_auto,q_auto,w_600/v1787251810/zenterra-logo_qqwugd.png";
  var OG_DEFAULT = "https://res.cloudinary.com/jvsvq2qw/image/upload/f_auto,q_auto,w_1600/v1788189622/home-hero-morning_aqjgp4.jpg";
  var PHONE = "778.762.1902", TEL = "+17787621902", EMAIL = "eden@zenterra.ca";
  var HOURS = "Open 12 \u2013 5 PM daily, closed Fridays";
  var SALES_ADDR = "190 Willoughby Town Centre Drive, Langley, BC";
  var BOOK = "/?get=pricing&from=blog_";

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function strip(h) { return String(h).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
  function fmt(d) {
    var m = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var p = String(d).split("-"); return m[+p[1] - 1] + " " + (+p[2]) + ", " + p[0];
  }
  function ld(o) { return '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, "\\u003c") + "</script>"; }

  function parse(file, text) {
    var m = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/.exec(text);
    if (!m) throw new Error(file + ": missing --- front matter ---");
    var meta = JSON.parse(m[1]);
    meta.slug = meta.slug || file.replace(/^.*\//, "").replace(/\.html?$/, "");
    meta.body = m[2].trim();
    meta.words = strip(meta.body).split(" ").length;
    meta.minutes = Math.max(1, Math.round(meta.words / 220));
    meta.url = SITE + "/blog/" + meta.slug;
    meta.path = "/blog/" + meta.slug;
    meta.updated = meta.updated || meta.date;
    meta.image = meta.image || OG_DEFAULT;
    meta.faq = meta.faq || [];
    meta.keyFacts = meta.keyFacts || [];
    return meta;
  }

  var CSS = [
    ":root{--moss:#344431;--moss-2:#28331f;--sage:#949575;--terra:#d07a4c;--clay:#b0765e;--wheat:#e8b866;--sand:#e4d4b4;--ivory:#f4ede1;--ivory-2:#efe6d6;--ink:#2b2721;--muted:#5c5647;--serif:'Newsreader',Georgia,'Times New Roman',serif;--sans:'Hanken Grotesk',system-ui,-apple-system,sans-serif}",
    "*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;font-family:var(--sans);color:var(--ink);background:var(--ivory);-webkit-font-smoothing:antialiased;line-height:1.6}",
    "a{color:var(--terra);text-decoration:none}a:hover{color:var(--clay)}img{max-width:100%;height:auto;display:block}",
    ".skip{position:absolute;left:-9999px}.skip:focus{left:16px;top:16px;z-index:99;background:#fff;padding:10px 14px}",
    ".hd{position:sticky;top:0;z-index:40;background:var(--moss);color:var(--ivory)}",
    ".ann{background:var(--moss-2);color:var(--sand);font-size:12.5px;text-align:center;padding:8px 16px;cursor:default}.ann strong{color:var(--wheat);font-weight:600}",
    ".bar{max-width:1240px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;gap:20px}",
    ".logo img{height:34px;width:auto}.nav{display:flex;gap:2px;margin-left:auto;flex-wrap:nowrap}",
    ".nav a{white-space:nowrap;color:var(--ivory);font-size:14px;font-weight:500;padding:8px 12px;border-radius:999px;border:1px solid transparent;transition:background .25s,border-color .25s}",
    ".nav a:hover{color:#fff;background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.3)}.nav a[aria-current]{color:var(--wheat);background:rgba(255,255,255,.09)}",
    ".btn{white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--terra);color:#fff;padding:13px 24px;border-radius:2px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;transition:background .2s}.btn:hover{background:var(--clay);color:#fff}",
    ".btn-ghost{background:transparent;border:1px solid rgba(52,68,49,.35);color:var(--moss)}.btn-ghost:hover{background:var(--moss);color:var(--ivory)}",
    ".hd .btn{padding:11px 20px}",
    "@media(max-width:1180px){.nav{display:none}.hd .btn{margin-left:auto;padding:10px 14px;font-size:12px}}",
    ".wrap{max-width:1240px;margin:0 auto;padding:0 24px}",
    ".crumbs{font-size:13px;color:#7c7563;padding:22px 0 0;display:flex;flex-wrap:wrap;gap:6px}.crumbs a{color:#7c7563}.crumbs a:hover{color:var(--moss)}",
    ".pill{white-space:nowrap;display:inline-block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;color:var(--moss);border:1px solid rgba(52,68,49,.3);border-radius:999px;padding:6px 12px}",
    "h1,h2,h3{font-family:var(--serif);font-weight:300;color:var(--moss);letter-spacing:-.01em;text-wrap:balance}",
    ".lede{font-size:clamp(17px,1.6vw,19px);color:var(--muted);font-weight:300;max-width:720px;text-wrap:pretty}",
    ".meta{font-size:13.5px;color:#7c7563;display:flex;flex-wrap:wrap;gap:6px 14px}",
    // index
    ".bhero{padding:clamp(36px,6vw,72px) 0 clamp(28px,4vw,44px)}.bhero h1{font-size:clamp(34px,5vw,60px);line-height:1.08;margin:16px 0 18px}",
    ".feat{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:clamp(22px,4vw,48px);align-items:center;background:#fff;border:1px solid rgba(52,68,49,.12);border-radius:3px;overflow:hidden;color:inherit;transition:box-shadow .3s,transform .3s}",
    ".feat:hover,.card:hover{box-shadow:0 14px 32px rgba(28,38,26,.14);transform:translateY(-3px);color:inherit}",
    ".feat .ph{aspect-ratio:3/2;background:var(--moss)}.feat .ph img,.card .ph img{width:100%;height:100%;object-fit:cover}.feat .tx{padding:clamp(22px,3vw,40px) clamp(22px,3vw,40px) clamp(22px,3vw,40px) 0}",
    ".feat h2{font-size:clamp(26px,3vw,38px);line-height:1.15;margin:14px 0 12px}.feat p{color:var(--muted);font-weight:300;margin:0 0 18px}",
    "@media(max-width:820px){.feat{grid-template-columns:1fr}.feat .tx{padding:0 22px 26px}}",
    ".grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr));gap:clamp(18px,2.4vw,28px);margin:clamp(28px,4vw,44px) 0 0}",
    ".card{background:#fff;border:1px solid rgba(52,68,49,.1);border-radius:3px;overflow:hidden;color:inherit;display:flex;flex-direction:column;transition:box-shadow .3s,transform .3s}.card .ph{aspect-ratio:3/2;background:var(--moss)}",
    ".card .tx{padding:20px 22px 24px;display:flex;flex-direction:column;gap:10px;flex:1}.card h3{font-size:22px;line-height:1.2;margin:0;font-weight:400}.card p{margin:0;color:var(--muted);font-size:15px;font-weight:300}",
    ".more{margin-top:auto;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--terra);font-weight:600}",
    // article
    ".ahead{padding:clamp(20px,3vw,32px) 0 clamp(22px,3vw,32px);max-width:860px}.ahead h1{font-size:clamp(34px,5vw,58px);line-height:1.08;margin:16px 0 16px}",
    ".acover{aspect-ratio:16/9;background:var(--moss);border-radius:3px;overflow:hidden}.acover img{width:100%;height:100%;object-fit:cover}",
    ".alay{display:grid;grid-template-columns:minmax(0,720px) minmax(0,320px);gap:clamp(28px,5vw,72px);justify-content:space-between;padding:clamp(28px,4vw,48px) 0 clamp(40px,6vw,80px)}",
    "@media(max-width:980px){.alay{grid-template-columns:minmax(0,1fr)}.aside{display:none}}",
    ".facts{background:#fff;border:1px solid rgba(52,68,49,.14);border-radius:3px;padding:22px 26px;margin:0 0 34px}.facts h2{font-size:13px;letter-spacing:.18em;text-transform:uppercase;font-family:var(--sans);font-weight:600;color:var(--moss);margin:0 0 12px}",
    ".facts ul{margin:0;padding:0;list-style:none;display:grid;gap:9px}.facts li{position:relative;padding-left:20px;font-size:15.5px}.facts li:before{content:'';position:absolute;left:2px;top:.62em;width:7px;height:7px;border-radius:50%;background:var(--terra)}",
    ".prose{font-size:17.5px;line-height:1.75;color:#3a352c;font-weight:300}.prose h2{font-size:clamp(26px,2.6vw,32px);line-height:1.2;margin:1.7em 0 .5em}.prose h3{font-size:22px;font-weight:400;margin:1.5em 0 .4em}",
    ".prose p{margin:0 0 1.1em}.prose strong{font-weight:600;color:var(--ink)}.prose img{border-radius:3px;margin:1.6em 0}.prose ul{padding-left:0;list-style:none;margin:0 0 1.2em}.prose li{position:relative;padding-left:22px;margin:0 0 .45em}",
    ".prose li:before{content:'';position:absolute;left:3px;top:.68em;width:7px;height:7px;border-radius:50%;border:1.5px solid var(--terra)}.prose a{text-decoration:underline;text-underline-offset:3px}",
    ".aside .stick{position:sticky;top:110px;background:var(--moss);color:var(--ivory);border-radius:3px;padding:28px}.aside h2{color:var(--ivory);font-size:26px;line-height:1.2;margin:0 0 10px}.aside p{color:rgba(244,237,225,.82);font-size:15px;margin:0 0 18px;font-weight:300}",
    ".aside .btn{width:100%}.aside .nap{font-size:14px;margin-top:20px;padding-top:18px;border-top:1px solid rgba(244,237,225,.2);color:rgba(244,237,225,.85)}.aside .nap a{color:var(--wheat)}",
    ".cta{background:var(--moss);color:var(--ivory);border-radius:3px;padding:clamp(26px,4vw,40px);margin:40px 0 0;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px}",
    ".cta h2{color:var(--ivory);font-size:clamp(24px,2.6vw,32px);margin:0 0 6px}.cta p{margin:0;color:rgba(244,237,225,.82);font-weight:300}",
    ".faq{margin:48px 0 0}.faq>h2{font-size:clamp(26px,2.6vw,34px);margin:0 0 18px}.faq details{background:#fff;border:1px solid rgba(52,68,49,.12);border-radius:3px;margin:0 0 10px;transition:border-color .25s,box-shadow .25s}",
    ".faq details:hover{border-color:rgba(52,68,49,.3);box-shadow:0 8px 22px -14px rgba(28,38,26,.35)}.faq summary{cursor:pointer;list-style:none;padding:18px 52px 18px 22px;font-family:var(--serif);font-size:19px;color:var(--moss);position:relative}",
    ".faq summary::-webkit-details-marker{display:none}.faq summary:after{content:'+';position:absolute;right:22px;top:50%;transform:translateY(-50%);font-family:var(--sans);font-size:22px;color:var(--terra)}.faq details[open] summary:after{content:'\\2013'}",
    ".faq .ans{padding:0 22px 20px;color:var(--muted);font-weight:300;font-size:16px}",
    ".rel{background:var(--ivory-2);padding:clamp(44px,6vw,80px) 0}.rel h2{font-size:clamp(26px,3vw,36px);margin:0}",
    ".ft{background:var(--moss-2);color:rgba(233,226,212,.78);padding:48px 0 calc(48px + env(safe-area-inset-bottom));font-size:14px}.ft .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:28px}",
    ".ft h2{font-family:var(--sans);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--wheat);font-weight:600;margin:0 0 14px}.ft a{color:rgba(233,226,212,.85);display:block;padding:3px 0}.ft a:hover{color:#fff}.ft .zl{height:30px;width:auto;margin-top:20px;filter:brightness(0) invert(1);opacity:.85}",
    ".mbar{display:none}@media(max-width:900px){.mbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:50;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:rgba(40,51,31,.96)}.mbar a{flex:1}.mbar .btn{padding:14px 10px}.mbar .call{flex:0 0 auto;background:transparent;border:1px solid rgba(244,237,225,.4);color:var(--ivory)}body{padding-bottom:74px}}",
    ":focus-visible{outline:2px solid var(--terra);outline-offset:2px}"
  ].join("\n");

  function head(o) {
    return '<!DOCTYPE html>\n<html lang="en-CA">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
      "<title>" + esc(o.title) + "</title>\n" +
      '<meta name="description" content="' + esc(o.description) + '">\n' +
      '<link rel="canonical" href="' + esc(o.url) + '">\n' +
      '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">\n' +
      '<link rel="alternate" type="application/rss+xml" title="Eden by Zenterra Blog" href="' + SITE + '/blog/feed.xml">\n' +
      '<meta property="og:site_name" content="Eden by Zenterra">\n<meta property="og:locale" content="en_CA">\n' +
      '<meta property="og:type" content="' + (o.article ? "article" : "website") + '">\n' +
      '<meta property="og:title" content="' + esc(o.ogTitle || o.title) + '">\n' +
      '<meta property="og:description" content="' + esc(o.description) + '">\n' +
      '<meta property="og:url" content="' + esc(o.url) + '">\n' +
      '<meta property="og:image" content="' + esc(o.image || OG_DEFAULT) + '">\n' +
      (o.article ? '<meta property="article:published_time" content="' + o.article.date + '">\n<meta property="article:modified_time" content="' + o.article.updated + '">\n<meta property="article:section" content="' + esc(o.article.category) + '">\n' : "") +
      '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:site" content="@ZenterraDev">\n' +
      '<link rel="preconnect" href="https://res.cloudinary.com">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      (o.preload ? '<link rel="preload" as="image" href="' + esc(o.preload) + '" fetchpriority="high">\n' : "") +
      '<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500&amp;family=Hanken+Grotesk:wght@300;400;500;600&amp;display=swap" rel="stylesheet">\n' +
      "<style>\n" + CSS + "\n</style>\n" + o.ld.map(ld).join("\n") + "\n" +
      "<script>window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'page_view',page_path:" + JSON.stringify(o.path) + ",page_title:" + JSON.stringify(o.title) + ",page_section:'blog'});" +
      "(function(){var d=0;function g(){if(d)return;d=1;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=" + GTM + "';window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});document.head.appendChild(s);}" +
      "addEventListener('load',function(){setTimeout(g,1200)});['pointerdown','keydown','touchstart'].forEach(function(e){addEventListener(e,g,{once:true,passive:true})});" +
      "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-cta]');if(a)window.dataLayer.push({event:'book_click',cta_location:a.getAttribute('data-cta'),page_path:" + JSON.stringify(o.path) + "})});})();</script>\n" +
      "<script>(function(){var p=location.pathname,i=p.indexOf('/export/site/');if(i<0)return;var base=p.slice(0,i+13);document.addEventListener('DOMContentLoaded',function(){[].forEach.call(document.querySelectorAll('a[href^=\"/\"]'),function(a){var h=a.getAttribute('href'),hash='',k=h.indexOf('#');if(k>=0){hash=h.slice(k);h=h.slice(0,k);}h=h.replace(/^\\/+|\\/+$/g,'');a.setAttribute('href',base+(h?h+'/':'')+'index.html'+hash);});});})();</script>\n" +
      "</head>\n<body>\n";
  }

  function header() {
    var n = [["/", "Home"], ["/#location", "Location"], ["/#floorplans", "Floorplans"], ["/#amenities", "Amenities"], ["/#homes", "The Homes"], ["/#developer", "The Developer"], ["/#faq", "FAQ"], ["/blog", "Blog"]];
    return '<a class="skip" href="#main">Skip to content</a>\n<header class="hd">\n<div class="ann"><strong>Now selling</strong> \u00b7 Showhome ' + HOURS.charAt(0).toLowerCase() + HOURS.slice(1) + "</div>\n" +
      '<div class="bar"><a class="logo" href="/" aria-label="Eden by Zenterra home"><img src="' + LOGO + '" alt="Eden by Zenterra" width="120" height="34"></a>\n<nav class="nav" aria-label="Main">' +
      n.map(function (x) { return '<a href="' + x[0] + '"' + (x[1] === "Blog" ? ' aria-current="page"' : "") + ">" + x[1] + "</a>"; }).join("") +
      '</nav><a class="btn" href="' + BOOK + 'header" data-cta="header">Get pricing &amp; floorplans</a></div>\n</header>\n';
  }

  function footer() {
    return '<footer class="ft"><div class="wrap cols">' +
      '<div><h2>Eden presentation centre</h2><address style="font-style:normal">' + SALES_ADDR + "<br>" + HOURS + '<br><a href="tel:' + TEL + '">' + PHONE + '</a><a href="mailto:' + EMAIL + '">' + EMAIL + "</a></address></div>" +
      '<div><h2>Explore</h2><a href="/#floorplans">Floorplans</a><a href="/#amenities">Amenities</a><a href="/#location">Location</a><a href="/#faq">FAQ</a><a href="/blog">Blog</a></div>' +
      '<div><h2>Eden by Zenterra</h2><p style="margin:0;font-weight:300">Presale 1, 2 &amp; 3 bedroom condominiums at 19936 77 Avenue in Willoughby, Langley, BC. Built by Zenterra Developments.</p><img class="zl" src="' + ZLOGO + '" alt="Zenterra Developments" width="140" height="30" loading="lazy"></div>' +
      '</div><p class="wrap" style="margin-top:32px;font-size:12px;opacity:.7">\u00a9 ' + new Date().getFullYear() + " Zenterra Developments. This is not an offering for sale. Any such offering may only be made with a disclosure statement. E.&amp;O.E.</p></footer>\n" +
      '<div class="mbar"><a class="btn" href="' + BOOK + 'mobile_bar" data-cta="mobile-bar">Get pricing &amp; floorplans</a><a class="btn call" href="tel:' + TEL + '" data-cta="mobile-call" aria-label="Call the Eden sales team">Call</a></div>\n';
  }

  function card(p, lazy) {
    return '<a class="card" href="' + p.path + '"><div class="ph"><img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.title) + '" width="1200" height="800"' + (lazy ? ' loading="lazy"' : "") + ' decoding="async"></div>' +
      '<div class="tx"><span class="meta"><span>' + esc(p.category) + "</span><time datetime=\"" + p.date + '">' + fmt(p.date) + "</time></span><h3>" + esc(p.title) + "</h3><p>" + esc(p.description) + '</p><span class="more">Read article</span></div></a>';
  }

  var ORG = { "@type": "Organization", "@id": "https://zenterra.ca/#organization", name: "Zenterra Developments", url: "https://zenterra.ca/", logo: { "@type": "ImageObject", url: ZLOGO } };
  var PROJECT = { "@type": "ApartmentComplex", "@id": SITE + "/#eden", name: "Eden by Zenterra", url: SITE + "/" };

  function article(p, all) {
    var related = all.filter(function (x) { return x.slug !== p.slug; }).slice(0, 3);
    var lds = [
      { "@context": "https://schema.org", "@type": "BlogPosting", "@id": p.url + "#article", mainEntityOfPage: p.url, headline: p.title, description: p.description,
        image: [p.image], datePublished: p.date, dateModified: p.updated, wordCount: p.words, articleSection: p.category, inLanguage: "en-CA",
        author: p.author && p.author !== "Zenterra Developments" ? { "@type": "Person", name: p.author } : ORG, publisher: ORG, about: PROJECT,
        isPartOf: { "@type": "Blog", "@id": SITE + "/blog#blog", name: "Eden by Zenterra Blog" } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: SITE + "/blog" },
        { "@type": "ListItem", position: 3, name: p.title, item: p.url }] }
    ];
    if (p.faq.length) lds.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faq.map(function (f) { return { "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: strip(f.a) } }; }) });
    return head({ title: (p.seoTitle || p.title) + " | Eden by Zenterra", ogTitle: p.title, description: p.description, url: p.url, path: p.path, image: p.image, preload: p.image,
        article: { date: p.date, updated: p.updated, category: p.category }, ld: lds }) + header() +
      '<main id="main"><div class="wrap">' +
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog">Blog</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(p.title) + "</span></nav>" +
      '<header class="ahead"><span class="pill">' + esc(p.category) + "</span><h1>" + esc(p.title) + "</h1>" + (p.dek ? '<p class="lede">' + esc(p.dek) + "</p>" : "") +
      '<p class="meta"><time datetime="' + p.date + '">' + fmt(p.date) + "</time>" + (p.updated !== p.date ? '<span>Updated <time datetime="' + p.updated + '">' + fmt(p.updated) + "</time></span>" : "") + "<span>" + p.minutes + " min read</span><span>By " + esc(p.author || "Zenterra Developments") + "</span></p></header>" +
      '<figure class="acover" style="margin:0"><img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.title) + '" width="1600" height="900" fetchpriority="high"></figure>' +
      '<div class="alay"><article>' +
      (p.keyFacts.length ? '<section class="facts" aria-labelledby="kf"><h2 id="kf">Quick answers</h2><ul>' + p.keyFacts.map(function (k) { return "<li>" + k + "</li>"; }).join("") + "</ul></section>" : "") +
      '<div class="prose">' + p.body + "</div>" +
      '<section class="cta"><div><h2>Get pricing &amp; floorplans</h2><p>Current pricing and the Eden floorplan package by email, or book a private showhome appointment. ' + HOURS + '.</p></div><a class="btn" href="' + BOOK + 'article_end" data-cta="article-end">Get pricing &amp; floorplans</a></section>' +
      (p.faq.length ? '<section class="faq" aria-labelledby="fq"><h2 id="fq">Frequently asked questions</h2>' + p.faq.map(function (f, i) { return "<details" + (i === 0 ? " open" : "") + "><summary>" + esc(f.q) + '</summary><div class="ans">' + f.a + "</div></details>"; }).join("") + "</section>" : "") +
      "</article>" +
      '<aside class="aside" aria-label="Get pricing and floorplans"><div class="stick"><h2>See Eden in person</h2><p>Presale 1, 2 &amp; 3 bedroom condos in Willoughby, Langley. Get current pricing and floorplans, sent to your inbox.</p>' +
      '<a class="btn" href="' + BOOK + 'article_aside" data-cta="article-aside">Get pricing &amp; floorplans</a><a class="btn btn-ghost" style="width:100%;margin-top:10px;color:var(--ivory);border-color:rgba(244,237,225,.4)" href="/#floorplans" data-cta="article-aside-plans">View floorplans</a>' +
      '<div class="nap">' + SALES_ADDR + "<br>" + HOURS + '<br><a href="tel:' + TEL + '">' + PHONE + "</a></div></div></aside></div></div>" +
      (related.length ? '<section class="rel" aria-labelledby="rl"><div class="wrap"><h2 id="rl">More from Eden</h2><div class="grid">' + related.map(function (r) { return card(r, true); }).join("") + '</div><p style="margin:32px 0 0"><a class="btn btn-ghost" href="/blog">All articles</a></p></div></section>' : "") +
      "</main>" + footer() + "</body>\n</html>\n";
  }

  function index(all) {
    var title = "Eden by Zenterra Blog | Willoughby, Langley Condo News & Updates";
    var desc = "News, construction updates and neighbourhood guides for Eden by Zenterra, presale 1, 2 & 3 bedroom condos in Willoughby, Langley, BC.";
    var lds = [
      { "@context": "https://schema.org", "@type": ["Blog", "CollectionPage"], "@id": SITE + "/blog#blog", name: "Eden by Zenterra Blog", url: SITE + "/blog", description: desc, inLanguage: "en-CA", publisher: ORG, about: PROJECT,
        blogPost: all.map(function (p) { return { "@type": "BlogPosting", headline: p.title, url: p.url, datePublished: p.date, dateModified: p.updated, image: p.image }; }) },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" }, { "@type": "ListItem", position: 2, name: "Blog", item: SITE + "/blog" }] }
    ];
    var f = all[0], rest = all.slice(1);
    return head({ title: title, ogTitle: "Eden by Zenterra Blog", description: desc, url: SITE + "/blog", path: "/blog", image: f ? f.image : OG_DEFAULT, preload: f && f.image, ld: lds }) + header() +
      '<main id="main"><div class="wrap">' +
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav>' +
      '<header class="bhero"><span class="pill">Eden journal</span><h1>News &amp; neighbourhood updates from Eden in Willoughby, Langley</h1>' +
      '<p class="lede">Eden by Zenterra is a community of presale 1, 2 &amp; 3 bedroom condominiums at 19936 77 Avenue in Willoughby, Langley, across from the Langley Events Centre. Follow construction progress, transit and neighbourhood news, and buying guides from the Zenterra team.</p></header>' +
      (f ? '<a class="feat" href="' + f.path + '"><div class="ph"><img src="' + esc(f.image) + '" alt="' + esc(f.imageAlt || f.title) + '" width="1200" height="800" fetchpriority="high"></div><div class="tx"><span class="meta"><span>' + esc(f.category) + '</span><time datetime="' + f.date + '">' + fmt(f.date) + "</time><span>" + f.minutes + " min read</span></span><h2>" + esc(f.title) + "</h2><p>" + esc(f.description) + '</p><span class="more">Read article</span></div></a>' : '<p class="lede">Articles are on the way.</p>') +
      (rest.length ? '<div class="grid">' + rest.map(function (p) { return card(p, true); }).join("") + "</div>" : "") +
      '<section class="cta" style="margin:clamp(40px,6vw,72px) 0 clamp(48px,7vw,88px)"><div><h2>Get pricing &amp; floorplans</h2><p>Sent to your inbox, no obligation. Showhome at ' + SALES_ADDR + ". " + HOURS + '.</p></div><a class="btn" href="' + BOOK + 'blog_index" data-cta="blog-index">Get pricing &amp; floorplans</a></section>' +
      "</div></main>" + footer() + "</body>\n</html>\n";
  }

  function feed(all, today) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Eden by Zenterra Blog</title><link>' + SITE + "/blog</link>" +
      '<atom:link href="' + SITE + '/blog/feed.xml" rel="self" type="application/rss+xml"/><description>News and updates from Eden by Zenterra in Willoughby, Langley, BC.</description><language>en-ca</language>' +
      all.map(function (p) { return "<item><title>" + esc(p.title) + "</title><link>" + p.url + '</link><guid isPermaLink="true">' + p.url + "</guid><pubDate>" + new Date(p.date + "T16:00:00Z").toUTCString() + "</pubDate><description>" + esc(p.description) + "</description></item>"; }).join("") +
      "</channel></rss>\n";
  }

  function sitemap(all, today) {
    var u = function (loc, mod, freq, pr) { return "  <url>\n    <loc>" + loc + "</loc>\n    <lastmod>" + mod + "</lastmod>\n    <changefreq>" + freq + "</changefreq>\n    <priority>" + pr + "</priority>\n  </url>\n"; };
    var newest = all.length ? all.map(function (p) { return p.updated; }).sort().pop() : today;
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      u(SITE + "/", today, "weekly", "1.0") + u(SITE + "/blog", newest, "weekly", "0.8") +
      all.map(function (p) { return u(p.url, p.updated, "monthly", "0.7"); }).join("") + "</urlset>\n";
  }

  function llms(all) {
    return "# Eden by Zenterra\n\n> Presale 1, 2 & 3 bedroom condominiums at 19936 77 Avenue, Willoughby, Langley, BC, built by Zenterra Developments. Estimated completion Summer to Fall 2028.\n\n" +
      "- Website: " + SITE + "/\n- Presentation centre: " + SALES_ADDR + " (" + HOURS + ")\n- Phone: " + PHONE + "\n- Email: " + EMAIL + "\n\n## Blog\n\n" +
      all.map(function (p) { return "- [" + p.title + "](" + p.url + "): " + p.description; }).join("\n") + "\n";
  }

  function build(input) {
    var today = input.today || new Date().toISOString().slice(0, 10);
    var all = input.posts.filter(function (f) { return !/(^|\/)_/.test(f.file); }).map(function (f) { return parse(f.file, f.text); })
      .filter(function (p) { return !p.draft; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var out = { "blog/index.html": index(all), "blog/feed.xml": feed(all, today), "sitemap.xml": sitemap(all, today), "llms.txt": llms(all),
      "blog/posts.json": JSON.stringify(all.map(function (p) { return { slug: p.slug, title: p.title, description: p.description, date: p.date, category: p.category, image: p.image, url: p.path }; }), null, 1) };
    all.forEach(function (p) { out["blog/" + p.slug + "/index.html"] = article(p, all); });
    return out;
  }

  root.EdenBlog = { build: build };
  if (typeof module !== "undefined") module.exports = { build: build };
})(typeof globalThis !== "undefined" ? globalThis : this);
