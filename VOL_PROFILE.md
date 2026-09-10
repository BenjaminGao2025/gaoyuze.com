# Personal profile — vol.gaoyuze.com

The owner requested a shareable Simplified Chinese resume website instead of the Word document. Content is based on the owner-reviewed Chinese resume v3.1 and corrections. This is a personal resume, not a campaign website. Do not add government IDs, immigration records, home address, private financial figures, invented roles, client counts, or political claims.

## Files and URLs

- Content, layout, responsive styles and print styles: `public/vol/index.html`. This standalone HTML has no build dependency, no external fonts/scripts and no analytics. Edit its semantic sections to update the resume. This is not a Pages CMS collection.
- Existing production site also serves the profile at `https://gaoyuze.com/vol/` and `https://gaoyuze-com.pages.dev/vol/` after deployment.
- `functions/index.js` handles **only the root route**. On hostname `vol.gaoyuze.com`, it reads `/vol/` from the Pages ASSETS binding. Other hostnames use `context.next()` and keep the blog homepage.
- `public/_routes.json` explicitly includes only `/`. Articles, `/vol/`, uploads and all other static assets do not invoke the function.
- No changes to blog layouts, articles, RSS, dependencies, Pages CMS configuration or the volunteer management system.

## One-time domain setup — required in the owner's Cloudflare account

Reuse the existing Pages project **gaoyuze-com**, production branch **main**, build `npm run build`, output `dist`. Do not create another server or change the blog's primary domain.

Cloudflare dashboard → Workers & Pages → gaoyuze-com → Custom domains → Set up a domain → `vol.gaoyuze.com` → follow the DNS confirmation.

The required CNAME is `vol` → `gaoyuze-com.pages.dev`. If gaoyuze.com DNS is managed in this Cloudflare account, the setup flow can create it. A CNAME alone is not enough: Pages must associate the custom hostname and issue its certificate. Wait for the custom domain to become Active; then verify its actual content and HTTPS. Do not claim the custom domain is live until checked.

References:
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/pages/functions/routing/

## Privacy and publishing

The resume is intended for sharing by link and contains professional contact details. It has `noindex,nofollow,noarchive`; the custom-domain root also returns an X-Robots-Tag header. It is not linked from the blog navigation and the static HTML is not an Astro sitemap route. **These are indexing preferences, not access control**: anyone with the URL can read and forward it, and source code in a public repository can also be read. ID verification must be done separately. No photographs or ID files are included.

## Test

`node --test tests/vol-root.test.mjs`

This tests host isolation, route scope, GET/HEAD, method rejection, indexing header and resume content guardrails. Local browser QA also covered 320, 375, 390, 430, 760, 768, 1024 and 1440 px widths, no horizontal overflow, company details, print controls, clipboard failure fallback and JavaScript-disabled reading. Print opens the browser dialog and expands company details; users can save as PDF.

## Rollback

Revert the additive profile commit to remove these files. Do not force-push or reset unrelated history. Disconnect the custom hostname separately in the Cloudflare dashboard if the profile is permanently retired.
