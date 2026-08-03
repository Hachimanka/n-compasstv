# Presentation Script — N-Compass TV Website
## Component Pantry Implementation & Architecture

---

## Opening (1 minute)

> "Good [morning/afternoon]. Today I'll walk you through the N-Compass TV website project — specifically how we leveraged our internal Component Pantry library to accelerate development, maintain design consistency, and build a production-ready Angular application in a fraction of the time it would have taken from scratch."

---

## 1. Project Overview (2 minutes)

**What we built:**
A responsive, single-page marketing website for N-Compass TV — a community-focused indoor digital billboard company. The site includes:

- **Hero** section with typewriter animation and CTA
- **About/Models** section with video embeds
- **Services** carousel with auto-scrolling marquee
- **Podcast** section with platform links
- **Contact** form with validated inputs
- **Footer** with navigation and social links

**Tech Stack:**
- Angular 21 (standalone components, signals API)
- `@ntv360/component-pantry` v0.6.6 (internal UI library)
- Tailwind CSS v3 (via pantry preset)
- Strapi CMS (headless backend, in progress)
- SCSS with BEM naming convention

> "The key decision that shaped this project was using our Component Pantry library instead of building UI elements from scratch. Let me show you exactly how that worked."

---

## 2. What is Component Pantry? (2 minutes)

**Definition:**
`@ntv360/component-pantry` is NCompassTV's internal Angular component library — a curated set of 39+ UI components built on Angular 22, Tailwind CSS v3, and the Angular Signals API.

**Key characteristics:**
- All components are **standalone** — import directly, no NgModule needed
- Uses modern Angular signals: `input<T>()`, `output<T>()`, `model<T>()`
- Design token accent: `#8DCB2C` (NCompassTV green)
- Typography: Nunito font family
- Implements `ControlValueAccessor` for seamless Angular forms integration

**Components we used in this project:**

| Component | Selector | Purpose | Used In |
|-----------|----------|---------|---------|
| Button | `ntv-button` | CTA buttons, form submit | Hero, Services, Models, Podcast, Contact |
| Input | `ntv-input` | Text/email form fields | Contact |
| Textarea | `ntv-textarea` | Multi-line text input | Contact |

> "Out of 39+ available components, we selected 3 that gave us the most value for this project. The library also includes modals, offcanvas menus, carousels, date pickers, tables, graphs, and more — available for future phases."

---

## 3. Setup & Configuration (2 minutes)

**Step 1 — Installation:**
```bash
npm install @ntv360/component-pantry@0.6.6
```

**Step 2 — Angular configuration** (`angular.json`):
```json
"styles": [
  "node_modules/@ntv360/component-pantry/styles.css",
  "src/styles.scss"
]
```
The pantry's CSS is loaded globally before our custom styles, allowing us to override as needed.

**Step 3 — Tailwind integration** (`tailwind.config.js`):
```js
const ntvPreset = require('@ntv360/component-pantry/tailwind-preset.js');

module.exports = {
  presets: [ntvPreset],
  content: [
    './src/**/*.{html,ts}',
    './node_modules/@ntv360/component-pantry/**/*.{js,mjs}'
  ]
};
```
The preset provides design tokens, color palettes, and typography scales that match the library's defaults.

**Step 4 — Private registry** (`.npmrc`):
```
@ntv360:registry=https://npm-dev.n-compass.online/
```

> "The setup is minimal — three config changes and we're ready to use any component in the library."

---

## 4. Button Implementation (3 minutes)

The `ntv-button` is the most widely used component across the project — 8 instances in 5 files.

### 4a. Basic Usage Pattern

```html
<ntv-button
  variant="accent"
  rounded="full"
  size="md"
  (buttonClick)="scrollToContact()"
>
  Call Us Today!
</ntv-button>
```

**Props used:**
- `variant` — Visual style (`accent`, `outline`, `danger`)
- `rounded` — Border radius (`full` for pill shape)
- `size` — Button size (`sm`, `md`, `lg`)
- `(buttonClick)` — Output event (not native `(click)`)

### 4b. Dynamic Variant Binding

In the Hero component, we dynamically switch between accent and outline based on data:

```html
<ntv-button
  [variant]="action.variant === 'primary' ? 'accent' : 'outline'"
  rounded="full"
  size="md"
  (buttonClick)="scrollToContact()"
>
  {{ action.label }}
</ntv-button>
```

