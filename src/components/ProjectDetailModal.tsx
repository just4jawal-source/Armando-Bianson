import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ArrowLeft, Calendar, Tag, Layers, CheckCircle2, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { Project } from '../types';
import { BlurImage } from './BlurImage';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    // Reset active image when project changes
    setActiveImageIndex(0);

    // Prevent body scroll when modal is open
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  const allImages = [
    project.coverImage,
    ...(project.galleryImages || [])
  ].filter(Boolean);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center items-start sm:p-6 md:p-10 animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-[#FAFAFA] dark:bg-[#111215] text-neutral-900 dark:text-neutral-100 rounded-none sm:rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-0 sm:my-8 transition-all">
        {/* Sticky Header with Back/Close button */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#FAFAFA]/95 dark:bg-[#111215]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to projects</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close project view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-10 space-y-8">
          {/* Project Title & Metadata Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium">
                {project.category}
              </span>
              {project.clientOrBrand && (
                <span className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                  Client: {project.clientOrBrand}
                </span>
              )}
              {project.metrics && (
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
                  {project.metrics}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              {project.title}
            </h1>

            <p className="text-base text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Direct Video Player Embed if videoUrl exists */}
          {project.videoUrl && (
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                Video Creative Demonstration
              </span>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-neutral-200 dark:border-neutral-800 shadow-md">
                {project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={
                      project.videoUrl.includes('watch?v=')
                        ? project.videoUrl.replace('watch?v=', 'embed/').split('&')[0]
                        : project.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                    }
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : project.videoUrl.includes('vimeo.com') ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${project.videoUrl.split('/').pop()}`}
                    title={project.title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : project.videoUrl.startsWith('data:video') ||
                    project.videoUrl.startsWith('blob:') ||
                    project.videoUrl.includes('.mp4') ||
                    project.videoUrl.includes('.webm') ||
                    project.videoUrl.includes('firebasestorage.googleapis.com') ? (
                  <video
                    src={project.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    poster={project.coverImage}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-white">
                    <p className="text-sm font-medium mb-3">Watch this creative video on the platform:</p>
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
                    >
                      <span>Open Video Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Gallery Showcase (Sample Frames) */}
          {allImages.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                Visual Frames & Stills
              </span>
              <div className="relative aspect-[16/9] w-full bg-neutral-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                <BlurImage
                  key={allImages[activeImageIndex]}
                  src={allImages[activeImageIndex]}
                  alt={`${project.title} preview ${activeImageIndex + 1}`}
                  containerClassName="w-full h-full bg-neutral-950"
                  className="!object-contain"
                  priority={true}
                />

                {/* Left/Right navigation controls if multiple images */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm transition-colors cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm transition-colors cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-3 right-3 z-20 text-[11px] px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-white font-mono">
                      {activeImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails row */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-blue-600 ring-2 ring-blue-600/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <BlurImage
                        src={img}
                        alt="thumbnail"
                        containerClassName="w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Full Description & Deep Dive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80">
            {/* Left 2 Cols: Comprehensive Narrative */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm uppercase tracking-wider font-semibold text-neutral-400">
                Creative Process & Execution
              </h2>
              <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4 text-sm sm:text-base font-light whitespace-pre-line">
                {project.fullDescription || project.shortDescription}
              </div>

              {project.videoUrl && (
                <div className="pt-4">
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    <span>Watch Full Video / Creative Demonstration</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Right 1 Col: Quick Info & Action CTA */}
            <div className="space-y-6 bg-white dark:bg-neutral-900/60 p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 self-start">
              {/* Action Button: Live Campaign link only if provided, otherwise Request a Video CTA */}
              <div>
                {project.externalLink ? (
                  <a
                    href={project.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wide uppercase transition-all shadow-sm"
                  >
                    <span>View Live Post / Ad</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      const contactElem = document.getElementById('contact');
                      if (contactElem) {
                        contactElem.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wide uppercase transition-all shadow-sm cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Inquire About Similar Video</span>
                  </button>
                )}
              </div>

              {/* Tools Used */}
              {project.toolsUsed && project.toolsUsed.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                    Tools & Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.toolsUsed.map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{project.category}</span>
                </div>
                {project.clientOrBrand && (
                  <div className="flex justify-between">
                    <span>Client</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{project.clientOrBrand}</span>
                  </div>
                )}
                {project.createdAt && (
                  <div className="flex justify-between">
                    <span>Published</span>
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
