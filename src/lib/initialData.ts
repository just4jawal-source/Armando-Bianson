import { ProfileData, Project } from '../types';

export const initialProfileData: ProfileData = {
  name: 'Armando Bianson',
  tagline: 'Build. Automate. Create.',
  role: 'Creative Director & AI Video Specialist',
  bio: 'Specializing in performance-driven UGC advertisements, high-converting TikTok/Reels/Facebook ad creatives, and cutting-edge Google Flow / Veo-style generative video. Combining deep consumer psychology with advanced image-to-video prompting, strict character consistency, flawless product fidelity, and cinematic B-roll to deliver ads that capture attention and drive direct revenue.',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  email: 'arman.bianson@yahoo.com',
  availableForWork: true,
  location: 'Available Worldwide / Remote',
  skills: [
    'UGC Advertisements',
    'TikTok, Reels & FB Ads',
    'Product Commercials',
    'Affiliate Marketing Creatives',
    'Google Flow & Veo-Style Video',
    'Image-to-Video Prompting',
    'Character Consistency',
    'Product Consistency',
    'Cinematic B-Roll Pacing',
    'Sound Design & Hook Retention'
  ],
  stats: [
    { label: 'Turnaround Time', value: '24–48h' },
    { label: 'Video Resolution', value: '4K / 1080p' },
    { label: 'Hooks Per Video', value: '3+ Angles' },
    { label: 'Platform Native', value: '100% Custom' }
  ],
  socialLinks: {
    tiktok: 'https://tiktok.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com'
  },
  updatedAt: new Date().toISOString()
};

export const initialProjects: Project[] = [
  {
    id: 'lanvin-perfume',
    title: 'Lanvin Perfume',
    slug: 'lanvin-perfume',
    category: 'Product Commercials',
    shortDescription: "30-second vertical (9:16) luxury perfume ad for Lanvin Éclat d'Arpège, and it's very...",
    fullDescription: "A 30-second vertical (9:16) luxury perfume advertisement crafted for Lanvin Éclat d'Arpège. Featuring high-fashion vanity aesthetics, luminous floral notes, elegant macro glass reflections, and sophisticated bottle choreography designed for viral social luxury campaigns.",
    coverImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    clientOrBrand: "Lanvin Éclat d'Arpège",
    toolsUsed: ['Google Veo', 'Google Flow', 'CapCut Pro'],
    externalLink: '',
    isPublished: true,
    order: 1,
    featured: true,
    metrics: '+240% Engagement • High Retention',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'orashare-pcm20',
    title: 'Orashare PCM20',
    slug: 'orashare-pcm20',
    category: 'UGC Ads',
    shortDescription: 'This is a 24-second vertical (9:16) product promo for the Orashare PCM20 power ban...',
    fullDescription: 'A fast-paced 24-second vertical (9:16) product promo for the Orashare PCM20 power bank. Highlights high-capacity charging on-the-go, dual cable convenience, sleek pocketability, and strong direct-response TikTok/Reels conversion hooks.',
    coverImage: 'https://images.unsplash.com/photo-1609592426868-6c84b11fdf36?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609592426868-6c84b11fdf36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    clientOrBrand: 'Orashare Gadgets',
    toolsUsed: ['Google Veo', 'Google Flow', 'CapCut Pro'],
    externalLink: '',
    isPublished: true,
    order: 2,
    featured: true,
    metrics: '+185% CTR • -34% CPA',
    createdAt: '2026-02-15T12:00:00Z',
    updatedAt: '2026-02-15T12:00:00Z'
  },
  {
    id: 'ky5-earbuds-tiktok-video',
    title: 'KY5 Earbuds Tiktok video',
    slug: 'ky5-earbuds-tiktok-video',
    category: 'Affiliate Marketing',
    shortDescription: '15 seconds video, showing how KY5 earbuds, help to reduce the noise on your...',
    fullDescription: 'A dynamic 15-second high-hook TikTok ad demonstrating how KY5 active noise-canceling earbuds isolate sound even in noisy office and commute environments. Focused on the "Maingay Na Naman?" pain-point hook and crystal clear call audio proof.',
    coverImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    clientOrBrand: 'KY5 Audio',
    toolsUsed: ['Google Veo', 'Google Flow', 'CapCut Pro'],
    externalLink: '',
    isPublished: true,
    order: 3,
    featured: true,
    metrics: '89% Video Completion Rate',
    createdAt: '2026-02-28T09:00:00Z',
    updatedAt: '2026-02-28T09:00:00Z'
  },
  {
    id: 'luxury-perfume-ad-for-prada',
    title: 'luxury perfume ad for Prada',
    slug: 'luxury-perfume-ad-for-prada',
    category: 'Brand Campaign',
    shortDescription: 'This is a 20-second vertical (9:16) luxury perfume ad for Prada, with a dark, sensual,...',
    fullDescription: 'A 20-second vertical (9:16) luxury perfume brand campaign for Prada Paradoxe. Featuring rich dark velvet drapery, warm candlelight ambience, signature triangular bottle geometry, and cinematic camera pans engineered with Google Flow prompting.',
    coverImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    clientOrBrand: 'Prada Milano',
    toolsUsed: ['Google Veo', 'Google Flow', 'CapCut Pro'],
    externalLink: '',
    isPublished: true,
    order: 4,
    featured: false,
    metrics: '3.4M Impressions • Top ROAS',
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-01-20T14:00:00Z'
  },
  {
    id: 'supreme-c',
    title: 'Supreme C',
    slug: 'supreme-c',
    category: 'UGC Ads',
    shortDescription: 'This is a 10-second vertical (9:16) ad for Supreme C, a vitamin C supplement, told a...',
    fullDescription: 'A punchy 10-second vertical (9:16) UGC ad for Supreme C sodium ascorbate vitamin C supplement. Engineered with high-conversion e-commerce TikTok Shop aesthetics, fresh citrus slice visuals, immune & glow benefits, and direct call-to-action.',
    coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616671285442-ba6c3b6f2095?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    clientOrBrand: 'Supreme C Health',
    toolsUsed: ['Google Veo', 'Google Flow', 'CapCut Pro'],
    externalLink: '',
    isPublished: true,
    order: 5,
    featured: false,
    metrics: '$180k+ Generated • 4.1x ROAS',
    createdAt: '2026-02-10T16:00:00Z',
    updatedAt: '2026-02-10T16:00:00Z'
  },
  {
    id: 'luxury-perfume-ad-for-amouage',
    title: 'luxury perfume ad for Amouage...',
    slug: 'luxury-perfume-ad-for-amouage',
    category: 'Brand Campaign',
    shortDescription: 'This is a 20-second vertical (9:16) luxury perfume ad for Amouage Interlude Black Iri...',
    fullDescription: 'A 20-second vertical (9:16) luxury perfume ad for Amouage Interlude Black Iris. Features surreal blue smoke swirls, iridescent glass lighting, royal gold cap textures, and rich atmospheric sound design: "More than a scent. A state of mind."',
    coverImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    clientOrBrand: 'Amouage Luxury Fragrances',
    toolsUsed: ['Google Veo', 'Google Flow', 'CapCut Pro'],
    externalLink: '',
    isPublished: true,
    order: 6,
    featured: false,
    metrics: 'Winner: Best AI Commercial Showcase',
    createdAt: '2026-03-05T11:00:00Z',
    updatedAt: '2026-03-05T11:00:00Z'
  }
];