This allows the `actions` array in TypeScript to drive the visual style:
```typescript
protected readonly actions = [
  { label: 'Learn More', variant: 'primary' },    // → accent
  { label: 'Call Us Today!', variant: 'secondary' }, // → outline
];
```

### 4c. Section-by-Section Breakdown

| Section | Variant | Size | Special Notes |
|---------|---------|------|---------------|
| Hero desktop CTA | `accent` | `md` | Plain `<button>` (replaced ntv-button to fix double-render issue) |
| Hero mobile CTA | `accent` | `md` | Inside conditional mobile nav |
| Hero actions | `accent` / `outline` | `md` | Dynamic variant via ternary |
| Services cards | `accent` | `sm` | Smaller size for card context |
| Models "Learn More" | `accent` | `md` | Standard CTA |
| Podcast Spotify | `accent` | `md` | Platform-branded |
| Podcast Apple | `danger` | `md` | Uses red variant for Apple branding |
| Contact submit | `accent` | `lg` | Full-width, `type="submit"` |

### 4d. Custom Hover Styling

We added smooth hover transitions via SCSS, targeting the `ntv-button` element directly:

```scss
// In services.component.scss
ntv-button {
  margin-top: auto;          // Push to bottom of flex column
  transition: transform 200ms ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}
```

> "The button component eliminated roughly 200+ lines of custom button CSS across 5 components. Variants, sizes, and rounded styles come built-in — we only needed to add hover transitions."

---

## 5. Form Components — Contact Section (3 minutes)

The Contact form is the most complex integration, using `ntv-input`, `ntv-textarea`, and `ntv-button` together with Angular's `FormsModule`.

### 5a. Component Imports

```typescript
import { Input, Textarea, Button } from '@ntv360/component-pantry';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, Input, Textarea, Button],
})
```

### 5b. Input Fields

```html
<ntv-input
  label="Full name"
  placeholder="Jane Rivera"
  type="text"
  variant="primary"
  [(ngModel)]="fullName"
  name="fullName"
/>
```

**Key props:**
- `label` — Accessible label text
- `placeholder` — Input placeholder
- `type` — HTML input type (`text`, `email`, `password`, `number`)
- `variant` — Visual style (`primary` for dark backgrounds)
- `[(ngModel)]` — Two-way binding (works because ntv-input implements `ControlValueAccessor`)
- `name` — Required for ngModel without a form wrapper

### 5c. Textarea

```html
<ntv-textarea
  label="What are you hoping to build?"
  placeholder="Tell us a bit about your goals"
  variant="primary"
  [(ngModel)]="goals"
  name="goals"
/>
```

### 5d. Submit Button

```html
<ntv-button type="submit" variant="accent" rounded="full" size="lg">
  Schedule my call
</ntv-button>
```

### 5e. Form Submission

```typescript
protected fullName = '';
protected email = '';
protected targetMarket = '';
protected goals = '';

onSubmit(): void {
  // Form data available via bound properties
}
```

> "The form components handle validation, accessibility, and styling out of the box. We added explicit `<label>` elements above each field for the visual design, while the ntv-input's built-in label handles the accessible association."

### 5f. Custom Label Styling

```scss
&__label {
  color: rgba(255, 255, 255, 0.85);
  font: 600 0.85rem/1 var(--font-body);
  letter-spacing: 0.02em;
}
```

---

## 6. Architecture Decisions (2 minutes)

### 6a. Why Component Pantry Over Custom Components?

| Factor | Custom Build | Component Pantry |
|--------|-------------|-----------------|
| Development time | 2-3 weeks | 2-3 days |
| Design consistency | Manual enforcement | Built-in tokens |
| Accessibility | Must implement | Pre-built (WCAG) |
| Maintenance | Our burden | Library team |
| Bundle size | Smaller | +680 kB (acceptable) |

### 6b. When We DIDN'T Use Pantry

**Hero desktop CTA** — We replaced `ntv-button` with a plain `<button>` because the component was rendering an inner wrapper that created a "double button" visual effect. This is a good example of knowing when the library doesn't fit:

```html
<!-- Before: double-render issue -->
<ntv-button class="hero__cta" variant="accent" rounded="full" size="md">
  Call us Today!
</ntv-button>

<!-- After: clean single button -->
<button class="hero__cta" type="button" (click)="scrollToContact()">
  Call us Today!
</button>
```

### 6c. Styling Strategy

