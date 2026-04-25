# Design System Specification: The Clinical Command Center

## 1. Overview & Creative North Star
**Creative North Star: The Clinical Command Center**

This design system is not a template. It is a precision instrument for a product that operates at the intersection of healthcare and artificial intelligence. We move away from the generic SaaS look by embracing **Structured Authority** and **Tonal Depth**. The goal is to feel like the software a serious medical professional would trust — where every element communicates clarity, competence, and control.

We reject the bloated, color-heavy layouts of typical health tech. Instead, we use deep navy surfaces, disciplined whitespace, and a "layered document" approach to create a digital environment that feels precise, trustworthy, and built for professionals who have no time to waste.

---

## 2. Color Palette & Tonal Theory
Our palette is built on deep navy authority with a clinical light blue accent — communicating trust, intelligence, and medical credibility.

### Core Tones
- **Primary Accent (Clinical Blue):** `#2E86C1` (mapped to `primary_container`). Use for CTAs, highlights, and the "MD" in the AppealMD wordmark. This is the action color.
- **Deep Navy (Brand Primary):** `#1E3A5F`. The dominant surface color. Used for hero backgrounds, navbar, and primary sections.
- **Base Surfaces:**
    - **Dark Surface:** `#0F2132`. Deepest background, used beneath the navy to create layered depth.
    - **Elevated Surface:** `#1E3A5F` with 85% opacity for cards and containers.
    - **Light Contrast:** `#F0F6FF`. Used sparingly for text-heavy sections that need a brightness shift.
- **Text:**
    - **Primary Text:** `#FFFFFF` on dark surfaces.
    - **Secondary Text:** `#A8C4DC` — a desaturated light blue for body copy and subtitles on dark backgrounds.
    - **Dark Surface Text:** `#1A1A2E` for any light-background sections.

### The Rules of Engagement
- **The "No-Line" Rule:** Prohibit 1px solid borders for sectioning. Boundaries must be defined through background shifts — from `#0F2132` to `#1E3A5F` — creating tonal depth without visual clutter.
- **Surface Hierarchy & Nesting:** Treat the UI as physical layers. Cards sit slightly elevated above their parent section using a higher opacity or lighter navy tone. This creates a natural lift without drop shadows.
- **The "Glass & Gradient" Rule:** The Navbar must utilize Glassmorphism. Apply a 24px backdrop-blur over the deep navy with a 10% white border to simulate clinical frosted glass.
- **Signature Gradient:** For primary CTAs, apply a subtle linear gradient from `#1E3A5F` to `#2E86C1` — left to right — to create a sense of forward motion and action.

---

## 3. Typography: The Voice of Precision
Typography is our primary tool for communicating authority. We use a high-contrast scale to create professional rhythm.

- **Display & Headlines (Manrope):** Chosen for its geometric, engineered precision. Feels technical without feeling cold.
    - **Display-LG (3.5rem):** Use for hero headlines. Letter-spacing tight at `-0.02em` to feel cohesive and authoritative.
    - **Display-MD (2.25rem):** Section headers.
- **Titles & Body (Work Sans):** Clean, humanist readability for professionals who read quickly.
    - **Body-LG (1rem):** Descriptive copy. Maintain generous line-height (1.6) so the layout breathes.
- **Labels (Inter):** Reserved for technical micro-copy, badges, and form labels. Neutral and precise.

---

## 4. Elevation & Depth: Tonal Layering
We achieve hierarchy through Tonal Layering — no traditional shadows, no harsh borders.

- **The Layering Principle:** Stack navy tones. `#0F2132` base → `#1E3A5F` section → `#1E3A5F` at 90% opacity card. Each layer feels physically above the last.
- **Ambient Shadows:** Only for floating elements (modals, dropdowns).
    - **Specs:** Blur: 40px, Spread: -10px, Color: `#000000` at 25% opacity.
- **The "Ghost Border" Fallback:** When a container needs separation on a complex background, use: `border: 1px solid rgba(255,255,255,0.08)`. Never use 100% opaque borders.
- **Accent Glow:** For the primary CTA button only, apply a subtle box-shadow glow: `0 0 24px rgba(46, 134, 193, 0.35)`. This draws the eye without feeling garish.

---

## 5. Interaction & Motion: The Precision Signature
Motion should feel controlled and deliberate — like a well-engineered medical instrument, not a consumer app.

1. **Hero Letter-Drop (h1-drop):** On page load, H1 characters drop from `Y:-30px` to `0`.
    - **Stagger:** 0.03s per letter.
    - **Easing:** `backOut` — a subtle mechanical settling effect.

