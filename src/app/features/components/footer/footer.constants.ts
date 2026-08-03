/** Footer section constants */
export const FOOTER_LOGO_SRC = 'https://www.figma.com/api/mcp/asset/5e081fe1-289d-4386-99cb-48ada5231e5d';
export const FOOTER_ICON_SPRITE_PATH = 'assets/icons/icon-sprite.svg';

export const FOOTER_GROUPS = [
  { title: 'Quick Links', links: ['Home', 'About', 'Services', 'Podcast', 'Contact'] },
  { title: 'Company', links: ['Dealership Info', 'Territory Availability', 'Case Studies', 'Press Kit', 'Careers'] },
] as const;

export const FOOTER_SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com', iconName: 'linkedin' as const },
  { label: 'Instagram', href: 'https://www.instagram.com', iconName: 'instagram' as const },
  { label: 'Facebook', href: 'https://www.facebook.com', iconName: 'facebook' as const },
  { label: 'YouTube', href: 'https://www.youtube.com', iconName: 'youtube' as const },
] as const;