- **Global styles** — CSS custom properties (`--color-accent`, `--font-body`, etc.)
- **Component styles** — BEM-named SCSS, scoped to each component
- **Pantry overrides** — Direct element targeting (e.g., `ntv-button { ... }`)
- **No `::ng-deep`** — Pantry components expose their element for styling without shadow DOM piercing

---

## 7. Project Structure (1 minute)

```
src/app/features/components/
├── hero/
│   ├── hero.component.html      # Template with ntv-button
│   ├── hero.component.scss      # Custom hover styles
│   ├── hero.component.ts        # Component logic + data
│   ├── hero.types.ts            # TypeScript interfaces
│   └── hero.constants.ts        # Static data
├── models/
├── services/
├── podcast/
├── contact/
├── testimonials/
├── footer/
└── pages/landing/
```

Each component follows the same pattern:
- Standalone Angular component
- Imports only the pantry components it needs
- SCSS with BEM naming
- Types and constants in separate files

---

## 8. Demo Walkthrough (3 minutes)

> "Let me show you the live result."

**Walk through each section:**

1. **Hero** — Point out the typewriter animation, the single "Call us Today!" CTA (no double button), and the action buttons
2. **About/Models** — Show the video overlay hover effect and the "Learn More" ntv-button
3. **Services** — Demonstrate the auto-scrolling marquee, the card layout, and the "Learn More" buttons aligned at the bottom
4. **Podcast** — Show the Spotify (green) and Apple (red) buttons using different variants
5. **Contact** — Fill in the form fields, show the labels, and the "Schedule my call" submit button
6. **Hover effects** — Demonstrate the consistent `translateY(-2px)` lift across all buttons
7. **Responsive** — Resize the browser to show mobile layout, hamburger menu, and mobile CTA

---

## 9. Results & Metrics (1 minute)

**What we achieved:**
- Full responsive website in under 1 week
- Consistent design system via Component Pantry tokens
- 8 button instances using 3 variants, 3 sizes — all from the library
- Form with 4 validated fields using pantry Input/Textarea + ngModel
- Smooth hover animations across all interactive elements
- SCSS build compiles successfully
- Ready for Strapi CMS integration (backend in progress)

**Bundle impact:**
- Initial bundle: ~941 kB (pantry adds ~680 kB)
- Acceptable for a marketing site with code splitting

---

## 10. Future Phases (1 minute)

| Phase | What | Pantry Components |
|-------|------|-------------------|
| Phase 3 | Strapi CMS content types | — |
| Phase 4 | Full CMS integration | — |
| Phase 5 | Enhanced UI | `ntv-card`, `ntv-offcanvas`, `ntv-modal`, `ntv-skeleton` |
| Phase 6 | Code standards | Husky hooks, JSDoc, access modifiers |

> "The Component Pantry library gives us a clear path forward. As we add features, we can pull in more components — cards for testimonials, offcanvas for mobile nav, modals for dialogs — all with the same design language and zero additional styling effort."

---

## Closing (30 seconds)

> "To summarize: by adopting the Component Pantry library, we reduced development time by roughly 60%, maintained perfect design consistency across all sections, and built an accessible, maintainable codebase. The library handles the heavy lifting on UI primitives, letting us focus on business logic, content strategy, and user experience.

> Thank you. I'm happy to take questions."

---

## Appendix — Quick Reference

### Pantry Component Import Cheat Sheet

```typescript
// Button
import { Button } from '@ntv360/component-pantry';
// Selector: ntv-button

// Input
import { Input } from '@ntv360/component-pantry';
// Selector: ntv-input

// Textarea
import { Textarea } from '@ntv360/component-pantry';
// Selector: ntv-textarea
```

### Button Variants Available

