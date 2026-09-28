export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'UGC Ads' | 'AI Video Generation' | 'Product Commercials' | 'Affiliate Marketing' | 'Cinematic B-Roll' | string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string;
  clientOrBrand?: string;
  toolsUsed: string[];
  externalLink?: string;
  isPublished: boolean;
  order: number;
  featured?: boolean;
  metrics?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  tiktok?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface ProfileData {
  name: string;
  tagline: string;
  role: string;
  bio: string;
  photoUrl: string;
  email: string;
  skills: string[];
  stats: StatItem[];
  socialLinks: SocialLinks;
  availableForWork: boolean;
  location?: string;
  updatedAt: string;
}
