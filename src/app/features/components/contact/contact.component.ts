import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input, Textarea, Button } from '@ntv360/component-pantry';
import { StrapiService } from '../../../core/services/strapi.service';
import { ContactDetail } from './contact.types';

/**
 * Contact section component with form using Component Pantry form components.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, Input, Textarea, Button],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  /** Contact details (address, phone, email) */
  protected readonly details: ReadonlyArray<ContactDetail> = [
    { label: 'Address', value: '1546 Cole Blvd Bldg 5, Suite 100, Lakewood, CO 80401', iconName: 'location' },
    { label: 'Phone', value: '(720) 763-9094', iconName: 'phone' },
    { label: 'Email', value: 'info@n-compass.biz', iconName: 'mail' },
  ];

  protected readonly iconSpritePath = 'assets/icons/icon-sprite.svg';

  /** Full name form field */
  protected fullName = '';

  /** Email form field */
  protected email = '';

  /** Target market form field */
  protected targetMarket = '';

  /** Goals form field */
  protected goals = '';

  private readonly strapi = inject(StrapiService);

  /** Handle form submission */
  protected onSubmit(): void {
    // Form submission handler
  }
}
