import React from 'react';
import { CheckCircle2, Video, Bot, Layers, Sparkles } from 'lucide-react';
import { ProfileData } from '../types';
import { BlurImage } from './BlurImage';

interface AboutSectionProps {
  profile: ProfileData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Photo & Portrait */}
        <div className="md:col-span-5 space-y-4">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-sm group">
            <BlurImage
              src={profile.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
              alt={profile.name}
              className="group-hover:scale-102 duration-500"
              containerClassName="w-full h-full"
            />
            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-5 left-5 right-5 z-20 text-white pointer-events-none">
              <p className="text-lg font-bold">{profile.name}</p>
              <p className="text-xs text-neutral-300 font-light">{profile.tagline}</p>
            </div>
          </div>

          {/* Quick Details Box */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
            <div className="flex justify-between items-center">
              <span>Location:</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">{profile.location || 'Remote / Worldwide'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Status:</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {profile.availableForWork ? 'Accepting new projects' : 'Booked out'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Core Disciplines */}
        <div className="md:col-span-7 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-blue-600 dark:text-blue-400">
              About Me
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mt-1">
              Creative Strategy Meets Generative Precision
            </h2>
          </div>

          <div className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed space-y-4 font-light whitespace-pre-line">
            {profile.bio}
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900/30 border border-neutral-200/70 dark:border-neutral-800/70 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-medium text-sm">
                <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>UGC & Paid Ad Creative</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                Direct-response psychology, aggressive 3-second hook testing, native platform pacing, and retention engineering for TikTok, Reels, & Meta.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900/30 border border-neutral-200/70 dark:border-neutral-800/70 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-medium text-sm">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Google Flow & Veo Generation</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                State-of-the-art text-to-video and image-to-video prompting, strict multi-shot character identity, and zero-distortion product consistency.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900/30 border border-neutral-200/70 dark:border-neutral-800/70 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-medium text-sm">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Product Commercials & B-Roll</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                High-end tactile cinematography, macro lighting, condensation physics, and synchronized spatial sound design.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900/30 border border-neutral-200/70 dark:border-neutral-800/70 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-medium text-sm">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Affiliate Video Funnels</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                Scalable video matrices for e-commerce, software, and brand partner campaigns designed to convert cold audiences.
              </p>
            </div>
          </div>

          {/* Skills checklist */}
          <div className="pt-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-3">
              Capabilities & Workflows
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/70 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
