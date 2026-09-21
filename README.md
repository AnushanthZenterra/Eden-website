# Eden — production deploy (performance build)

Deploy the contents of `export/site/` to the web root. Four files + the plan PDFs:

    index.html        176 KB  real <head>, lang="en", canonical, LCP preload
    eden-boot.js       10 KB  Cloudinary URL builder + sun phase + LCP preload
    support.js         69 KB  app runtime (cacheable, separate file)
    image-slot.js      45 KB  image component (cacheable, separate file)
    EdenCta.dc.html     1 KB  CTA block imported by index.html
    assets/plans/*.pdf        floorplan downloads

Do NOT deploy the single-file "standalone" build any more — that was the 1.6 MB
document with the #__bundler_loading splash and no viewport/canonical in <head>.

## Cloudinary
Every image URL is built as:

    https://res.cloudinary.com/jvsvq2qw/image/upload/f_auto,q_auto,w_<N>/<version>/<public_id>

    hero (LCP + layers)  w_640/960/1280/1600/2000 via srcset, sizes="100vw"
    slot photography     w_1400
    homes slideshow      w_1600
    mosaic tiles         w_1000
    awards badges        w_400
    logos / illustration w_600 / w_900

f_auto gives AVIF to Chrome/Edge/Firefox and WebP to Safari. No raw originals
are referenced anywhere. Widths live in eden-boot.js / the build rewrite — change
them there, never by pasting a raw Cloudinary URL into the markup.

## Third-party runtime
support.js loads React 18.3.1 + ReactDOM UMD from unpkg. The head preconnects to
unpkg.com and preloads both files (SRI-pinned inside support.js), so they no
longer sit behind support.js in the request chain. Self-host them on the Vercel
origin if you want zero third-party dependency on first paint.

## LCP
eden-boot.js runs synchronously in <head>, computes the current sun phase, and
injects:

    <link rel="preload" as="image" fetchpriority="high"
          imagesizes="100vw"
          imagesrcset="…w_640/… 640w, …w_960/… 960w, …w_1280/… 1280w,
                       …w_1600/… 1600w, …w_2000/… 2000w"
          href="…f_auto,q_auto,w_1600/v1788189622/home-hero-<phase>_….jpg">

The hero <img> renders the same phase with fetchpriority="high" and explicit
width/height, so the preload is always the image that paints. The other four
time-of-day renders attach only after load + idle (fetchpriority="low"), or
immediately if the phase changes / the staff Tweak forces one.

## Deferred work
- Mosaic (1-park, 6-sunset …): background-image stays "none" until an
  IntersectionObserver fires 500 px before the section enters the viewport.
- GTM (GTM-M4MNHS77) injects 1.2 s after load, or on first pointer/key/touch —
  whichever comes first. No WordPress, jQuery or zenterra.ca script is loaded.

## Rebuilding
Source of truth is /Eden.dc.html. The deploy copy is produced by rewriting
assets/* paths to Cloudinary (in index.html AND EdenCta.dc.html) and hoisting the helmet's title/description/
og/ld+json into a real <head>. Ask Claude to "rebuild export/site" after any
edit to Eden.dc.html.
