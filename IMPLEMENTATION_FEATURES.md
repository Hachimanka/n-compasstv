# Implementation Guide: YouTube Video, Running Animation & Music

> **Project:** n-compasstv · **Framework:** Angular 22 · **Component Library:** @ntv360/component-pantry

---

## Table of Contents

1. [YouTube Video Embed](#1-youtube-video-embed)
2. [Running Animations](#2-running-animations)
3. [Music / Audio Visualizer](#3-music--audio-visualizer)
4. [Component Pantry Integration](#4-component-pantry-integration)

---

## 1. YouTube Video Embed

### Location

- **Component:** `src/app/features/components/models/models.component.ts`
- **Template:** `src/app/features/components/models/models.component.html`

### Architecture

The YouTube video uses a **lazy-load pattern** — the iframe only renders when the user clicks the play overlay, preventing unnecessary third-party script loading.

### Implementation

**TypeScript (`models.component.ts:16-82`):**

```typescript
// Signal tracks play state
protected readonly videoPlaying = signal<boolean>(false);

// Sanitized URL prevents Angular security warnings
protected readonly videoSrc: SafeResourceUrl;

constructor() {
  this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/ES-QrquEH8M?autoplay=1'
  );
}

// Triggered on play overlay click
protected playVideo(): void {
  this.videoPlaying.set(true);
}
```

**Template (`models.component.html:7-22`):**

```html
@if (idx === 1 && videoPlaying()) {
  <iframe
    class="models__video-iframe"
    [src]="videoSrc"
    title="N-Compass TV Video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
} @else {
  <img [src]="row.imageSrc" [alt]="row.imageAlt" />
  @if (idx === 1) {
    <div class="models__play-overlay" (click)="playVideo()">
      <span class="models__play-icon"></span>
    </div>
  }
}
```

**Styles (`models.component.scss:98-141`):**

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
  background: rgba(125, 201, 49, 0.9);
  border-radius: 50%;

  &::after {
    // CSS triangle play icon
    border-width: 0.75rem 0 0.75rem 1.3rem;
    border-color: transparent transparent transparent #0d0d0d;
  }
}

&__video-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 2.25rem;
}
```

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| `DomSanitizer.bypassSecurityTrustResourceUrl` | Angular blocks unsafe URLs; YouTube embed URLs require sanitization bypass |
| Signal-based `videoPlaying` | Reactive state — template re-renders iframe only when signal changes |
| Lazy iframe load | Prevents loading YouTube's 100KB+ JS bundle until user interacts |
| Play overlay on row index 1 | Only the "Our Journey" row has the video embed |

### Configuration

The YouTube URL is defined in `models.constants.ts:3`:

```typescript
export const MODELS_YOUTUBE_URL = 'https://www.youtube.com/embed/ES-QrquEH8M?autoplay=1';
```

---

## 2. Running Animations

Three distinct animation systems are implemented across the site:

### 2.1 — Scroll-Triggered Slide Animations (Models Section)

**Files:** `models.component.ts`, `models.component.scss`

Uses the **Intersection Observer API** to trigger CSS animations when rows enter the viewport.

**TypeScript (`models.component.ts:36-55`):**

```typescript
public ngAfterViewInit(): void {
  this.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('models__row--visible');
          this.observer?.unobserve(entry.target); // Fire once
        }
      });
    },
    { threshold: 0.2 } // 20% visible triggers animation
  );

  this.rowRefs.forEach((ref) => this.observer!.observe(ref.nativeElement));
}

public ngOnDestroy(): void {
  this.observer?.disconnect();
}
```

**Keyframes (`models.component.scss:1-21`):**

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

**Rows start hidden, animate in on scroll:**

```scss
&__row {
  opacity: 0;
  transform: translateX(60px);

  &--visible {
    animation: models-slide-in-right 1.2s ease forwards;
  }
}

