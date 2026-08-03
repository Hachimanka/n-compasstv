import { Component } from '@angular/core';

interface ContactDetail {
  label: string;
  value: string;
  iconName: 'location' | 'phone' | 'mail';
}

interface ContactField {
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'textarea';
}

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly details: ReadonlyArray<ContactDetail> = [
    { label: 'Address', value: '1546 Cole Blvd Bldg 5, Suite 100, Lakewood, CO 80401', iconName: 'location' },
    { label: 'Phone', value: '(720) 763-9094', iconName: 'phone' },
    { label: 'Email', value: 'info@n-compass.biz', iconName: 'mail' },
  ];

  protected readonly fields: ReadonlyArray<ContactField> = [
    { label: 'Full name', placeholder: 'Jane Rivera', type: 'text' },
    { label: 'Email', placeholder: 'jane@email.com', type: 'email' },
    { label: 'Target market', placeholder: 'City, State', type: 'text' },
    { label: 'What are you hoping to build?', placeholder: 'Tell us a bit about your goals', type: 'textarea' },
  ];

  protected readonly iconSpritePath = 'assets/icons/icon-sprite.svg';
}