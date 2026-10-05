# Eden by Zenterra: production deploy

Deploy the contents of `export/site/` to the Vercel web root.

    index.html              the site (real <head>, canonical, crawl shell, JSON-LD)
    eden-boot.js            Cloudinary URL builder + time-of-day hero + LCP preload
    support.js              app runtime
    image-slot.js           PRODUCTION image component (plain <img> + baked crops)
    EdenBookForm.dc.html    the one booking/register form, imported by index.html
    assets/plans/*.pdf      28 floorplan downloads
    blog/                   generated, static, crawlable blog (do not hand-edit)
    content/blog/*.html     blog SOURCE posts (edit these)
    scripts/                blog builder
    sitemap.xml, robots.txt, llms.txt, vercel.json

## What was wrong with the last live export
`image-slot.js` in the previous package was an early production build that
ignored the framing set in the design (scale + pan for every page header,
the past-community tiles, BRT and home slides). Every one of those images fell
back to a centred crop. The file in this package carries the exact framing for
each slot id, so headers and tiles now match the design.

## Blog
Pages are plain HTML at build time: title, description, canonical, Open Graph,
one H1, breadcrumbs, BlogPosting + BreadcrumbList + FAQPage JSON-LD, visible
"Quick answers" and FAQ text, RSS, sitemap entries and llms.txt. No JavaScript
is needed to read anything. Book CTAs (header, sidebar, end of article, mobile
bar) push `book_click` to the dataLayer; every page pushes `page_view`.

Add a post:
1. Copy `content/blog/_template.html` to `content/blog/<slug>.html`.
2. Fill the JSON front matter and paste the body HTML. Remove `"draft": true`.
3. From `export/site/` run `node scripts/build-blog.mjs`.
4. Deploy. `blog/`, `sitemap.xml` and `llms.txt` are regenerated.

Moving posts from zenterra.ca: when a post goes live here, 301 the zenterra.ca
URL to the new one (or set its canonical to it). Two copies of the same text on
two domains split ranking. The seeded post is "Construction Has Started at
Eden"; its original URL is kept in `originalUrl` for the redirect. Its images
still load from zenterra.ca/wp-content; move them to Cloudinary when convenient.

URLs: /blog and /blog/<slug> (no trailing slash, matches vercel.json).

## CRO pass, October 5 2026
One offer everywhere: "Get Pricing & Floorplans". Every CTA opens the same
EdenBookForm (first name, email, phone, bedrooms, realtor, optional "book a
private showhome appointment"). Same success state with next steps. Every
submit posts to the same Zapier hook with tags Eden_Website, source
edenbyzenterra.ca, offer pricing_floorplans, appointment yes/no,
preferred_plan, and entryPoint = form_location:

  header, sticky, hero, hero_band, cta_band, mobile_menu, floorplan_card,
  plan_detail, compare_panel, floorplans_inline, amenities_inline,
  register_page, page_footer, nudge, blog_header, blog_mobile_bar,
  blog_article_end, blog_article_aside, blog_blog_index

Blog CTAs link to /?get=pricing&from=blog_<spot>; the site opens the drawer
on load and strips the parameter.
Form: custom validation with inline error (name, email, 10-digit phone),
"Sending..." state, double-submit guard.
Dead clicks fixed: plan card title/size/summary open plan detail; tapping the
active amenity photo advances the carousel; plan detail now leads with
"Get pricing for this plan", PDF download is secondary.
Nudge: once per session, 35 s on Floorplans/Amenities, skipped while typing,
zoomed, menu/compare/staff panel open, or another form is open.
Blog: added "New ARENAS at Langley Events Centre..." and "New Condos in
Willoughby, Langley: Buy Before the BRT...". 301 their zenterra.ca URLs here.

## Rebuilding
Source of truth is /Eden.dc.html in the design project. Ask Claude to
"rebuild export/site" after any edit.