&__row--reverse {
  transform: translateX(-60px);

  &.models__row--visible {
    animation: models-slide-in-left 1.2s ease forwards;
  }
}
```

### 2.2 — Typewriter Animation (Hero Section)

**File:** `hero.component.ts`

A character-by-character typewriter effect for the hero title, driven by `setInterval` and Angular signals.

**Implementation (`hero.component.ts:132-150`):**

```typescript
private startTypewriterAnimation(): void {
  const totalCharacters = this.titleLines.reduce((total, line) => {
    return total + line.text.length;
  }, 0) + (this.titleLines.length - 1); // +1 for newlines between lines

  let typedCount = 0;
  this.typedCharacters.set(0);

  this.typewriterTimerId = setInterval((): void => {
    typedCount += 1;
    this.typedCharacters.set(typedCount);

    if (typedCount >= totalCharacters && this.typewriterTimerId !== null) {
      clearInterval(this.typewriterTimerId);
      this.typewriterTimerId = null;
    }
  }, 42); // 42ms per character
}
```

**Title lines (`hero.component.ts:50-54`):**

```typescript
protected readonly titleLines: ReadonlyArray<HeroTitleLine> = [
  { text: 'COMMUNITY FOCUSED', accent: false },
  { text: 'INDOOR DIGITAL', accent: true },
  { text: 'BILLBOARDS', accent: true },
];
```

**Character slicing (`hero.component.ts:99-115`):**

```typescript
protected getVisibleTitleText(lineIndex: number): string {
  const typedCount = this.typedCharacters();
  let offset = 0;

  for (let index = 0; index < this.titleLines.length; index++) {
    const line = this.titleLines[index];
    const nextOffset = offset + line.text.length;

    if (index === lineIndex) {
      return line.text.slice(0, Math.max(0, Math.min(typedCount - offset, line.text.length)));
    }
    offset = nextOffset + 1; // +1 for newline
  }
  return '';
}
```

### 2.3 — Marquee / Infinite Scroll Animation (Services Section)

**File:** `services.component.scss`

A CSS-only infinite horizontal scroll for the service cards carousel.

**Keyframes (`services.component.scss:186-194`):**

```scss
@keyframes services-marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 0.5rem)); }
}
```

**Application (`services.component.scss:48-54`):**

```scss
&__track {
  display: flex;
  width: max-content;
  gap: 1rem;
  will-change: transform;
  animation: services-marquee 24s linear infinite;
}
```

**Responsive override — pauses on mobile:**

```scss
@media (max-width: 1199px) {
  &__track { animation: none; }
  &__viewport {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
}
```

### 2.4 — Bounce Animation (Hero)

**File:** `hero.component.scss`

```scss
@keyframes hero-bounce {
  0%, 100% { transform: translateY(0); }
  20%      { transform: translateY(-12px); }
  40%      { transform: translateY(-6px); }
  60%      { transform: translateY(-3px); }
}

&__logo:hover { animation: hero-bounce 0.6s ease; }
&__cta:hover  { animation: hero-bounce 0.6s ease; }
```

---

## 3. Music / Audio Visualizer

### Location

- **Component:** `src/app/features/components/podcast/podcast.component.ts`
- **Template:** `src/app/features/components/podcast/podcast.component.html`
- **Styles:** `src/app/features/components/podcast/podcast.component.scss`

### Architecture

A **pure CSS audio visualizer** with 15 animated bars that simulate an audio waveform — no actual audio playback. The bars pulse with staggered timing using 5 different keyframe variations.

### Implementation

**Template (`podcast.component.html:3-7`):**

```html
<div class="podcast__art" aria-hidden="true">
  <span></span><span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span><span></span>
</div>
```

**5 Keyframe Variants (`podcast.component.scss:5-30`):**

```scss
@keyframes viz-pulse-a {
  0%, 100% { transform: scaleY(0.25); filter: brightness(1); }
  50%      { transform: scaleY(1);    filter: brightness(1.4); }
}

@keyframes viz-pulse-b {
  0%, 100% { transform: scaleY(0.4);  filter: brightness(1); }
  50%      { transform: scaleY(0.85); filter: brightness(1.2); }
}

@keyframes viz-pulse-c {
  0%, 100% { transform: scaleY(0.15); filter: brightness(1); }
  50%      { transform: scaleY(0.95); filter: brightness(1.35); }
}

@keyframes viz-pulse-d {
  0%  { transform: scaleY(0.35); filter: brightness(1); }
  35% { transform: scaleY(0.7);  filter: brightness(1.15); }
  70% { transform: scaleY(0.5);  filter: brightness(1.05); }
}

@keyframes viz-pulse-e {
  0%  { transform: scaleY(0.2);  filter: brightness(1); }
  40% { transform: scaleY(0.6);  filter: brightness(1.1); }
  80% { transform: scaleY(0.9);  filter: brightness(1.3); }
}
```

**Bar Styling & Per-Bar Timing (`podcast.component.scss:71-94`):**

```scss
span {
  width: 0.45rem;
  border-radius: 0.2rem;
  background: var(--color-accent);
  transform-origin: center;
  will-change: transform, filter;
  box-shadow: 0 0 8px rgba(125, 201, 49, 0.5);
}

// Each bar has unique height, animation variant, duration, delay
span:nth-child(1)  { height: 2.8rem; animation: viz-pulse-a 0.8s  ease-in-out 0.0s  infinite; }
span:nth-child(2)  { height: 3.6rem; animation: viz-pulse-b 1.1s  ease-in-out 0.1s  infinite; }
span:nth-child(3)  { height: 2.2rem; animation: viz-pulse-c 0.6s  ease-in-out 0.05s infinite; }
span:nth-child(4)  { height: 4.2rem; animation: viz-pulse-d 1.0s  ease-in-out 0.2s  infinite; }
span:nth-child(5)  { height: 1.8rem; animation: viz-pulse-e 0.7s  ease-in-out 0.15s infinite; }
// ... (15 bars total)
```

### Visual Effects

| Effect | CSS Property | Purpose |
|--------|-------------|---------|
| Scale pulse | `scaleY()` | Bars grow/shrink like audio levels |
| Brightness boost | `filter: brightness()` | Glow effect at peak |
| Green glow | `box-shadow: 0 0 8px rgba(125,201,49,0.5)` | Accent color halo |
| Radial gradient | `::before` pseudo-element | Ambient light behind bars |
| Staggered timing | `animation-delay` (0.0s–0.4s) | Organic, non-uniform motion |

### Streaming Platform Buttons

```html
<div class="podcast__actions">
  <ntv-button variant="accent" rounded="full" size="md" (buttonClick)="scrollToContact()">
    Listen on Spotify
  </ntv-button>
  <ntv-button variant="danger" rounded="full" size="md" (buttonClick)="scrollToContact()">
    Apple Podcasts
  </ntv-button>
</div>
```

---

## 4. Component Pantry Integration

### Components Used Across Features

| Component | Selector | Import | Used In |
|-----------|----------|--------|---------|
| Button | `ntv-button` | `Button` | Hero, Models, Services, Podcast, Contact |
| Input | `ntv-input` | `Input` | Contact |
| Textarea | `ntv-textarea` | `Textarea` | Contact |

### Button Variants Used

| Location | Variant | Rounded | Size | Purpose |
|----------|---------|---------|------|---------|
| Hero CTA | `accent` | `full` | `md` | Primary action |
| Hero actions | `primary` / `secondary` | `full` | `md` | Learn More / Call Us |
| Models | `accent` | `full` | `md` | Learn More |
| Podcast Spotify | `accent` | `full` | `md` | Streaming CTA |
| Podcast Apple | `danger` | `full` | `md` | Streaming CTA |
| Services | `accent` | `full` | `md` | Learn More |
| Contact Submit | `accent` | `full` | `lg` | Form submit |

### Import Pattern

All components are **standalone** — import directly in each component:

```typescript
import { Button } from '@ntv360/component-pantry';

@Component({
  standalone: true,
  imports: [Button],
  // ...
})
export class MyComponent {}
```

### Tailwind Integration

```js
// tailwind.config.js
const ntvPreset = require('@ntv360/component-pantry/tailwind-preset');

module.exports = {
  presets: [ntvPreset],
  content: [
    './src/**/*.{html,ts}',
    './node_modules/@ntv360/component-pantry/**/*.{js,mjs}'
  ]
};
```

---

## Summary

| Feature | Technique | Complexity |
|---------|-----------|------------|
| YouTube embed | Lazy iframe + DomSanitizer + signal state | Medium |
| Scroll animations | IntersectionObserver + CSS keyframes | Low |
| Typewriter | setInterval + signal + string slicing | Medium |
| Marquee | CSS `@keyframes` + `translateX(-50%)` | Low |
| Bounce | CSS `@keyframes` on hover | Low |
| Audio visualizer | 15 CSS-animated bars with staggered timing | Low |
| Component Pantry | Standalone component imports | Low |
