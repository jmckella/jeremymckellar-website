# Character artwork


## Revised scenes (current)

The similar standing poses were replaced with `public/assets/caricature-writing-scene.webp` and `public/assets/caricature-recording-scene.webp`. These are used in stacked horizontal panels, with image-first stacking below 760px. Original hero and desk remain unchanged from the preceding revision. Built-in image generation, followed by authorized local background and tooth cleanup. Production build passed; revised panels visually inspected at the browser's current 829px viewport.

### Writing prompt
Reference image is strictly CHARACTER IDENTITY and flat illustration style only, not composition. Preserve warm brown skin, short black hair, full shaped beard, small oval eyes, friendly facial proportions; clean WHITE teeth if visible. Create a distinctly NEW pose, NOT standing, NOT presenting, NO raised open palm, NO tablet, NO floating cards. Flat clean vector-like illustration, restrained navy gold cream palette. Landscape 3:2 composition, all elements contained. Solid uniform magenta #FF00FF background for extraction; no magenta in subject. Jeremy wears a heavyweight plain white T-shirt and charcoal trousers, sitting relaxed in a navy lounge chair, leaning forward slightly, looking down thoughtfully at an open paper notebook on his lap while writing with a pen. Both hands engaged naturally with notebook. Closed mouth gentle smile, no visible teeth needed. Full chair and shoes visible. Minimal cozy vignette, no desk or extra furnishings.

### Recording prompt
Reference image is strictly CHARACTER IDENTITY and flat illustration style only, not composition. Preserve warm brown skin, short black hair, full shaped beard, small oval eyes, friendly facial proportions; clean WHITE teeth if visible. Create a distinctly NEW pose, NOT standing, NOT presenting, NO raised open palm, NO tablet, NO floating cards. Flat clean vector-like illustration, restrained navy gold cream palette. Landscape 3:2 composition, all elements contained. Solid uniform magenta #FF00FF background for extraction; no magenta in subject. Jeremy wears a warm muted olive casual overshirt over a white T-shirt. Seated at a small round podcast table, viewed at a three-quarter angle facing RIGHT, leaning toward a microphone on a boom arm, one hand lightly touching a headphone earcup, the other resting on the table beside a mug. Friendly conversational expression, white teeth. Headphones, microphone and tabletop create a clear recording scene. Waist-up composition with table, no standing figure, no open-palm gesture.


- `public/assets/caricature-hero-white-teeth.png`: original hero with only 191 pixels within the tooth area (x262–288, y121–131) whitened. Every other pixel is unchanged.
- `public/assets/caricature-white-tee.webp`: approved white heavyweight T-shirt concept, neutral white teeth; cleaned transparent background. Used in the writing panel.
- `public/assets/caricature-navy-host.webp`: new navy overshirt over a white T-shirt with microphone. Used in the conversation panel.
- Original desk illustration and blue-jacket tablet illustration remain unchanged.

New outfit generated with the built-in image generation tool. Transparent asset cleanup and original tooth correction used user-authorized local pixel editing. New generated poses are interpretations of the reference; the original hero is preserved exactly apart from teeth.

## New outfit prompt

Use case: identity-preserve. Make an outfit variation of the exact attached illustrated character for his personal website. Preserve original head shape, face, small oval eyes, hairline, beard, warm brown skin, smile, proportions and minimal flat vector style. Teeth clean neutral white. Dress him in a navy blue relaxed overshirt with rolled sleeves over a clean heavyweight white crewneck T-shirt, charcoal trousers. Keep the same friendly open hand gesture, replace tablet with a compact podcast microphone on a stand below his shoulders; remove floating gold cards. Thigh-up, clear face, no headphones. Restrained contour lines, no realism, no textures, no redesign. Entire figure fits square canvas with clear margin. Background solid vivid magenta #FF00FF for precise background removal; no magenta anywhere on character, no shadows on backdrop. No text.

## Validation

Astro production build and git diff whitespace check passed. Character panels visually reviewed in the local browser. New assets inspected against navy before integration. Local preview only; not published. Full phone viewport validation was not completed because the browser viewport control was unavailable.
