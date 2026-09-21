/* eden-boot.js — Cloudinary URL builder + sun-phase + LCP preload.
   Loaded synchronously in <head> so the hero preload fires before the app JS. */
(function () {
  var BASE = "https://res.cloudinary.com/jvsvq2qw/image/upload/";
  var MAP = {"home-hero-exterior":"v1787252254/home-hero-exterior_a0ieal.jpg","home-explore-register":"v1787252253/home-explore-register_hnfi5p.png","home-explore-homes":"v1787252252/home-explore-homes_r9tg7i.png","home-explore-amenities":"v1787252250/home-explore-amenities_zxploq.png","fp-e2":"v1787252249/fp-e2_dkkzp5.webp","fp-e1":"v1787252247/fp-e1_vujb18.webp","fp-d1":"v1787252246/fp-d1_zr3dyu.webp","fp-c11a":"v1787252244/fp-c11a_oh5egl.webp","fp-c11":"v1787252243/fp-c11_htpmho.webp","fp-c9":"v1787252242/fp-c9_m0uyg4.webp","fp-c6":"v1787252240/fp-c6_xcvngc.webp","fp-c5e":"v1787252239/fp-c5e_ebk7ei.webp","fp-c5":"v1787252237/fp-c5_fp9e0t.webp","fp-c4":"v1787252236/fp-c4_g07om9.webp","fp-c2e":"v1787252235/fp-c2e_q5kjgw.webp","fp-c2":"v1787252233/fp-c2_yezw0s.webp","fp-b12":"v1787252232/fp-b12_u42cum.webp","fp-b11":"v1787252230/fp-b11_kwtrg6.webp","fp-b10":"v1787252229/fp-b10_mybwmv.webp","fp-b8d":"v1787252227/fp-b8d_rjiktq.webp","fp-b8":"v1787252226/fp-b8_zh5eqy.webp","fp-b5":"v1787252225/fp-b5_kmrwa4.webp","fp-b4":"v1787252223/fp-b4_u8yty2.webp","fp-b3a":"v1787252222/fp-b3a_zdmlus.webp","fp-b2":"v1787252221/fp-b2_k65xbt.webp","fp-b1":"v1787252219/fp-b1_n4fnxm.webp","fp-a7":"v1787252218/fp-a7_a1lxnp.webp","fp-a6":"v1787252216/fp-a6_zeigbd.webp","dev-p12":"v1787252215/dev-p12_ixeduq.webp","dev-p10":"v1787252214/dev-p10_qfztrh.webp","dev-p11":"v1787252212/dev-p11_z6kqxt.webp","dev-p8":"v1787252211/dev-p8_lsj9eh.webp","dev-p7":"v1787252210/dev-p7_ukgkq9.webp","dev-p4":"v1787252208/dev-p4_rtbfmm.webp","dev-p3":"v1787252207/dev-p3_o3ruh0.webp","dev-p2":"v1787252206/dev-p2_sxfcva.webp","dev-p1":"v1787252204/dev-p1_skz0ub.webp","amen-g3":"v1787252203/amen-g3_qahsie.webp","amen-g2":"v1787252201/amen-g2_ad9g7e.webp","amen-g1":"v1787252199/amen-g1_r7ix70.webp","amen-6":"v1787252189/amen-3_sv5lg2.webp","amen-5":"v1787252192/amen-5_ixx4am.webp","homes-finishes":"v1787252185/homes-finishes_kcmica.webp","home-hero":"v1787252182/home-hero_wggmpw.webp","hero-homes":"v1787252179/hero-homes_whmyzx.webp","hero-floorplans":"v1787252178/hero-floorplans_gmstao.webp","hero-faq":"v1787252177/hero-faq_przlzm.webp","hero-developer":"v1787252175/hero-developer_qv26to.webp","hero-amenities":"v1787252174/hero-amenities_fxybri.webp","fp-pe":"v1787252172/fp-pe_eaagv1.webp","fp-pd":"v1787252171/fp-pd_t99kav.webp","fp-e4":"v1787252169/fp-e4_pgrw8r.webp","fp-e3":"v1787252168/fp-e3_wpppoz.webp","5-lawn":"v1787251898/5-lawn_vt3cs0.jpg","6-picnic-dog":"v1787251897/6-picnic-dog_ospeaj.jpg","4-playground":"v1787251891/4-playground_mowzkr.jpg","3-putting-green":"v1787251890/3-putting-green_sfxjhw.jpg","2-bocce":"v1787251889/2-bocce_ikfxd0.jpg","1-pickleball":"v1787251888/1-pickleball_i6ze1u.jpg","7-balcony-sunset":"v1787251888/7-balcony-sunset_bquyoa.jpg","GA-WINNER-V_2026":"v1787251916/GA-WINNER-V_2026_xxwgiv.png","GA-WINNER-V":"v1787251916/GA-WINNER-V_2026_xxwgiv.png","HAVAN_2026":"v1787251915/HAVAN_2026_jkltpn.png","HAVAN":"v1787251915/HAVAN_2026_jkltpn.png","GA-WINNER-H_2026":"v1787251914/GA-WINNER-H_2026_plosor.png","GA-WINNER-H":"v1787251914/GA-WINNER-H_2026_plosor.png","4-primary-bedroom":"v1787251959/4-primary-bedroom_qjb4r8.jpg","3-kitchen":"v1787251958/3-kitchen_jloji8.jpg","2-living-details":"v1787251957/2-living-details_kr1zrl.jpg","1-living-dining":"v1787251955/1-living-dining_zsiol4.jpg","8-living-outlook":"v1787251954/8-living-outlook_zeji7r.jpg","7-open-plan":"v1787251952/7-open-plan_ykpcuu.jpg","6-bath":"v1787251951/6-bath_y52ush.jpg","5-bedroom-outlook":"v1787251950/5-bedroom-outlook_cxxsma.jpg","10-kitchen-dark":"v1787251948/10-kitchen-dark_z5d94x.jpg","9-kitchen-light":"v1787251946/9-kitchen-light_lq7rlp.jpg","illustration-rabbit-jumping":"v1787251819/illustration-rabbit-jumping_yl3cic.png","illustration-rabbit-sitting":"v1787251819/illustration-rabbit-sitting_ugmuty.png","illustration-flower-vase":"v1787251818/illustration-flower-vase_mjscru.png","illustration-flower":"v1787251817/illustration-flower_kajo9s.png","illustration-door-flowers":"v1787251817/illustration-door-flowers_u4xu6f.png","eden-zenterra-stacked":"v1787251816/eden-zenterra-stacked_ojmohj.png","eden-zenterra-lockup":"v1787251815/eden-zenterra-lockup_vmxdtb.png","eden-logo-mark":"v1787251814/eden-logo-mark_vrwbeu.png","eden-logo":"v1787251813/eden-logo_bcs3k0.png","eden-logo-ivory":"v1787251813/eden-logo-ivory_pziaut.png","zenterra-logo-white":"v1787251812/zenterra-logo-white_isaqk7.png","zenterra-logo-black":"v1787251811/zenterra-logo-black_ouw5ht.png","zenterra-logo-green":"v1787251811/zenterra-logo-green_cnyalg.png","zenterra-logo":"v1787251810/zenterra-logo_qqwugd.png","5-yellow_1":"v1787252078/5-yellow_1_zi5puz.jpg","5-yellow":"v1787252078/5-yellow_1_zi5puz.jpg","6-sunset":"v1787251978/6-sunset_cxbiic.jpg","1-park":"v1787251977/1-park_f2cfqu.jpg","7-poppy":"v1787251974/7-poppy_wpb47g.jpg","4-meadow":"v1787251972/4-meadow_oast0x.jpg","3-putting":"v1787251970/3-putting_mri9vp.jpg","2-pickleball":"v1787251969/2-pickleball_o63jdt.jpg","C9":"v1784309878/C9_wbjdcd.jpg","C6":"v1784309876/C6_cjefvp.jpg","C5e":"v1784309875/C5e_i62kca.jpg","C5":"v1784309873/C5_ranxhh.jpg","C4":"v1784309872/C4_m82tqa.jpg","C2e":"v1784309870/C2e_xok4lo.jpg","C2":"v1784309869/C2_ecceaf.jpg","B12":"v1784309867/B12_i90pux.jpg","B11":"v1784309866/B11_iinb4x.jpg","B10":"v1784309864/B10_xmshhz.jpg","B8d":"v1784309863/B8d_abpxhg.jpg","B8":"v1784309861/B8_ek6xd4.jpg","B5":"v1784309860/B5_d0ub7g.jpg","B4":"v1784309858/B4_jhagaf.jpg","B3a":"v1784309856/B3a_xdotxj.jpg","B2":"v1784309854/B2_vymnl1.jpg","B1":"v1784309853/B1_shbay4.jpg","A7":"v1784309851/A7_ydy1it.jpg","A6":"v1784309850/A6_hfjpdq.jpg","E4":"v1784309849/E4_e9gb2p.jpg","E3":"v1784309847/E3_dkomru.jpg","E1":"v1784309846/E1_y3ueye.jpg","E2":"v1784309844/E2_w3kovo.jpg","E":"v1784309843/E_rtgdrl.jpg","D1":"v1784309842/D1_hqsrnb.jpg","C11a":"v1784309840/C11a_qiq7q1.jpg","D":"v1784309839/D_anabwx.jpg","C11":"v1784309838/C11_fqhs6j.jpg","loc-near-willowbrook":"v1787266930/loc-near-willowbrook_ikxyx9.webp","loc-near-wcp":"v1787266928/loc-near-wcp_kivo5t.webp","loc-near-remountain":"v1787266925/loc-near-remountain_w8ae3x.webp","loc-near-lec":"v1787266923/loc-near-lec_wp5cxc.webp","loc-near-hwy1":"v1787266920/loc-near-hwy1_xbmzgx.webp","loc-near-colossus":"v1787266917/loc-near-colossus_y69fyt.webp","loc-near-carvolth":"v1787266915/loc-near-carvolth_nerklf.webp","loc-map":"v1787266912/loc-map_un4bui.webp","loc-brt-station":"v1787266910/loc-brt-station_zbjjwt.webp","loc-brt-skytrain":"v1787266907/loc-brt-skytrain_xpw3dg.webp","loc-brt-lanes":"v1787266905/loc-brt-lanes_q44dnd.webp","home-slide-4":"v1787266902/home-slide-4_boop8m.webp","home-slide-3":"v1787266900/home-slide-3_ubvj7n.webp","home-slide-2":"v1787266898/home-slide-2_zncpvn.webp","home-slide-1":"v1787266894/home-slide-1_oogn3p.webp","home-slide-0":"v1787266892/home-slide-0_cotb8n.webp","loc-near-wtc":"v1787266890/loc-near-wtc_z5dqmh.webp","amen-7":"v1787345130/amen-7_a55pxw.webp","amen-4":"v1787345130/amen-4_hjnyzr.webp","amen-3":"v1787345130/amen-3_zzw226.webp","hero-location":"v1787345130/hero-location_dsuduo.webp","amen-2":"v1787345130/amen-2_joetp2.webp","amen-1":"v1787345130/amen-1_iqsqvd.webp","dev-p5":"v1787345130/dev-p5_vksbhi.webp","amen-8":"v1787345129/amen-8_ytya2f.webp","home-hero-lateafternoon":"v1788189621/home-hero-lateafternoon_fmco42.jpg","home-hero-afternoon":"v1788189621/home-hero-afternoon_qz1i1w.jpg","home-hero-evening-v2":"v1788189621/home-hero-evening-v2_jy736x.jpg","home-hero-morning":"v1788189622/home-hero-morning_aqjgp4.jpg","home-hero-latemorning":"v1788189622/home-hero-latemorning_z1m8zj.png"};
  var HERO = { morning:"home-hero-morning", latemorning:"home-hero-latemorning",
    afternoon:"home-hero-afternoon", lateafternoon:"home-hero-lateafternoon",
    evening:"home-hero-evening-v2" };
  var LAT = 49.1044, LON = -122.6603;

  function cdn(id, tr) {
    var p = MAP[id];
    return p ? BASE + (tr || "f_auto,q_auto") + "/" + p : "";
  }
  function phase(now) {
    now = now || new Date();
    var rad = Math.PI / 180;
    var d = (now.getTime() / 86400000) + 2440587.5 - 2451545.0;
    var g = (357.529 + 0.98560028 * d) * rad;
    var q = 280.459 + 0.98564736 * d;
    var L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad;
    var e = (23.439 - 0.00000036 * d) * rad;
    var dec = Math.asin(Math.sin(e) * Math.sin(L));
    var ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) / rad / 15;
    var gmst = (18.697374558 + 24.06570982441908 * d) % 24;
    var lst = ((gmst + LON / 15) % 24 + 24) % 24;
    var haH = lst - ra;
    while (haH < -12) haH += 24;
    while (haH > 12) haH -= 24;
    var ha = haH * 15 * rad;
    var alt = Math.asin(Math.sin(LAT * rad) * Math.sin(dec) +
      Math.cos(LAT * rad) * Math.cos(dec) * Math.cos(ha)) / rad;
    var rising = haH < 0;
    var maxAlt = Math.max(6, 90 - LAT + dec / rad);
    var frac = alt / maxAlt;
    if (alt < -2) return "evening";
    if (rising) return frac < 0.55 ? "morning" : "latemorning";
    if (frac > 0.55) return "afternoon";
    if (frac > 0.18) return "lateafternoon";
    return "evening";
  }
  var WIDTHS = [640, 960, 1280, 1600, 2000];
  function heroSrc(p, w) { return cdn(HERO[p] || HERO.morning, "f_auto,q_auto,w_" + (w || 1600)); }
  function heroSrcset(p) {
    return WIDTHS.map(function (w) { return heroSrc(p, w) + " " + w + "w"; }).join(", ");
  }
  function preloadHero() {
    try {
      if (document.querySelector('link[data-eden-hero]')) return;
      var p = phase();
      var l = document.createElement("link");
      l.rel = "preload"; l.as = "image"; l.setAttribute("data-eden-hero", "");
      l.href = heroSrc(p, 1600);
      l.setAttribute("imagesrcset", heroSrcset(p));
      l.setAttribute("imagesizes", "100vw");
      l.setAttribute("fetchpriority", "high");
      document.head.appendChild(l);
    } catch (err) { /* preload is best-effort */ }
  }
  window.EdenBoot = { BASE: BASE, MAP: MAP, HERO: HERO, cdn: cdn, phase: phase,
    heroSrc: heroSrc, heroSrcset: heroSrcset, preloadHero: preloadHero };
})();
