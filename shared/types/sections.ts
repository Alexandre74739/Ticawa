export interface SectionLink {
  label: string;
  to: string;
}

export interface ProductFeature {
  title: string;
  text: string;
  bullets: string[];
  mascot: string;
  cta?: SectionLink;
}
