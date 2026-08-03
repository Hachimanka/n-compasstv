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
