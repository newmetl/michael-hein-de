# Design System Strategy: The Silent Curator

This design system is built for the high-end art and photography space, where the interface must act as a sophisticated, invisible frame for the work it hosts. It moves away from the "app-like" density of modern SaaS and toward the expansive, breathable layout of a physical gallery or a premium editorial magazine.

---

### 1. Creative North Star: The Digital Gallery
The "Creative North Star" for this system is **The Digital Gallery**. In a physical gallery, the architecture never competes with the art; it provides light, space, and a neutral stage. We achieve this through "Atmospheric Asymmetry"—breaking the rigid, centered web grid in favor of intentional whitespace that guides the eye. Elements should feel like they are floating on a cohesive plane rather than being boxed into a layout.

---

### 2. Colors & Surface Philosophy
The palette is a study in tonal restraint. We rely on the interplay of `surface` variants to create depth, avoiding the "flatness" of standard minimalism.

*   **The Palette:** A monochromatic core of `surface` (#f9f9f9) and `on-surface` (#2d3435), punctuated by the `secondary` muted sage (#665e4c). Use the accent sparingly—only for moments of high-intent interaction or critical navigation markers.
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Boundaries between content areas must be defined by shifts in background tone. Use `surface-container-low` (#f2f4f4) for secondary content areas sitting on a `surface` (#f9f9f9) background.
*   **Surface Hierarchy & Nesting:** Treat the UI as layers of fine paper. 
    *   **Base:** `surface`
    *   **In-Page Sections:** `surface-container-low`
    *   **Interactive Cards:** `surface-container-lowest` (#ffffff) to create a subtle "pop" against the off-white background.
*   **The Glass & Gradient Rule:** For navigation bars or floating image captions, use **Glassmorphism**. Apply `surface-container-lowest` at 70% opacity with a `20px` backdrop blur. This allows the colors of the photography to bleed through the UI, making the system feel integrated with the art.
*   **Signature Textures:** For primary CTAs, do not use a flat hex. Apply a subtle linear gradient from `primary` (#5f5e5e) to `primary-dim` (#535252) to give buttons a weighted, tactile quality.

---

### 3. Typography: The Editorial Contrast
We use a high-contrast pairing to establish an authoritative hierarchy.

*   **Display & Headlines (`notoSerif`):** This is our "voice." The serif should be used with generous tracking (letter-spacing: -0.02em) for a custom, bespoke feel. `display-lg` (3.5rem) should be used for hero statements, often placed asymmetrically to create visual interest.
*   **Body & Labels (`manrope`):** This is our "utility." Manrope provides a clean, neutral balance to the serif. 
    *   **Body-lg:** Used for artist statements or descriptions.
    *   **Label-md:** Used for metadata (e.g., "ISO 400", "Oil on Canvas"). Always set these in `on-surface-variant` (#5a6061) to keep them secondary to the imagery.

---

### 4. Elevation & Depth
Traditional drop shadows are too "digital" for this system. We use **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-high` background creates a natural, soft lift.
*   **Ambient Shadows:** If a floating element (like a modal or dropdown) requires a shadow, use an ultra-diffused style: `0px 24px 48px rgba(45, 52, 53, 0.06)`. The shadow color is derived from `on-surface`, not pure black.
*   **The "Ghost Border" Fallback:** If a container needs definition against a similar background, use a Ghost Border: `1px solid` using the `outline-variant` token at **15% opacity**.
*   **Zero-Radius Mandate:** As per the `0px` roundedness scale, every element must have sharp, architectural corners. This conveys precision and classic sophistication.

---

### 5. Components

*   **Buttons:**
    *   **Primary:** Sharp corners, `primary` gradient background, `on-primary` text. Use `spacing.6` (2rem) for horizontal padding.
    *   **Tertiary (The "Gallery Link"):** No background or border. `notoSerif` text with a 1px underline using the `secondary` (sage) color, offset by 4px.
*   **Cards & Lists:** 
    *   **The Rule:** No dividers. Separate list items using `spacing.8` (2.75rem) or by alternating background tones between `surface` and `surface-container-low`.
    *   **Image Cards:** Images should be flush with the container edges. Captions should use `label-sm` in all-caps with 0.1rem letter spacing for an archival look.
*   **Input Fields:**
    *   Minimalist "Underline" style. Only a bottom border using `outline` (#757c7d). Upon focus, the border transitions to `secondary` (sage).
*   **The "Curator's Chip":** Used for categories (e.g., "Abstract", "Portraiture"). Rectangular, `outline` border at 20% opacity, `body-sm` text.
*   **Imagery (Custom Component):** All images should feature a `24px` internal padding (inset) when housed in a container, creating a "matting" effect similar to framed physical art.

---

### 6. Do's and Don'ts

**Do:**
*   Use `spacing.20` (7rem) or `spacing.24` (8.5rem) between major sections to let the design breathe.
*   Align text to a baseline grid, but allow images to "break" the grid slightly for a curated, non-templated feel.
*   Use the `secondary` color (sage) only for success states, active nav links, or a single featured "Buy" button.

**Don't:**
*   **Never** use rounded corners. It breaks the architectural integrity of the system.
*   **Never** use 100% black (#000000) for text. Use `on-surface` (#2d3435) to maintain a soft, premium legibility.
*   **Never** use standard dividers or horizontal rules. Use whitespace as your primary separator.
*   **Avoid** center-aligning large blocks of body text. Keep it left-aligned for an editorial, high-end look.