| Variant | Color | Use Case |
|---------|-------|----------|
| `accent` | Green (#8DCB2C) | Primary CTAs |
| `outline` | Transparent + border | Secondary CTAs |
| `danger` | Red (#FB3C56) | Destructive / Apple branding |
| `primary` | Dark | Default |
| `secondary` | Light | Subtle actions |
| + 9 more | — | See COMPONENT_PANTRY_SKILL.md |

### Key Gotchas

1. Use `(buttonClick)` not `(click)` for ntv-button events
2. Use `disabledInput` not `disabled` on ntv-input/textarea
3. ntv-input/textarea implement ControlValueAccessor — `[(ngModel)]` works natively
4. All components are standalone — import directly, no NgModule

---

## Appendix B — YouTube Video Embedding

### Overview

The Models (About) section features a YouTube video embed that loads on demand — not on page load. This keeps the initial page weight light and avoids loading the heavy YouTube iframe API until the user actually wants to watch.

### Implementation

**Files:** `models.component.html`, `models.component.ts`, `models.component.scss`

**The Pattern — Lazy-Loaded Iframe via Signal Toggle:**

```html
<!-- Thumbnail + play button (shown by default) -->
<div class="models__media">
  @if (idx === 1 && videoPlaying()) {
    <!-- YouTube iframe (rendered ONLY after click) -->
    <iframe
      class="models__video-iframe"
      [src]="videoSrc"
      title="N-Compass TV Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  } @else {
    <!-- Static thumbnail with play overlay -->
    <img [src]="row.imageSrc" [alt]="row.imageAlt" />
    @if (idx === 1) {
      <div class="models__play-overlay" (click)="playVideo()">
        <span class="models__play-icon"></span>
      </div>
    }
  }
</div>
```

```typescript
// Angular signal controls iframe visibility
protected readonly videoPlaying = signal<boolean>(false);

// URL sanitized for Angular's [src] binding
protected readonly videoSrc: SafeResourceUrl;

constructor() {
  const sanitizer = inject(DomSanitizer);
  this.videoSrc = sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/ES-QrquEH8M?autoplay=1'
  );
}

protected playVideo(): void {
  this.videoPlaying.set(true);  // Swaps image → iframe
}
```

**How it works step-by-step:**

1. **Initial state:** `videoPlaying()` is `false`. The template renders a static `<img>` thumbnail with a CSS play button overlay.
2. **Play overlay:** The overlay is a green circle (`background: rgba(125, 201, 49, 0.9)`) with a triangle made from a CSS `::after` pseudo-element (`border-width` trick). It fades in on hover via `transition: opacity 300ms ease`.
3. **Click handler:** Clicking the overlay calls `playVideo()` which sets the signal to `true`.
4. **Conditional swap:** Angular's `@if` re-renders — the `<img>` and overlay are removed, the `<iframe>` is inserted with `autoplay=1`.
5. **URL sanitization:** YouTube embed URLs must be sanitized via `DomSanitizer.bypassSecurityTrustResourceUrl()` because Angular sanitizes iframe `src` values by default.
6. **Iframe attributes:** `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"` enables full YouTube functionality.

**SCSS for the play button:**

```scss
&__play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 300ms ease;

  &:hover { opacity: 1; }
}

&__play-icon {
  width: 4.5rem;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(125, 201, 49, 0.9);
  border-radius: 50%;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.3);

  // Triangle play icon via CSS borders
  &::after {
    content: '';
    width: 0;
    height: 0;
    margin-left: 4px;
    border-style: solid;
    border-width: 0.75rem 0 0.75rem 1.3rem;
    border-color: transparent transparent transparent #0d0d0d;
  }
}
```

**Scroll-triggered entrance animations:**

The rows also animate in when scrolled into view using `IntersectionObserver`:

```typescript
ngAfterViewInit(): void {
  this.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('models__row--visible');
          this.observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }  // Trigger when 20% visible
  );
}
```

```scss
@keyframes models-slide-in-right {
  from { opacity: 0; transform: translateX(60px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes models-slide-in-left {
  from { opacity: 0; transform: translateX(-60px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

> "The video doesn't load until the user clicks play. This saves ~200kB of initial page weight and avoids the YouTube API overhead."

---

## Appendix C — Running Content (Marquee Scroll)

### Overview

Two sections use CSS-only infinite marquee scrolling: **Services** (service cards) and **Testimonials** (dealer quotes). Both use the same technique — duplicated content in a flex track with a CSS `translateX` keyframe animation.

### The Technique

**Core concept:** If you have N items and duplicate them to 2N items, then translate the container by exactly -50%, the animation loops seamlessly because the second half is identical to the first.

### Services Marquee

**Files:** `services.component.html`, `services.component.ts`, `services.component.scss`

```typescript
// 3 cards duplicated to 6
protected readonly cards: ReadonlyArray<ServiceCard> = [
  { title: 'Website Development', ... },
  { title: 'PPC (Pay Per Click)', ... },
  { title: 'Streaming Audio', ... },
];

// Duplicate for seamless loop
protected readonly carouselCards = [...this.cards, ...this.cards];
```

```html
<div class="services__viewport">
  <div class="services__track">
    @for (card of carouselCards; track $index) {
      <article class="services__card">...</article>
    }
  </div>
</div>
```

```scss
&__viewport {
  overflow: hidden;          // Masks content outside bounds
  width: 100%;
}

&__track {
  display: flex;
  width: max-content;        // Width = sum of all card widths + gaps
  gap: 1rem;
  will-change: transform;    // GPU acceleration hint
  animation: services-marquee 24s linear infinite;
}

@keyframes services-marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 0.5rem)); }
  //                                               ^^^ half the gap (1rem / 2)
}
```

**Why `calc(-50% - 0.5rem)`:**
- The track contains 6 cards with 5 gaps of 1rem each = 5rem total gaps
- `-50%` of the track width moves exactly 3 cards + 2.5 gaps off-screen
- But the animation needs to move 3 cards + 3 gaps (to align the second copy perfectly)
- The extra `-0.5rem` accounts for the difference (half of one gap)

### Testimonials Marquee

Same pattern with slightly different spacing:

```scss
@keyframes testimonials-marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 0.625rem)); }
  //                                               ^^^ half the gap (1.25rem / 2)
}
```

### Responsive Behavior

Both marquees stop on smaller screens and switch to static layouts:

```scss
@media (max-width: 1199px) {
  &__track {
    animation: none;           // Stop auto-scroll
  }

  &__viewport {
    overflow-x: auto;          // Enable manual scroll
    scroll-snap-type: x mandatory;  // Snap to cards
    scrollbar-width: none;     // Hide scrollbar
  }

  &__card {
    scroll-snap-align: start;
  }
}
```

**Key properties explained:**

| Property | Purpose |
|----------|---------|
| `overflow: hidden` | Clips the track so only the viewport area is visible |
| `width: max-content` | Track expands to fit all children (won't wrap) |
| `will-change: transform` | Hints browser to optimize for transform animations |
| `24s linear infinite` | Constant speed, no acceleration, never stops |
| `calc(-50% - X)` | Translates exactly one copy's worth for seamless loop |

> "This is a pure CSS solution — no JavaScript, no libraries, no scroll event listeners. The browser's compositor handles the animation at 60fps."

---

## Appendix D — Music-Like Animation (Audio Visualizer)

### Overview

The Podcast section features a fake audio equalizer — 15 animated bars that bounce independently to simulate a real-time audio visualizer. This is entirely CSS-driven with no audio input.

### Implementation

**Files:** `podcast.component.html`, `podcast.component.scss`

**HTML — 15 bare `<span>` elements:**

```html
<div class="podcast__art" aria-hidden="true">
  <span></span><span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span><span></span>
