/** Navigation link configuration */
export interface HeroNavLink {
  label: string;
  href: string;
}

/** Hero action button configuration */
export interface HeroAction {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

/** Hero title line with accent flag */
export interface HeroTitleLine {
  text: string;
  accent: boolean;
}
