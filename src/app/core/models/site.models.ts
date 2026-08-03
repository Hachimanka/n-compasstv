export interface HeroData {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  navLinks: Array<{ label: string; href: string }>;
  backgroundImage?: string;
}

export interface AboutRowData {
  title: string;
  description: string;
  supportText: string;
  imageAlt: string;
  imageUrl: string;
  youtubeUrl?: string;
  reverse: boolean;
}

export interface ServiceData {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface PodcastData {
  eyebrow: string;
  title: string;
  description: string;
  spotifyLabel: string;
  spotifyUrl: string;
  appleLabel: string;
  appleUrl: string;
}

export interface TestimonialData {
  name: string;
  location: string;
  quote: string;
}

export interface ContactInfoData {
  address: string;
  phone: string;
  email: string;
}

export interface FooterData {
  tagline: string;
  quickLinks: Array<{ label: string; href: string }>;
  companyLinks: Array<{ label: string; href: string }>;
  contactAddress: string;
  contactEmail: string;
  socialLinks: Array<{ label: string; href: string; icon: string }>;
}
