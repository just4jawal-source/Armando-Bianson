import React, { useState } from 'react';
import { Mail, Copy, Check, ArrowUpRight, MessageSquare, Video, Globe } from 'lucide-react';
import { ProfileData } from '../types';

interface ContactSectionProps {
  profile: ProfileData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socials = [
    { name: 'TikTok', url: profile.socialLinks?.tiktok },
    { name: 'Instagram', url: profile.socialLinks?.instagram },
    { name: 'YouTube', url: profile.socialLinks?.youtube },
    { name: 'LinkedIn', url: profile.socialLinks?.linkedin },
    { name: 'X / Twitter', url: profile.socialLinks?.twitter }
  ].filter((s) => Boolean(s.url && s.url.trim()));

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-blue-600 dark:text-blue-400">
            Let's Collaborate
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Have a project or campaign in mind?
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light max-w-xl mx-auto">
            Available for brand commercials, UGC ad production, Veo AI generative video sequences, and creative consulting.
          </p>
        </div>

        {/* Email Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200/90 dark:border-neutral-800/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
              Direct Inquiries
            </span>
            <span className="text-lg sm:text-xl font-medium text-neutral-900 dark:text-white font-mono selection:bg-blue-600">
              {profile.email}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={copyEmail}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to clipboard' : 'Copy email'}</span>
            </button>

            <a
              href={`mailto:${profile.email}?subject=Collaboration%20Inquiry%20-%20Armando%20Bianson`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="pt-4 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
              Connect Across Channels
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all border border-neutral-200/60 dark:border-neutral-800/60"
                >
                  <span>{social.name}</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
