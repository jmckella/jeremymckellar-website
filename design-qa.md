# Portfolio update QA

final result: passed

Scope: targeted evolution of the existing Astro website, retaining its selected visual identity. Approved changes intentionally replace the signup-first opening with a work-first path and add employer-aware positioning.

## Evidence

Source visual: ../audit/01-home.png (829 × 1097 pixels).
Implementation: ../audit/preview-home-matched.png (829 × 1097 pixels).
Both displayed together in the same comparison call. Viewport 829 × 1097 CSS pixels, 1× image density, top of homepage. Rotating headline words differ by animation phase; unchanged headline geometry was compared. No image resizing or crop normalization was needed.

Additional captures: ../audit/preview-projects-final.png (829 × 1097), ../audit/preview-contact-mobile.png and ../audit/preview-writing-mobile.png (390 × 844), ../audit/preview-approach-final.png (1280 × 720).

## Findings and comparison history

- Initial behavior check: sticky navigation was defeated by the original overflow-x:hidden wrapper. Changed to overflow-x:clip. Post-fix mobile contact capture shows the navigation fixed at the top; DOM top=0 while scrolled.
- Initial mobile menu had a different destination from desktop contact and omitted What I bring. Both menus now use #connect and #approach. Browser verified open, focus wrap with Shift+Tab, Escape close, restored focus, and expanded state.
- Initial development toolbar obscured the lower viewport. Disabled it for the review preview and recaptured final evidence.
- Matched final hero comparison found no actionable P0/P1/P2 visual differences beyond approved content changes. Same display/body families, weights, navy/gold palette, hero scale, rounded controls, illustration, and particle layer. Intro and button positions move upward as expected after the signup form removal.
- New work screenshots are actual app captures, at their original 16:9 ratio with no stretch or crop. Demo content is explicitly captioned. Existing caricatures and portrait remain original assets.
- New headings and editorial columns follow existing display typography and section spacing. Muted token contrast was improved. Phone layouts reflow with no horizontal document overflow at 390px on homepage, contact, and archive.
- Copy leads with technical and collaborative strengths. Motion Visual Media is a subordinate creative-work mention, not a main service CTA. Existing article dates remain unchanged.

## Validation

- Astro production build succeeds: 14 HTML pages plus sitemap endpoint.
- Static validation passes for all generated internal links, anchors, local image paths, image alternative text, one H1 per page, and sitemap XML.
- No placeholder subscription forms remain. Shared LinkedIn follow component present on homepage, archive, and articles.
- Browser verified main work/contact navigation, archive and sampled article loading, email link destinations, mobile menu behavior. No sampled browser console errors.
- Reduced-motion script test passes: no timers/animation loops start and static ticker remains readable.
- git diff --check and node --check pass.

## Limits / follow-up

No production deployment, Search Console access, field performance measurement, email sending, full assistive-technology test, or newsletter integration. Social preview uses the existing portrait; a designed landscape share image would be a future polish step. Motion Visual Media URL verified against its local website canonical; web search fetch could not load it. Existing Astro content auto-discovery warning remains. npm ci reported six dependency advisories from the unchanged lockfile; investigate separately before production release rather than apply unreviewed breaking upgrades.

## Motion iteration

Added native-scroll decorative depth, subtle chapter background changes, shorter staggered reveals, and offscreen/hidden-tab particle suspension. Approved visitor copy retained. No scroll locking, snapping, or synthetic wheel handling added.

Browser checks: depth moved from 0 to .528 with native scroll; particle layer translated 47.52px and glow opacity became .472. Project navigation selected work chapter and background rgb(16,27,60). Phone breakpoint DOM check confirmed decorative transforms are none and viewport/document widths equal. Browser resize captures were inconsistent and rejected; no claim of a complete physical-device test.

Visual fix: initial downward illustration movement touched the ticker; reversed it to a restrained upward recession and recaptured ../audit/motion-transition.png at 1280×720. It now clears the ticker. Original illustration, type, palette, and section geometry retained. Final desktop capture accepted. No sampled console errors. Build and diff checks pass. Script tests cover regular/reduced-motion depth and coalescing repeated scroll events into one frame.

final result: passed
