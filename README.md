# ZYNERO website

Static website for ZYNERO — plain HTML, CSS and JavaScript. No build step, no database, no admin dashboard, no third-party scripts or cookies.

## Folder structure

```
index.html              Home
offers.html             Explore Offers (cards are built from assets/js/offers.js)
how-it-works.html       How It Works
about.html              About ZYNERO
contact.html            Contact (form opens the visitor's email app, addressed to support@zynero.in)
privacy-policy.html     Privacy Policy
terms.html              Terms & Conditions
cashback-policy.html    Cashback Policy
refund-policy.html      Refund & Cancellation Policy
404.html                Not-found page
favicon.ico, site.webmanifest, robots.txt, sitemap.xml
_headers                Security headers for Netlify / Cloudflare Pages
.htaccess               Security headers, HTTPS redirect and 404 page for Apache / LiteSpeed hosting
assets/css/styles.css   All styles
assets/js/main.js       Navigation, animations, offer cards, contact form
assets/js/offers.js     YOUR OFFER LIST — the only file to edit to publish offers
assets/img/             Logo, favicon, app icons, social-sharing image
assets/fonts/           Self-hosted fonts (SIL Open Font License, see OFL.txt)
```

## Publishing offers

Open `assets/js/offers.js` and add one object per genuine offer, following the example in the comment at the top of the file. Save and re-upload that one file. Expired offers (past `validUntil`) and links that don't start with `https://` are hidden automatically. While the list is empty, the Explore Offers page explains how offers are verified and invites visitors to request a store.

## Deploying

Upload the whole folder (keeping its structure) to the web root of `zynero.in`. Works on Netlify, Cloudflare Pages, Vercel, GitHub Pages or any shared hosting. Canonical URLs, the sitemap and social-sharing tags use `https://zynero.in/` — if you use a different domain, search-and-replace `https://zynero.in` across the files.

Pages also open directly from the folder (double-click `index.html`) for a quick local preview.
