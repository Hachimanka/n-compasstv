import { Component, OnDestroy, OnInit, signal } from '@angular/core';

interface HeroNavLink {
  label: string;
  href: string;
}

interface HeroAction {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

interface HeroTitleLine {
  text: string;
  accent: boolean;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly mobileMenuOpen = signal<boolean>(false);
  protected readonly typedCharacters = signal<number>(0);

  protected readonly heroBackgroundSrc =
    'https://www.figma.com/api/mcp/asset/2fac6da4-cd33-40be-bece-c34ad5de535b';
  protected readonly brandLogoSrc =
    'https://www.figma.com/api/mcp/asset/1e65a087-9159-48fd-a7ff-e9181df2fdb5';
  protected readonly eyebrowDotSrc =
    'https://www.figma.com/api/mcp/asset/db3625d5-ad3f-4c7b-bd12-84ef8a4cf719';

  protected readonly navLinks: ReadonlyArray<HeroNavLink> = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Podcast', href: '#podcast' },
    { label: 'Contact', href: '#contact' },
  ];

  protected readonly actions: ReadonlyArray<HeroAction> = [
    { label: 'Learn More', href: '#about', variant: 'primary' },
    { label: 'Call Us Today!', href: '#contact', variant: 'secondary' },
  ];

  protected readonly titleLines: ReadonlyArray<HeroTitleLine> = [
    { text: 'COMMUNITY FOCUSED', accent: false },
    { text: 'INDOOR DIGITAL', accent: true },
    { text: 'BILLBOARDS', accent: true },
  ];

  private readonly typewriterSpeedMs = 42;
  private typewriterTimerId: ReturnType<typeof setInterval> | null = null;

  public ngOnInit(): void {
    this.startTypewriterAnimation();
  }

  public ngOnDestroy(): void {
    if (this.typewriterTimerId !== null) {
      clearInterval(this.typewriterTimerId);
      this.typewriterTimerId = null;
    }
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((currentValue: boolean) => !currentValue);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

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