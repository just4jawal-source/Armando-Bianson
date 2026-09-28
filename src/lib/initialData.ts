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
    id: 'veo-hyper-real-beverage',
    title: 'Aura Elixir: Hyper-Realistic Veo Product Commercial',
    slug: 'aura-elixir-veo-commercial',
    category: 'AI Video Generation',
    shortDescription: 'Cinematic 4K beverage launch commercial created using Google Veo prompting workflows, macro condensation physics, and fluid dynamics.',
    fullDescription: 'Designed a flagship commercial for Aura Elixir utilizing cutting-edge Veo and Google Flow prompting methodologies. Created dynamic camera sweeps across microscopic condensation droplets on frosted glass, seamless transitions from natural botanical sources to the bottled beverage, and custom sound design to highlight crisp carbonation.',
    coverImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    clientOrBrand: 'Aura Botanicals',
    toolsUsed: ['Google Veo', 'Google Flow', 'Premiere Pro', 'DaVinci Resolve', 'Custom Audio'],
    externalLink: '',
    isPublished: true,
    order: 1,
    featured: true,
    metrics: '4.8x ROAS • 2.1M Impressions',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'ugc-tech-gadget-conversion',
    title: 'Nova Sound Pods: High-Hook TikTok UGC Ad Campaign',
    slug: 'nova-sound-pods-ugc-ad',
    category: 'UGC Ads',
    shortDescription: 'Native TikTok & Reels user-generated format testing 6 distinct 3-second visual hooks, driving a 34% drop in CPA.',
    fullDescription: 'Developed and directed a high-energy UGC campaign tailored for viral TikTok and Instagram Reels consumption. Produced raw, authentic testimonials paired with rapid micro-cuts, native text overlays, and dynamic problem-solution narratives. Identified winning hook variation featuring an unexpected sound isolation reveal that scaled past $250k spend profitably.',
    coverImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: '',
    clientOrBrand: 'Nova Audio Tech',
    toolsUsed: ['CapCut Pro', 'Sony FX3', 'After Effects', 'TikTok Creative Center'],
    externalLink: '',
    isPublished: true,
    order: 2,
    featured: true,
    metrics: '+185% CTR • -34% CPA',
    createdAt: '2026-01-18T14:30:00Z',
    updatedAt: '2026-01-18T14:30:00Z'
  },
  {
    id: 'character-consistency-episodic-ai',
    title: 'Krono Chrono: Consistent Character Narrative Campaign',
    slug: 'krono-character-consistency-ad',
    category: 'AI Video Generation',
    shortDescription: 'Multi-scene episodic ad maintaining 100% facial and wardrobe consistency across varying camera angles, lighting, and time periods.',
    fullDescription: 'Solved one of the hardest challenges in generative AI filmmaking: persistent character identity across multi-shot sequences. Created a recurring cyber-noir protagonist traveling through architectural spaces to showcase a high-end luxury watch. Calibrated LoRA weights, seed anchors, and multi-controlNet passes to achieve unified aesthetics and zero uncanny distortion.',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: '',
    clientOrBrand: 'Krono Timepieces',
    toolsUsed: ['Image-to-Video Prompting', 'ControlNet IP-Adapter', 'Runway Gen-3', 'DaVinci Resolve'],
    externalLink: '',
    isPublished: true,
    order: 3,
    featured: true,
    metrics: '89% Video Completion Rate',
    createdAt: '2026-03-01T09:15:00Z',
    updatedAt: '2026-03-01T09:15:00Z'
  },
  {
    id: 'cinematic-broll-automotive',
    title: 'Veloce GT: Precision Cinematic B-Roll & Sound Design',
    slug: 'veloce-gt-cinematic-broll',
    category: 'Cinematic B-Roll',
    shortDescription: 'Moody automotive commercial featuring macro texture shots, high-speed shutter pacing, and spatial Foley audio.',
    fullDescription: 'Captured and crafted high-octane commercial B-roll emphasizing tactile luxury: hand-stitched Italian leather, carbon fiber weaves in golden hour light, and crisp brake caliper responsiveness. Blended high-frame-rate live footage with seamless AI-assisted speed ramps and deep sub-bass acoustic design.',
    coverImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    clientOrBrand: 'Veloce Motors',
    toolsUsed: ['RED Komodo 6K', 'Anamorphic Glass', 'DaVinci Resolve Studio', 'Pro Tools'],
    externalLink: '',
    isPublished: true,
    order: 4,
    featured: false,
    metrics: '3.1M Organic Views',
    createdAt: '2026-01-05T12:00:00Z',
    updatedAt: '2026-01-05T12:00:00Z'
  },
  {
    id: 'affiliate-ecommerce-skincare-bundle',
    title: 'GlowForm Skincare: High-Converting Affiliate Creative Matrix',
    slug: 'glowform-affiliate-creative-matrix',
    category: 'Affiliate Marketing',
    shortDescription: 'Conversion-optimized 9:16 vertical creatives for Facebook and TikTok affiliate funnel with verified unboxing hooks.',
    fullDescription: 'Executed a 12-creative affiliate video matrix targeting cold paid traffic on Meta and TikTok. Structured with proof-led openings, side-by-side split screens, dermatologist reaction clips, and clear call-to-actions offering bundle discounts. Resulted in top-performing creative in the brand’s Q1 affiliate leaderboard.',
    coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80'
    ],
    clientOrBrand: 'GlowForm Labs',
    toolsUsed: ['CapCut', 'Figma (Storyboard)', 'Audition', 'Meta Ads Manager'],
    externalLink: '',
    isPublished: true,
    order: 5,
    featured: false,
    metrics: '$180k+ Generated • 4.1x ROAS',
    createdAt: '2026-02-22T16:45:00Z',
    updatedAt: '2026-02-22T16:45:00Z'
  },
  {
    id: 'product-consistency-ai-sneaker',
    title: 'AeroStride Zero: Multi-Angle AI Product Showcase',
    slug: 'aerostride-product-consistency',
    category: 'Product Commercials',
    shortDescription: 'Zero-hallucination generative commercial maintaining exact sole geometry, knit texture, and brand logo placement.',
    fullDescription: 'A technical benchmark project verifying product consistency in AI commercial workflows. By training conditioned multi-view embeddings, the sneaker was animated rotating through gravity-defying urban environments without altering the proprietary sole tread or stitching patterns.',
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80'
    ],
    clientOrBrand: 'AeroStride Athletics',
    toolsUsed: ['Image-to-Video Workflow', 'Stable Video Diffusion', 'Blender Depth Pass', 'After Effects'],
    externalLink: '',
    isPublished: true,
    order: 6,
    featured: false,
    metrics: 'Winner: Best AI Commercial 2026 Showcase',
    createdAt: '2026-03-12T11:20:00Z',
    updatedAt: '2026-03-12T11:20:00Z'
  }
];
