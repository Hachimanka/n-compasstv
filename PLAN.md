# Implementation Plan: Component Pantry + Strapi CMS Integration

## Executive Summary

This plan migrates the n-compasstv website from a fully hardcoded Angular 21 single-page app to a CMS-driven, component-library-based architecture, following the NTV360 code standards. The work is broken into **5 phases**, executed incrementally.

---

## Phase 0: Foundation & Access (Pre-work)

### 0.1 — Obtain Component Pantry Access
- Request an npm token from the FE team for `@ntv360/component-pantry`
- Create `.npmrc` in project root:
  ```
  @ntv360:registry=https://npm-dev.n-compass.online
  ```
- Run `npm install @ntv360/component-pantry@0.6.6`
- Install peer dependencies: `tailwindcss@^3.4.18 postcss@^8.5.6 autoprefixer@^10.4.22`
- Configure Tailwind CSS with `@import '@ntv360/component-pantry/src/styles.css'`

### 0.2 — Verify Strapi CMS Access
- The Strapi instance at `nctv-strapi.onrender.com` is currently returning 500 errors
- **Action needed**: Confirm with the backend team that the CMS is accessible and identify available content types
- Expected content types based on the site structure:
  - `hero` — title, description, CTA, background image
  - `about-row` — title, description, image, YouTube URL
  - `service` — title, description, image, card order
  - `podcast` — title, description, Spotify/Apple links
  - `testimonial` — name, location, quote
  - `contact-info` — address, phone, email, social links
  - `footer-links` — link groups (Quick Links, Company, Legal)
  - `navigation` — nav links and their order

### 0.3 — Set Up Environment Files
- Create `src/environments/environment.ts` and `environment.prod.ts`
- Store Strapi API URL and API token placeholder
- Add `provideHttpClient()` to `app.config.ts`

---

## Phase 1: Infrastructure (Week 1)

### 1.1 — Project Structure Refactor
Create the `core/` and `shared/` directory structure following code standards:

```
src/app/
├── core/
│   ├── services/
│   │   └── strapi.service.ts          (HTTP calls to Strapi)
│   ├── models/
│   │   ├── hero.model.ts
│   │   ├── models-row.model.ts
│   │   ├── service.model.ts
│   │   ├── podcast.model.ts
│   │   ├── testimonial.model.ts
│   │   ├── contact.model.ts
│   │   └── footer.model.ts
│   └── interceptors/
│       └── strapi-auth.interceptor.ts
├── shared/
│   └── components/                    (shared wrapper components if needed)
└── features/
    ├── hero/
    │   ├── hero.ts                    (renamed from hero.component.ts)
    │   ├── hero.html
    │   ├── hero.css                   (renamed from .scss → Component Pantry uses CSS)
    │   └── hero.types.ts
    ├── models/
    │   ├── models.ts
    │   ├── models.html
    │   ├── models.css
    │   └── models.types.ts
    ├── services/
    │   ├── services.ts
    │   ├── services.html
    │   ├── services.css
    │   └── services.types.ts
    ... (same pattern for all 7 components)
```

**Key decisions**:
- Rename `.component.ts` → `.ts` (follows Component Pantry convention)
- Rename `.component.scss` → `.css` (Component Pantry uses CSS + Tailwind, not SCSS)
- Add `.types.ts` files for all interfaces (per code standards)
- Add `.constants.ts` files for static config values

### 1.2 — Create Strapi Service
- `core/services/strapi.service.ts`
- Inject `HttpClient`, inject API URL from environment
- Methods: `getHero()`, `getAboutRows()`, `getServices()`, `getTestimonials()`, `getPodcast()`, `getContactInfo()`, `getFooterLinks()`
- Each returns an Observable typed to the corresponding model
- Add error handling with retry logic

### 1.3 — Create Data Models
- Extract all hardcoded interfaces from individual components into `core/models/`
- Add Strapi response typing (e.g., `StrapiResponse<T>`, `StrapiMedia`)

---

## Phase 2: Component Pantry Migration (Weeks 2–3)

Replace existing HTML elements with Component Pantry components. Each component migration follows the same pattern:

### 2.1 — Hero Section
| Current Element | Component Pantry Replacement |
|---|---|
| `<a>` CTA buttons | `<cp-button>` (Button component) |
| Mobile menu hamburger | `<cp-button>` with icon variant |
| Navigation links | Keep as `<a>` (Component Pantry has no nav component) |
| Mobile nav overlay | `<cp-offcanvas>` (Offcanvas component) |

**Data migration**: Replace hardcoded arrays with `StrapiService.getHero()` call

### 2.2 — Models Section
| Current Element | Component Pantry Replacement |
|---|---|
| Image cards with border/shadow | `<cp-card>` (Card component) |
| "Learn More" buttons | `<cp-button>` |
| YouTube video embed | Custom component (no CP equivalent) |

**Data migration**: Replace hardcoded rows with `StrapiService.getAboutRows()` call

### 2.3 — Services Section
| Current Element | Component Pantry Replacement |
|---|---|
| Service cards in carousel | `<cp-carousel>` (Carousel component) + `<cp-card>` |
| Marquee animation | Custom CSS (keep existing) |

**Data migration**: Replace hardcoded cards with `StrapiService.getServices()` call

### 2.4 — Podcast Section
| Current Element | Component Pantry Replacement |
|---|---|
| Static visualizer bars | Custom animation (keep as-is, no CP equivalent) |
| Spotify/Apple buttons | `<cp-button>` variants |

**Data migration**: Replace hardcoded text with `StrapiService.getPodcast()` call

