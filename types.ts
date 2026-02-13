
export interface BrandInputs {
  businessType: string;
  industry: string;
  targetAudience: string;
  values: string;
  personality: 'modern' | 'classic' | 'playful' | 'serious';
}

export interface BrandColor {
  hex: string;
  name: string;
}

export interface BrandIdentity {
  name: string;
  tagline: string;
  mission: string;
  vision: string;
  colors: BrandColor[];
  socialBio: string;
  emailCopy: string;
  adHeadline: string;
  adCopy: string;
}

export enum AppState {
  LANDING = 'LANDING',
  CONFIGURING = 'CONFIGURING',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS'
}
