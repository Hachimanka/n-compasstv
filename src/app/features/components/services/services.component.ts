import { Component } from '@angular/core';
import { Button } from '@ntv360/component-pantry';
import { ServiceCard } from './services.types';

/**
 * Services section component with marquee carousel of service cards.
 */
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [Button],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  protected readonly serviceRailIconSrc = 'https://www.figma.com/api/mcp/asset/4f8c6049-3cbe-4862-8583-21b7a96d1398';

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

  /** Smooth scroll to contact section */
  protected scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
