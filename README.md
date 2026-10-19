# Eden by Zenterra: production deploy (October 19, 2026)

Deploy the contents of this folder to the Vercel web root. URLs unchanged:
`/`, `/blog`, `/blog/<slug>`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/assets/plans/*.pdf`.

    index.html                   real <head>, tracking tags, JSON-LD, static header + hero, crawl shell
    assets/js/react.<hash>.js    React 18 + ReactDOM (self-hosted, cached separately)
    assets/js/eden.<hash>.js     the site, minified, with eden.<hash>.js.map
    assets/js/eden-lead.js       short lead form used at the end of every blog post
    assets/loc-neighbourhood-map-clean.webp   Location page map
    favicon.ico, favicon-32x32.png, apple-touch-icon.png, icon-192/512.png, site.webmanifest
    vercel.json                  security headers + CSP, long-cache headers

Remove from the Vercel project if still present: `assets/js/eden.b5ea7b53.js`,
`support.js`, `eden-boot.js`, `image-slot.js`, `EdenBookForm.dc.html`.

## Before going live
1. **Tracking.** `index.html` and the blog use the standard GTM snippet (head +
   noscript) for GTM-M4MNHS77, loaded immediately, not after paint and not behind
   a consent banner. Google Ads AW-16577438747, GA4 G-QF7ZLEP0B3 and Microsoft
   Clarity (yisp6n61s6) fire from inside that container. Do not add a second
   gtag.js config for AW-16577438747: the live container already sends it, and a
   duplicate config double-counts.
2. **Blog tags.** `scripts/blog-builder.js` emits the same immediate GTM snippet.
   Rebuild with `node scripts/build-blog.mjs` after editing a post.
3. **Postal code.** JSON-LD now uses `V2Y 1S3` for 19936 77 Avenue (taken from a
   public listing). Confirm with Canada Post before launch.
4. **Zapier.** `is_realtor` and `working_with_realtor` are now sent as "Yes"/"No"
   (capitalised). `realtor` still carries yes/no. Re-test the Zap mapping.
5. **CSP.** After deploy, open the console on `/` and `/blog/...`, check for
   CSP violations, and confirm GTM, GA4, Ads and Clarity fire in Tag Assistant /
   Clarity live view.

## What changed
Forms
- Thank-you state reads "Thanks, pricing is on its way."
- Drawer: page behind no longer scrolls; submit button is sticky at the bottom of the drawer.
- Every blog post ends with an inline short form (same fields, same hook,
  form_location `blog_post_end`). The blog builder adds it to future posts.

Nudge
- Shows once ever (localStorage) after 45 s or 50% scroll, on every page except
  Register. Never over an open drawer, never after a submit.

SEO / AEO / GEO
- FAQ: 10 questions. The visible FAQ, the crawl shell and FAQPage JSON-LD are
  generated from one list, so they match word for word.
- ApartmentComplex: full postal code, phone, image, `builder` and `developer`
  linked to a new Organization/RealEstateDeveloper block for Zenterra
  (logo, head office, phone, social profiles), and an AggregateOffer from $374,990.
- og:image / twitter:image added; `lang="en"`; favicon set and web manifest.
- sitemap.xml lastmod updated; the blog builder keeps adding new posts.

Accessibility
- Orange CTA colour darkened to #a5532a (white text 5.4:1); eyebrow sage text
  darkened to #66674b; grey captions to #6f6857. All now pass WCAG AA.

Performance
- React is a separate long-cached file; site code is minified with a source map.
- The tracking tags now load in `<head>` as requested, so they count against
  Lighthouse Performance. Run Lighthouse after deploy; 90+ mobile is not
  guaranteed with GTM + gtag.js loading synchronously in the head.

## Rebuilding
Source of truth: `Eden.dc.html`, `EdenBookForm.dc.html`, `eden-location-map.js`
in the design project. `build/build-prod.js` compiles them into this folder.
