import React from 'react';
import { ArrowDown, Sparkles, Mail, Play } from 'lucide-react';
import { ProfileData } from '../types';

interface HeroProps {
  profile: ProfileData;
  onViewWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onViewWork }) => {
  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center pt-24 pb-16 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="space-y-8 max-w-4xl">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available for select commercial projects & AI video direction</span>
        </div>

        {/* Creator Name & Tagline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08]">
            {profile.name}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-blue-600 dark:text-blue-500">
            {profile.tagline || 'Build. Automate. Create.'}
          </p>
        </div>

        {/* Core Expertise Narrative */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed max-w-2xl">
          Crafting high-converting <span className="text-neutral-900 dark:text-white font-medium">UGC advertisements</span>, viral TikTok/Reels commercials, and next-generation <span className="text-neutral-900 dark:text-white font-medium">Google Flow & Veo-style AI videos</span> with strict character and product consistency.
        </p>

        {/* Focus Domains Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            'UGC Ads',
            'TikTok / Reels / FB',
            'Google Flow / Veo Video',
            'Character Consistency',
            'Product Commercials',
            'Cinematic B-Roll'
          ].map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={onViewWork}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
          >
            <span>View my work</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>

          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 font-medium text-sm transition-all duration-200"
          >
            <Mail className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <span>Get in touch</span>
          </a>
        </div>
      </div>

      {/* Subtle Bottom Indicators */}
      <div className="pt-16 mt-auto border-t border-neutral-200/60 dark:border-neutral-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {profile.stats?.map((stat, i) => (
          <div key={i} className="space-y-0.5">
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
