import { Component } from '@angular/core';
import { Testimonial } from './testimonials.types';

/**
 * Testimonials section component with marquee carousel of dealer testimonials.
 */
@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  /** Testimonial data */
  protected readonly testimonials: ReadonlyArray<Testimonial> = [
    {
      quote:
        'I was looking for an opportunity that didn\'t require too much down but would allow me to be my own boss and make a great living. I was happy to be thriving in my own community and exceeded my sales goals in my first year of business.',
      name: 'Jim Montoya',
      location: 'Grand Junction, Colorado',
    },
    {
      quote:
        'Just a little over a year into it, we are seeing recurring revenue that is covering costs and showing a profit. With over 90 screens up and rolling, we are excited and look forward to the future.',
      name: 'Bill Christman',
      location: 'St. Clair Shores, MI',
    },
    {
      quote:
        'My favorite part about this business is I\'m not alone. From continued training, answering my questions, giving me advice and cheering me along, I can highly recommend being a dealer with N-Compass TV.',
      name: 'Susan Thompson',
      location: 'Michiana',
    },
  ];

  /** Duplicated testimonials for infinite marquee loop */
  protected readonly carouselTestimonials: ReadonlyArray<Testimonial> = [...this.testimonials, ...this.testimonials];
}
