import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Button } from '@ntv360/component-pantry';

/** Service card data */
export interface ServiceCard {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  borderColor: string;
}

/**
 * Services section component with marquee carousel of service cards.
 * Uses requestAnimationFrame for flicker-free animation control.
 */
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [Button],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('marqueeTrack') trackRef!: ElementRef<HTMLElement>;

  /** Base speed in pixels per frame (~60fps) */
  private baseSpeed = 1.5;

  /** Current speed multiplier (increases on hold) */
  private speedMultiplier = 1;

  /** Direction: 1 = normal (right-to-left), -1 = reverse */
  private direction = 1;

  /** Current translateX offset in pixels */
  private position = 0;

  /** Whether animation is paused */
  private paused = false;

  /** RAF ID for cancellation */
  private rafId: ReturnType<typeof requestAnimationFrame> | null = null;

  /** Interval ID for speed-up while holding */
  private speedIntervalId: ReturnType<typeof setInterval> | null = null;

  /** Service card data */
  protected readonly cards: ReadonlyArray<ServiceCard> = [
    {
      title: 'Website Development',
      description:
        'A modern website is critical for developing local SEO and your customer\'s brand with detailed and engaging content.',
      imageSrc: 'https://www.figma.com/api/mcp/asset/96994242-d57a-4bf9-a289-2fb190993940',
      imageAlt: 'Hands typing on a laptop while reviewing a marketing website',
      borderColor: '#000000',
    },
    {
      title: 'PPC ( Pay Per Click )',
      description:
        'Places your customer in front of prospects at the exact moment they\'re searching for their products or services.',
      imageSrc: 'https://www.figma.com/api/mcp/asset/03159ee8-c7f2-46af-a39e-fd87b6ec72e5',
      imageAlt: 'Laptop showing paid search campaign analytics',
      borderColor: '#013645',
    },
    {
      title: 'Streaming Audio',
      description:
        'Reach your clients\' audiences as they immerse themselves in their favorite podcasts, music, and radio shows.',
      imageSrc: 'https://www.figma.com/api/mcp/asset/0a9187da-243e-4261-8621-e56d876fdb93',
      imageAlt: 'Studio microphone with audio production equipment',
      borderColor: '#013645',
    },
  ];

  /** Duplicated cards for infinite marquee loop */
  protected readonly carouselCards: ReadonlyArray<ServiceCard> = [...this.cards, ...this.cards];

  /** Set scroll direction */
  protected setDirection(reversed: boolean): void {
    this.direction = reversed ? -1 : 1;
  }

  /** Start speeding up while button is held */
  protected startSpeedUp(): void {
    this.speedMultiplier = 2;

    this.speedIntervalId = setInterval(() => {
      this.speedMultiplier = Math.min(this.speedMultiplier + 1, 6);
    }, 500);
  }

  /** Stop speeding up when button is released */
  protected stopSpeedUp(): void {
    if (this.speedIntervalId !== null) {
      clearInterval(this.speedIntervalId);
      this.speedIntervalId = null;
    }
    this.speedMultiplier = 1;
  }

  /** Pause animation on hover */
  protected onMouseEnter(): void {
    this.paused = true;
  }

  /** Resume animation on leave */
  protected onMouseLeave(): void {
    this.paused = false;
  }

  /** Start the animation loop */
  public ngAfterViewInit(): void {
    this.tick();
  }

  /** Clean up on destroy */
  public ngOnDestroy(): void {
    this.stopSpeedUp();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  /** Animation loop */
  private tick = (): void => {
    if (!this.paused) {
      const track = this.trackRef?.nativeElement;
      if (track) {
        const halfWidth = track.scrollWidth / 2;
        const speed = this.baseSpeed * this.speedMultiplier * this.direction;

        this.position -= speed;

        if (this.position <= -halfWidth) {
          this.position += halfWidth;
        } else if (this.position > 0) {
          this.position -= halfWidth;
        }

        track.style.transform = `translateX(${this.position}px)`;
      }
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  /** Smooth scroll to contact section */
  protected scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