2. **Plus-Sign Repel (Atmospheric Interaction — Brand Signature):**
    - Background is populated with subtle `+` plus signs in `rgba(46, 134, 193, 0.12)` — referencing both the medical cross and the AppealMD brand mark.
    - **Hover:** Plus signs move 25px away from the cursor, as if repelled by a field.
    - **Click:** A 150px radius "pop" effect where plus signs momentarily dissolve and re-emerge.
    - **Multi-Click:** Successive clicks expand this radius up to 500px, rewarding curiosity.
    - **Size Variation:** Mix `+` signs at 12px, 18px, and 24px across the field for organic depth.

3. **Luminous Reveal:**
    - Hovering on product screenshots or UI mockups scales them to `1.03x`.
    - Simultaneously, transition a 15% dark overlay to 0%, subtly "lighting up" the product image.

4. **Vertical-Wipe:** All non-hero images and feature cards reveal via a bottom-to-top `clip-path` transition on scroll into view.
    - **Duration:** 0.6s, easing: `cubicBezier(0.16, 1, 0.3, 1)`.

5. **Marquee — Social Proof Strip:** A trust bar scrolls infinitely left at `35px/s` showing payer names (Delta Dental, Cigna, MetLife, Aetna...) with small `+` dividers between them. Pauses on hover.

---

## 6. Component Guidelines

### Buttons (The "Action" Elements)
- **Primary CTA:** Gradient fill left-to-right `#1E3A5F → #2E86C1`, `full` roundedness (9999px), trailing arrow icon `→`. Accent glow on hover.
- **Secondary:** Transparent background, `Ghost Border` at 15% white opacity, Clinical Blue text.
- **Interaction:** On hover, buttons shift +2px upward with a subtle ambient shadow increase.

### Cards & Feature Blocks
- **No Dividers:** Prohibit horizontal lines between items. Use vertical whitespace (spacing 8 or 10) to separate content.
- **Card Background:** `#1E3A5F` at 80% opacity with Ghost Border. Never a solid opaque box.
- **Icon Treatment:** Feature icons use the `+` cross motif or shield icon in `#2E86C1` on a dark navy pill background.

### Navigation (The Glass Bar)
- **Style:** Fixed position. `#1E3A5F` at 70% opacity.
- **Blur:** `24px` backdrop-filter.
- **Border:** `1px solid rgba(255,255,255,0.10)` — subtle frosted separation.
- **Logo:** AppealMD wordmark left-aligned. CTA button right-aligned.

### Form Elements (Waitlist & Input)
- **Input Fields:** Dark surface `#0F2132`, Ghost Border, white placeholder text at 40% opacity.
- **Focus State:** Border transitions to `#2E86C1` with a soft glow — `0 0 0 3px rgba(46,134,193,0.25)`.
- **Checkbox (Dental Office):** Custom styled. Checked state shows a `+` icon in Clinical Blue inside a navy rounded square.

---

## 7. Page-Specific Application

### Hero Section
- Full viewport height. Deep navy `#0F2132` background with plus-sign field.
- H1 uses letter-drop animation. Maximum 8 words.
- Subtitle in `#A8C4DC` secondary text. Maximum 15 words.
- Single primary CTA button centered below.
- AppealMD logo mark subtly watermarked at 5% opacity behind the hero text.

### Feature / How It Works Section
- Background shifts to `#1E3A5F` — the tonal boundary signals a new section without a line.
- 3-step process: numbered with Clinical Blue `+` accented numbers.
- Product screenshot floats right with Luminous Reveal on scroll.

### Social Proof / Trust Bar
- Marquee strip of payer names — Delta Dental, Cigna, MetLife, Aetna, Guardian, Humana — with `+` dividers.
- Signals breadth of payer coverage without needing to explain it.

### Waitlist CTA Section
- Background returns to `#0F2132` — the deep anchor color closes the page.
- Email input + dental office checkbox + primary CTA.
- Single line of micro-copy below: "No spam. We contact you when we're ready for your clinic."

---

## 8. Do's and Don'ts

### Do:
- **Use the plus sign `+` as a recurring motif.** It is our brand texture — medical cross meets mathematical addition (adding revenue back).
- **Use deep navy as the default surface.** Light mode is not our identity.
- **Layer tonal surfaces.** `#0F2132` → `#1E3A5F` → card elevation creates depth without shadows.
- **Keep copy short and clinical.** No marketing fluff. Dental office managers are busy and skeptical.
- **Let whitespace work.** Every element needs room to breathe.

### Don't:
- **Don't use 1px solid grey or black borders.** Ghost borders only.
- **Don't use standard easing.** Always `backOut` or `cubicBezier(0.16, 1, 0.3, 1)` for a precise, controlled feel.
- **Don't use red anywhere.** In a denial/rejection context, red triggers anxiety. We are the solution, not the problem.
- **Don't crowd the product screenshot.** It is the hero artifact. Give it isolation and a subtle glow.
- **Don't use drop shadows on standard cards.** Only for modals and floating UI.
- **Don't use stock medical imagery.** No stethoscopes, no clipboards, no stock doctors. Product UI only.
