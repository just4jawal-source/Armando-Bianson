import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Image, Link, Check, AlertCircle, Sparkles, Video, Play, CheckCircle2, Loader2 } from 'lucide-react';
import { Project } from '../../types';
import { uploadImage, uploadVideoFile } from '../../lib/firestoreService';

interface ProjectEditorModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => Promise<void>;
  existingProjectsCount: number;
}

const CATEGORIES = [
  'UGC Ads',
  'AI Video Generation',
  'Product Commercials',
  'Affiliate Marketing',
  'Cinematic B-Roll',
  'Brand Campaign'
];

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
  existingProjectsCount
}) => {
  const isEditing = !!project;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('UGC Ads');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [clientOrBrand, setClientOrBrand] = useState('');
  const [metrics, setMetrics] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [order, setOrder] = useState(1);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadedVideoName, setUploadedVideoName] = useState('');
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setSlug(project.slug || '');
      setCategory(project.category || 'UGC Ads');
      setShortDescription(project.shortDescription || '');
      setFullDescription(project.fullDescription || '');
      setCoverImage(project.coverImage || '');
      setGalleryImages(project.galleryImages || []);
      setVideoUrl(project.videoUrl || '');
      setClientOrBrand(project.clientOrBrand || '');
      setMetrics(project.metrics || '');
      setToolsInput(project.toolsUsed ? project.toolsUsed.join(', ') : '');
      setExternalLink(project.externalLink || '');
      setIsPublished(project.isPublished !== false);
      setOrder(project.order || 1);
      setUploadedVideoName('');
      setUploadSuccessNotice(null);
    } else {
      // New project default values
      setTitle('');
      setSlug('');
      setCategory('UGC Ads');
      setShortDescription('');
      setFullDescription('');
      setCoverImage('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80');
      setGalleryImages([]);
      setVideoUrl('');
      setClientOrBrand('');
      setMetrics('');
      setToolsInput('Google Veo, CapCut Pro, Premiere Pro');
      setExternalLink('');
      setIsPublished(true);
      setOrder(existingProjectsCount + 1);
      setUploadedVideoName('');
      setUploadSuccessNotice(null);
    }
    setError(null);
  }, [project, isOpen, existingProjectsCount]);

  if (!isOpen) return null;

  // Auto-generate slug when title changes in new project mode
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      setError(null);
      const url = await uploadImage(file, 'covers');
      setCoverImage(url);
    } catch (err: any) {
      setError(err.message || 'Failed to process cover image.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      setError(null);
      setUploadSuccessNotice(null);
      setUploadedVideoName(file.name);
      const url = await uploadVideoFile(file);
      setVideoUrl(url);
      setUploadSuccessNotice(`"${file.name}" uploaded successfully!`);
    } catch (err: any) {
      setError(err.message || 'Failed to upload video file. Try a YouTube or Vimeo link.');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingGallery(true);
      setError(null);
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], 'gallery');
        uploadedUrls.push(url);
      }
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload gallery images.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addGalleryUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setGalleryImages((prev) => [...prev, url.trim()]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a project title.');
      return;
    }
    if (!coverImage.trim()) {
      setError('Please provide a cover image URL or upload one.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const toolsUsed = toolsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const projectData: Project = {
        id: project?.id || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        title: title.trim(),
        slug: slug.trim() || `project-${Date.now()}`,
        category,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        coverImage: coverImage.trim(),
        galleryImages,
        videoUrl: videoUrl.trim(),
        clientOrBrand: clientOrBrand.trim(),
        metrics: metrics.trim(),
        toolsUsed,
        externalLink: externalLink.trim(),
        isPublished,
        order: Number(order) || 1,
        createdAt: project?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSave(projectData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save project. Check Firestore connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6 animate-fade-in"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#111215] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              {isEditing ? `Edit Project: ${project.title}` : 'Add New Project'}
            </h2>
            <p className="text-xs text-neutral-500">
              Only a title, short description, and cover image are required to get started.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Beginner Tip Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="font-semibold">Beginner Guide:</span>
              <p className="leading-relaxed opacity-90">
                You don't need complicated tech skills! To show a video ad, simply upload a cover photo, type what you created, and paste your video link (from YouTube, Vimeo, TikTok, or Google Drive/MP4).
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                1. Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Energy Drink TikTok Ad"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                URL Address (Auto-created)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="energy-drink-tiktok-ad"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono text-xs"
              />
            </div>
          </div>

          {/* Category & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Client / Brand Name
              </label>
              <input
                type="text"
                value={clientOrBrand}
                onChange={(e) => setClientOrBrand(e.target.value)}
                placeholder="e.g. Aura Botanicals"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              2. Brief Summary (What is this video/ad about?) *
            </label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. 15-second TikTok video showing how to use the portable blender, with high-converting hook."
              className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          {/* Video URL & File Upload */}
          <div className="space-y-3 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                3. Video Link or Upload Video File
              </label>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Embeds directly on site</span>
            </div>

            {/* In-progress upload banner */}
            {uploadingVideo && (
              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100 text-xs animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Uploading video: {uploadedVideoName || 'your video file'}...</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    Processing video and saving to cloud storage. Please keep this window open...
                  </p>
                </div>
              </div>
            )}

            {/* Upload Success Badge */}
            {uploadSuccessNotice && !uploadingVideo && (
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-700 dark:text-emerald-300">Video uploaded successfully!</p>
                    <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400">{uploadSuccessNotice}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/80 px-2 py-1 rounded text-emerald-800 dark:text-emerald-200">
                  Ready to save
                </span>
              </div>
            )}

            {/* Video preview if present */}
            {videoUrl && !uploadingVideo && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-500" />
                    <span>Video Attached & Ready to Play</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('');
                      setUploadSuccessNotice(null);
                      setUploadedVideoName('');
                    }}
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Video</span>
                  </button>
                </div>

                <div className="relative aspect-video max-h-56 rounded-lg overflow-hidden bg-black border border-neutral-300 dark:border-neutral-700 shadow-inner">
                  {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={
                        videoUrl.includes('watch?v=')
                          ? videoUrl.replace('watch?v=', 'embed/').split('&')[0]
                          : videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                      }
                      title="Video preview"
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  setUploadSuccessNotice(null);
                }}
                disabled={uploadingVideo}
                placeholder="Paste YouTube, Vimeo, TikTok link, or MP4 URL"
                className="flex-1 w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm disabled:opacity-60"
              />

              <label className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-white text-xs font-medium cursor-pointer transition-colors shadow-xs flex-shrink-0 ${
                uploadingVideo ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}>
                {uploadingVideo ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{uploadingVideo ? 'Uploading...' : 'Upload Video File'}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/*"
                  onChange={handleVideoUpload}
                  disabled={uploadingVideo}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed">
              💡 <strong>How to know it's done:</strong> Once your video file finishes uploading, the button turns back to normal, a green <strong>"Video uploaded successfully!"</strong> box appears, and your video immediately plays in the preview box above. Then simply click <strong>"Save Project"</strong> at the bottom!
            </p>
          </div>

          {/* Cover Image Upload / URL */}
          <div className="space-y-2 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 block">
              4. Cover Picture / Video Thumbnail *
            </label>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {coverImage ? (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 flex-shrink-0 bg-neutral-900">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-20 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center flex-shrink-0 text-neutral-400">
                  <Image className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCover ? 'Uploading...' : 'Upload Image from Computer'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    or paste image link below
                  </span>
                </div>

                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Full Description (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Full Story / Details (Optional)
              </label>
              <span className="text-[11px] text-neutral-400">Optional</span>
            </div>
            <textarea
              rows={3}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="What made this video special? (e.g. 'Used CapCut for fast transitions, targeted TikTok audience interested in fitness gadgets.')"
              className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm leading-relaxed"
            />
          </div>

          {/* Gallery Images */}
          <div className="space-y-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Gallery Images ({galleryImages.length})
              </label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-[11px] font-medium cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>{uploadingGallery ? 'Uploading...' : 'Upload Images'}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    disabled={uploadingGallery}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={addGalleryUrl}
                  className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-[11px] font-medium"
                >
                  + Add URL
                </button>
              </div>
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metrics & External Links (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Highlight / Metric Badge
                </label>
                <span className="text-[11px] text-neutral-400">Optional</span>
              </div>
              <input
                type="text"
                value={metrics}
                onChange={(e) => setMetrics(e.target.value)}
                placeholder="e.g. Concept Video or 3-Sec Hook Test"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  External Social Link
                </label>
                <span className="text-[11px] text-neutral-400">Optional</span>
              </div>
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="Leave blank or paste TikTok/IG post link"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          {/* Tools & Video URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Tools Used (comma separated)
              </label>
              <input
                type="text"
                value={toolsInput}
                onChange={(e) => setToolsInput(e.target.value)}
                placeholder="Google Veo, CapCut Pro, DaVinci Resolve"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Video URL (Optional)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          {/* Publishing & Ordering */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-neutral-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Publish immediately (visible on public site)</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">Display Order:</span>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-16 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-center font-mono"
              />
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? <span>Saving to Firestore...</span> : <span>Save Project</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
