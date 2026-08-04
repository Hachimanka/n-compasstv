import { Component } from '@angular/core';

/** Footer link group */
export interface FooterGroup {
  title: string;
  links: ReadonlyArray<string>;
}

/** Footer social media link */
export interface FooterSocialLink {
  label: string;
  href: string;
  iconName: 'linkedin' | 'instagram' | 'facebook' | 'youtube';
}

/**
 * Footer component with navigation links, social links, and copyright.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  /** Current year for copyright */
  protected readonly year = new Date().getFullYear();

  protected readonly logoSrc = 'https://www.figma.com/api/mcp/asset/5e081fe1-289d-4386-99cb-48ada5231e5d';
  protected readonly iconSpritePath = 'assets/icons/icon-sprite.svg';

  /** Footer link groups */
  protected readonly groups: ReadonlyArray<FooterGroup> = [
    { title: 'Quick Links', links: ['Home', 'About', 'Services', 'Podcast', 'Contact'] },
    { title: 'Company', links: ['Dealership Info', 'Territory Availability', 'Case Studies', 'Press Kit', 'Careers'] },
  ];

  /** Social media links */
  protected readonly socialLinks: ReadonlyArray<FooterSocialLink> = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com', iconName: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com', iconName: 'instagram' },
    { label: 'Facebook', href: 'https://www.facebook.com', iconName: 'facebook' },
    { label: 'YouTube', href: 'https://www.youtube.com', iconName: 'youtube' },
  ];
}
