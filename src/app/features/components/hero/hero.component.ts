import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Button } from '@ntv360/component-pantry';
import { StrapiService } from '../../../core/services/strapi.service';
import { HeroData } from '../../../core/models/site.models';

/** Navigation link configuration */
export interface HeroNavLink {
  label: string;
  href: string;
}

/** Hero action button configuration */
export interface HeroAction {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

/** Hero title line with accent flag */
export interface HeroTitleLine {
  text: string;
  accent: boolean;
}

/**
 * Hero section component with typewriter animation, navigation, and CTA buttons.
 * Fetches data from Strapi CMS with hardcoded fallback.
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [Button],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('bgLogo') bgLogoRef!: ElementRef<HTMLImageElement>;

  /** Mobile menu open state */
  protected readonly mobileMenuOpen = signal<boolean>(false);

  /** Current typewriter character count */
  protected readonly typedCharacters = signal<number>(0);

  private readonly strapi = inject(StrapiService);

  protected readonly heroBackgroundSrc = 'backgrounds/herobg.png';
  protected readonly heroBgLogoSrc = 'backgrounds/herobglogo.png';
  protected readonly brandLogoSrc = 'backgrounds/n-compasstvlogo.png';
  protected readonly eyebrowDotSrc =
    'https://www.figma.com/api/mcp/asset/db3625d5-ad3f-4c7b-bd12-84ef8a4cf719';

  /** Navigation links for the header */
  protected readonly navLinks: ReadonlyArray<HeroNavLink> = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Podcast', href: '#podcast' },
    { label: 'Contact', href: '#contact' },
  ];

  /** Action buttons for the hero content */
  protected readonly actions: ReadonlyArray<HeroAction> = [
    { label: 'Learn More', href: '#about', variant: 'primary' },
  ];

  /** Title lines for typewriter animation */
  protected readonly titleLines: ReadonlyArray<HeroTitleLine> = [
    { text: 'COMMUNITY FOCUSED', accent: false },
    { text: 'INDOOR DIGITAL', accent: true },
    { text: 'BILLBOARDS', accent: true },
  ];

  private readonly typewriterSpeedMs = 42;
  private typewriterTimerId: ReturnType<typeof setInterval> | null = null;

  /** Initialize component, start animations and fetch data */
  public ngOnInit(): void {
    this.startTypewriterAnimation();
    this.fetchFromStrapi();

    setTimeout(() => {
      this.bgLogoRef?.nativeElement?.classList.add('hero__bg-logo--loaded');
    }, 1800);
  }

  /** Clean up intervals on destroy */
  public ngOnDestroy(): void {
    if (this.typewriterTimerId !== null) {
      clearInterval(this.typewriterTimerId);
      this.typewriterTimerId = null;
    }
  }

  /** Refresh the page when logo is clicked */
  protected refreshPage(event: Event): void {
    event.preventDefault();
    window.location.reload();
  }

  /** Toggle mobile menu visibility */
  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((currentValue: boolean) => !currentValue);
  }

  /** Close mobile menu */
  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  /** Smooth scroll to contact section */
  protected scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  /** Close mobile menu and scroll to contact section */
  protected scrollToContactAndCloseMenu(): void {
    this.closeMobileMenu();
    setTimeout(() => this.scrollToContact(), 300);
  }

  /**
   * Get visible text for a title line based on typewriter progress
   * @param lineIndex - Index of the title line
   * @returns Partial text string for the line
   */
  protected getVisibleTitleText(lineIndex: number): string {
    const typedCount: number = this.typedCharacters();
    let offset = 0;

    for (let index = 0; index < this.titleLines.length; index += 1) {
      const line = this.titleLines[index];
      const nextOffset = offset + line.text.length;

      if (index === lineIndex) {
        return line.text.slice(0, Math.max(0, Math.min(typedCount - offset, line.text.length)));
      }

      offset = nextOffset + 1;
    }

    return '';
  }

  /** Fetch hero data from Strapi CMS */
  private fetchFromStrapi(): void {
    this.strapi.getSingle<HeroData>('hero').subscribe({
      next: (response) => {
        const data = response.data as unknown as HeroData;
        if (data) {
          // Strapi data loaded successfully
        }
      },
      error: () => {
        // Strapi unavailable, using hardcoded hero data
      }
    });
  }

  /** Start typewriter animation for title text */
  private startTypewriterAnimation(): void {
    const totalCharacters = this.titleLines.reduce((characterTotal: number, line: HeroTitleLine) => {
      return characterTotal + line.text.length;
    }, 0) + (this.titleLines.length - 1);

    let typedCount = 0;
    this.typedCharacters.set(0);

    this.typewriterTimerId = setInterval((): void => {
      typedCount += 1;
      this.typedCharacters.set(typedCount);

      if (typedCount >= totalCharacters && this.typewriterTimerId !== null) {
        clearInterval(this.typewriterTimerId);
        this.typewriterTimerId = null;
      }
    }, this.typewriterSpeedMs);
  }
}
