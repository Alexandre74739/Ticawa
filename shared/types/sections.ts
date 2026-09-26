export interface SectionLink {
  label: string;
  to: string;
}

export interface SourceLink {
  label: string;
  href: string;
}

export interface CaseStudy {
  result: string;
  text: string;
  coverage: string;
  source: SourceLink;
  mascot: string;
}

export interface ProductFeature {
  title: string;
  text: string;
  bullets: string[];
  mascot: string;
  cta?: SectionLink;
}