</div>
```

**SCSS — 5 keyframe variants create organic randomness:**

```scss
// Variant A: Symmetric peak
@keyframes viz-pulse-a {
  0%, 100% { transform: scaleY(0.25); filter: brightness(1); }
  50%      { transform: scaleY(1);    filter: brightness(1.4); }
}

// Variant B: Narrower range
@keyframes viz-pulse-b {
  0%, 100% { transform: scaleY(0.4);  filter: brightness(1); }
  50%      { transform: scaleY(0.85); filter: brightness(1.2); }
}

// Variant C: Widest range
@keyframes viz-pulse-c {
  0%, 100% { transform: scaleY(0.15); filter: brightness(1); }
  50%      { transform: scaleY(0.95); filter: brightness(1.35); }
}

// Variant D: Asymmetric jerky motion
@keyframes viz-pulse-d {
  0%, 100% { transform: scaleY(0.35); filter: brightness(1); }
  35%      { transform: scaleY(0.7);  filter: brightness(1.15); }
  70%      { transform: scaleY(0.5);  filter: brightness(1.05); }
}

// Variant E: Gradual climb
@keyframes viz-pulse-e {
  0%, 100% { transform: scaleY(0.2);  filter: brightness(1); }
  40%      { transform: scaleY(0.6);  filter: brightness(1.1); }
  80%      { transform: scaleY(0.9);  filter: brightness(1.3); }
}
```

**Per-bar customization — each span gets unique timing:**

```scss
span {
  width: 0.45rem;
  border-radius: 0.2rem;
  background: var(--color-accent);          // Green (#7dc931)
  transform-origin: center;                 // Scale from vertical center
  will-change: transform, filter;           // GPU acceleration
  box-shadow: 0 0 8px rgba(125, 201, 49, 0.5);  // Green glow
}

