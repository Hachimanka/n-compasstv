import { AfterViewInit, Component, ElementRef, inject, OnDestroy, QueryList, signal, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Button } from '@ntv360/component-pantry';
import { ModelRow } from './models.types';

/**
 * Models/About section component with scroll-triggered animations and YouTube video embed.
 */
@Component({
  selector: 'app-models',
  standalone: true,
  imports: [Button],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss',
})
export class ModelsComponent implements AfterViewInit, OnDestroy {
  /** Whether the YouTube video is playing */
  protected readonly videoPlaying = signal<boolean>(false);

  /** Sanitized YouTube embed URL */
  protected readonly videoSrc: SafeResourceUrl;

  protected readonly backgroundSrc = 'https://www.figma.com/api/mcp/asset/5d1db5f4-0bbf-439d-a56d-55556ef781a3';

  @ViewChildren('rowRef') private readonly rowRefs!: QueryList<ElementRef<HTMLElement>>;
  private readonly sanitizer = inject(DomSanitizer);
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/ES-QrquEH8M?autoplay=1'
    );
  }

  /** Set up Intersection Observer for scroll animations */
  public ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('models__row--visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    this.rowRefs.forEach((ref) => this.observer!.observe(ref.nativeElement));
  }

  /** Disconnect observer on destroy */
  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /** About section row data */
  protected readonly rows: ReadonlyArray<ModelRow> = [
    {
      title: 'Our Model',
      description:
        'Our dealership model empowers you to own and operate your own digital marketing business. Specializing in indoor digital billboards and a comprehensive suite of digital marketing services, we give you the tools to become the marketing expert in your community.',
      supportText: 'Our business opportunity allows you to develop a multi-stream revenue model.',
      imageSrc: 'https://www.figma.com/api/mcp/asset/5c094c7c-d335-40ea-aa92-8b9fbe3b1f08',
      imageAlt: 'Indoor digital billboard wall in a showroom environment',
      reverse: false,
    },
    {
      title: 'Our Journey',
      description:
        'Since its inception in 2008, N-Compass TV has been at the forefront of transforming community-based advertising through its network of owner-operated indoor digital billboards. By establishing a shared interactive local TV network across numerous communities nationwide, N-Compass TV has firmly positioned itself as a leader in the digital media sector.',
      supportText: 'Our business opportunity allows you to develop a multi-stream revenue model.',
      imageSrc: 'https://www.figma.com/api/mcp/asset/f6dd5ae2-1626-4866-a981-f58d3e312c4e',
      imageAlt: 'Team portrait beside a branded digital screen display',
      reverse: true,
    },
  ];

  /** Start playing the YouTube video */
  protected playVideo(): void {
    this.videoPlaying.set(true);
  }

  /** Smooth scroll to contact section */
  protected scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