### 2.5 — Testimonials Section
| Current Element | Component Pantry Replacement |
|---|---|
| Testimonial cards in marquee | `<cp-carousel>` + `<cp-card>` |

**Data migration**: Replace hardcoded testimonials with `StrapiService.getTestimonials()` call

### 2.6 — Contact Section
| Current Element | Component Pantry Replacement |
|---|---|
| Text inputs | `<cp-input>` |
| Textarea | `<cp-textarea>` |
| Submit button | `<cp-button>` |
| Form layout | `<cp-card>` wrapper |

**Data migration**: Replace hardcoded info with `StrapiService.getContactInfo()` call
**Add form handling**: Implement Angular Reactive Forms with validation and submit logic

### 2.7 — Footer Section
| Current Element | Component Pantry Replacement |
|---|---|
| Link groups | Keep as `<a>` elements (no CP nav component) |
| Social icons | Keep as SVG sprites |
| Copyright text | Keep as plain text |

**Data migration**: Replace hardcoded links with `StrapiService.getFooterLinks()` call

---

## Phase 3: Content Migration in Strapi CMS (Week 3, parallel)

### 3.1 — Create Content Types in Strapi
Define all content types in the Strapi admin panel:
- `hero` (single type)
- `about-row` (collection, 2 entries)
- `service` (collection, 3 entries)
- `podcast` (single type)
- `testimonial` (collection, 3+ entries)
- `contact-info` (single type)
- `footer-links` (collection, grouped by section)
- `navigation` (single type)

### 3.2 — Populate Content
- Migrate all hardcoded text, titles, descriptions into Strapi entries
- Upload images (currently referencing Figma MCP URLs) to Strapi Media Library
- Set up proper image sizing/transforms in Strapi

### 3.3 — Set Up Image Pipeline
- Replace Figma MCP asset URLs with Strapi media URLs
- Use Strapi's built-in image optimization (formats: `&formats=webp,avif`)
- Create a shared image component or use `<picture>` with responsive sources

---

## Phase 4: Code Standards Compliance (Week 4)

### 4.1 — Git Workflow Setup
- Ensure `.husky/` pre-commit hooks are configured
- Set up `commitlint` with conventional commits (`feat:`, `fix:`, `chore:`)
- Configure lint rules to block `console.log` and enforce JSDoc

### 4.2 — File Structure Standards
Every component folder must follow:
```
component-name/
├── component-name.ts           (Brain: logic, signals, methods)
├── component-name.html         (Template: layout and bindings)
├── component-name.css          (Styles: BEM classes + Tailwind)
├── component-name.types.ts     (Types: interfaces)
├── component-name.constants.ts (Constants: fixed values)
├── component-name.manifest.ts  (Manifest: Strapi/demo config)
└── index.ts                    (Barrel: re-exports)
```

### 4.3 — Code Quality
- Add JSDoc comments (`/** */`) to all public/protected methods
- Add access modifiers (`public`, `private`, `protected`) to all methods
- Remove any `console.log` statements
- Configure Prettier and ESLint to match NTV360 standards
- Add unit tests for Strapi service and critical components

---

## Phase 5: Testing & Deployment

### 5.1 — Testing
- Unit tests for `StrapiService` (mock HTTP responses)
- Unit tests for form validation in Contact component
- Visual regression: verify all sections render correctly
- Responsive testing at 1199px and 767px breakpoints
- Accessibility audit (ARIA attributes, keyboard navigation)

### 5.2 — Performance
- Implement lazy loading for images (native `loading="lazy"`)
- Add Strapi API caching (HTTP interceptors with `tap` caching)
- Verify bundle size stays within budgets (warning at 500kB, error at 1MB)
- Run Lighthouse audit

### 5.3 — Deployment
- Set up CI/CD pipeline (if not already in place)
- Configure environment variables for production Strapi URL
- Deploy and verify all dynamic content loads correctly

---

## File Change Summary

| Phase | Files Created | Files Modified | Files Removed |
|---|---|---|---|
| Phase 0 | `.npmrc` | `package.json` | — |
| Phase 1 | 12+ (services, models, environments) | `app.config.ts`, `angular.json` | — |
| Phase 2 | — | All 7 component `.html`, `.ts`, `.scss` → `.css` | Old `.component.ts/html/scss` files |
| Phase 3 | — | — | — (Strapi admin work) |
| Phase 4 | `.husky/` configs, test files | All component `.ts` files | — |
| Phase 5 | — | — | — |

---

## Risk Factors

| Risk | Mitigation |
|---|---|
| Strapi CMS is down | Confirm with backend team before starting Phase 1; can develop with mock data initially |
| No npm token for Component Pantry | Request early; can start Phase 1 without it |
| SCSS → CSS + Tailwind migration | Component Pantry requires CSS; may need to rewrite existing SCSS styles to use Tailwind utilities |
| Budget warnings (SCSS files already exceed 4kB) | Moving to CSS + Tailwind should reduce component CSS size |

---

## Open Questions

1. **Strapi CMS** — Can you confirm the backend team can fix the 500 errors and set up the content types? Or should I design mock data for development first?
2. **Tailwind CSS** — The current project uses SCSS. Component Pantry requires Tailwind + CSS. Are you okay with migrating from SCSS to Tailwind, or should I keep SCSS alongside?
3. **Image hosting** — Should we migrate all Figma MCP asset URLs to Strapi Media Library, or keep them as-is for now?
4. **Form submission** — The contact form currently has no handler. Should I implement actual form submission (email/Strapi), or just wire up the UI?