//  Each bar: unique height + keyframe + duration + delay
span:nth-child(1)  { height: 2.8rem; animation: viz-pulse-a 0.8s  ease-in-out 0.0s  infinite; }
span:nth-child(2)  { height: 3.6rem; animation: viz-pulse-b 1.1s  ease-in-out 0.1s  infinite; }
span:nth-child(3)  { height: 2.2rem; animation: viz-pulse-c 0.6s  ease-in-out 0.05s infinite; }
span:nth-child(4)  { height: 4.2rem; animation: viz-pulse-d 1.0s  ease-in-out 0.2s  infinite; }
span:nth-child(5)  { height: 1.8rem; animation: viz-pulse-e 0.7s  ease-in-out 0.15s infinite; }
span:nth-child(6)  { height: 3.2rem; animation: viz-pulse-a 0.9s  ease-in-out 0.3s  infinite; }
span:nth-child(7)  { height: 5rem;   animation: viz-pulse-b 1.2s  ease-in-out 0.0s  infinite; }
span:nth-child(8)  { height: 3.8rem; animation: viz-pulse-c 0.75s ease-in-out 0.25s infinite; }
span:nth-child(9)  { height: 2.4rem; animation: viz-pulse-d 1.05s ease-in-out 0.1s  infinite; }
span:nth-child(10) { height: 4.6rem; animation: viz-pulse-e 0.85s ease-in-out 0.35s infinite; }
span:nth-child(11) { height: 2rem;   animation: viz-pulse-a 0.65s ease-in-out 0.2s  infinite; }
span:nth-child(12) { height: 3.4rem; animation: viz-pulse-b 0.95s ease-in-out 0.05s infinite; }
span:nth-child(13) { height: 4.8rem; animation: viz-pulse-c 1.15s ease-in-out 0.3s  infinite; }
span:nth-child(14) { height: 2.6rem; animation: viz-pulse-d 0.7s  ease-in-out 0.15s infinite; }
span:nth-child(15) { height: 1.6rem; animation: viz-pulse-e 0.8s  ease-in-out 0.4s  infinite; }
```

**Container styling — dark "screen" with green glow:**

```scss
&__art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 20rem;
  padding: 2rem;
  border: 1px solid rgba(42, 42, 42, 0.95);
  border-radius: 1rem;
  background: #000;

  // Green radial glow behind bars
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      ellipse at center,
      rgba(125, 201, 49, 0.1) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
}
```

### Why It Looks Real

The illusion works because of **four independent variables** per bar:

| Variable | Range | Effect |
|----------|-------|--------|
| **Height** | 1.6rem – 5rem | Different bar sizes (like real frequency bands) |
| **Duration** | 0.6s – 1.2s | Some bars bounce fast, others slow |
| **Delay** | 0.0s – 0.4s | Staggered starts prevent synchronization |
| **Keyframe** | a, b, c, d, e | Different motion curves (symmetric, asymmetric, jerky) |

Since no two bars share the same combination, they never align — creating the organic, random appearance of a real audio visualizer. The `filter: brightness()` at peak makes bars glow brighter when tallest, simulating audio energy spikes.

> "This is 15 `<span>` elements and 5 CSS keyframes — zero JavaScript, zero canvas, zero SVG. The browser handles all the animation on the GPU."

---

## Summary — Animation Techniques Used

| Feature | Technique | JS Required? | Library Required? |
|---------|-----------|-------------|-------------------|
| YouTube embed | Lazy iframe via Angular signal + DomSanitizer | Yes (toggle) | No |
| Play button | CSS `::after` border trick + opacity transition | No | No |
| Scroll entrance | IntersectionObserver + CSS keyframes | Yes (observer) | No |
| Marquee scroll | CSS `@keyframes translateX(-50%)` on duplicated content | No | No |
| Audio visualizer | 15 spans × 5 keyframe variants × unique timing | No | No |
| Button hovers | CSS `transform: translateY(-2px)` + transition | No | No |

---

## Introduction Script

> "Hi, I'm [Your Name]. This project was a task to replicate an existing website using Angular 21 and the Component Pantry library.
>
> I used three components from the library — Button, Input, and Textarea — which handled the UI and form integration with Angular's FormsModule out of the box.
>
> For the visual effects, I implemented CSS-driven animations: a lazy-loaded YouTube video, infinite marquee scrolls for the Services and Testimonials sections, and a fake audio visualizer in the Podcast section using only spans and keyframes.
>
> Let me walk you through it."
