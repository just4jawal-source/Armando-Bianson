import React, { useState } from 'react';
import {
  Layers,
  User,
  Mail,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  RefreshCw,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Upload,
  Lock,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Project, ProfileData, StatItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ProjectEditorModal } from './ProjectEditorModal';
import { FirebaseSetupGuide } from './FirebaseSetupGuide';
import { uploadImage } from '../../lib/firestoreService';
import { BlurImage } from '../BlurImage';

interface AdminDashboardProps {
  projects: Project[];
  profile: ProfileData;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateProfile: (profile: ProfileData) => void;
  onSaveProject: (project: Project) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onReorderProjects: (projects: Project[]) => Promise<void>;
  onSaveProfile: (profile: ProfileData) => Promise<void>;
  onResetSeedData: () => Promise<void>;
  onViewPublicSite: () => void;
}

type TabType = 'projects' | 'about' | 'contact' | 'system';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  profile,
  onUpdateProjects,
  onUpdateProfile,
  onSaveProject,
  onDeleteProject,
  onReorderProjects,
  onSaveProfile,
  onResetSeedData,
  onViewPublicSite
}) => {
  const {
    user,
    isAdmin,
    login,
    signup,
    loginWithGoogle,
    logout,
    isDemoAdmin,
    enableDemoAdmin,
    authorizedEmails
  } = useAuth();

  // Auth Form State - default to current user's email or primary admin
  const [emailInput, setEmailInput] = useState('just4jawal@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('projects');

  // Modals State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState<ProfileData>(profile);
  const [profileSaving, setProfileSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Reset Seeding State
  const [isResetting, setIsResetting] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle Login / Signup
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        await login(emailInput, passwordInput);
      } else {
        await signup(emailInput, passwordInput);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Google One-Click Login
  const handleGoogleLogin = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // If NOT logged in / not authorized admin: Show Login Form
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#FAFAFA] dark:bg-[#0c0c0e]">
        <div className="w-full max-w-md bg-white dark:bg-[#111215] rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Admin Authentication
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Authorized Admins: <span className="font-mono text-blue-600 dark:text-blue-400">just4jawal@gmail.com</span> &bull; <span className="font-mono text-neutral-500">arman.bianson@yahoo.com</span>
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold">Notice:</span>
              </div>
              <p className="leading-relaxed pl-6">{authError}</p>
              <div className="pl-6 pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={enableDemoAdmin}
                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] transition-colors cursor-pointer"
                >
                  Bypass with Instant Access &rarr;
                </button>
              </div>
            </div>
          )}

          {/* 1-Click Google Sign In (Firebase Recommended) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || authLoading}
            className="w-full py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 font-medium text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {googleLoading ? (
              <span>Connecting to Google...</span>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Account</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Or with Email</span>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Quick email selector buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg text-[11px]">
            <button
              type="button"
              onClick={() => setEmailInput('just4jawal@gmail.com')}
              className={`flex-1 py-1 rounded text-center truncate px-2 transition-all cursor-pointer ${
                emailInput === 'just4jawal@gmail.com'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              just4jawal@gmail.com
            </button>
            <button
              type="button"
              onClick={() => setEmailInput('arman.bianson@yahoo.com')}
              className={`flex-1 py-1 rounded text-center truncate px-2 transition-all cursor-pointer ${
                emailInput === 'arman.bianson@yahoo.com'
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              arman.bianson@yahoo.com
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="just4jawal@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading || googleLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Sign In' : 'Create Admin Password'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Preview Option */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center space-y-2.5">
            <p className="text-xs text-neutral-500">
              Need immediate access to manage projects without logging in?
            </p>
            <button
              type="button"
              onClick={enableDemoAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer w-full justify-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Instant Dashboard Access (Bypass Login)</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
              }}
              className="hover:underline text-blue-600 cursor-pointer"
            >
              {authMode === 'login' ? 'Set new password / Register' : 'Already set password? Sign in'}
            </button>
            <button
              type="button"
              onClick={onViewPublicSite}
              className="hover:underline cursor-pointer"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Project Publishing Toggle
  const handleTogglePublish = async (proj: Project) => {
    try {
      const updated = { ...proj, isPublished: !proj.isPublished };
      await onSaveProject(updated);
      showToast(`Project "${proj.title}" is now ${updated.isPublished ? 'published' : 'draft'}.`);
    } catch (err) {
      showToast('Failed to update project status.');
    }
  };

  // Handle Project Delete
  const handleDelete = async (proj: Project) => {
    if (confirm(`Are you sure you want to delete "${proj.title}"?`)) {
      try {
        await onDeleteProject(proj.id);
        showToast(`Deleted "${proj.title}"`);
      } catch (err) {
        showToast('Failed to delete project.');
      }
    }
  };

  // Handle Project Move Up/Down
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // re-assign orders
    newProjects.forEach((p, idx) => {
      p.order = idx + 1;
    });

    onUpdateProjects(newProjects);
    await onReorderProjects(newProjects);
    showToast('Reordered projects.');
  };

  // Handle Profile Save
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      await onSaveProfile(profileForm);
      onUpdateProfile(profileForm);
      showToast('Profile updated successfully in Firestore.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      showToast('Processing & uploading photo...');
      const url = await uploadImage(file, 'profile');
      
      const updatedProfile = { ...profileForm, photoUrl: url };
      setProfileForm(updatedProfile);
      
      // Auto-save to Firestore so user doesn't lose the photo change
      await onSaveProfile(updatedProfile);
      onUpdateProfile(updatedProfile);
      
      showToast('Profile photo updated & saved successfully!');
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      showToast('Failed to upload profile photo. Please try another image.');
    } finally {
      setUploadingAvatar(false);
      // Reset input value so user can re-upload if needed
      e.target.value = '';
    }
  };

  // Handle Seed Reset
  const handleResetData = async () => {
    if (confirm('This will reset your portfolio projects and profile to the complete starter showcase. Continue?')) {
      try {
        setIsResetting(true);
        await onResetSeedData();
        showToast('Successfully restored initial showcase data!');
      } catch (err: any) {
        showToast('Failed to reset data.');
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0c0c0e] text-neutral-900 dark:text-neutral-100 pt-20 pb-24">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111215] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
                Portfolio Admin Center
              </h1>
              {isDemoAdmin && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                  Preview Admin Mode
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Authenticated as: <span className="font-mono text-neutral-800 dark:text-neutral-200">{user?.email || 'arman.bianson@yahoo.com (Demo)'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowGuide(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
              <span>Firebase Guide</span>
            </button>

            <button
              onClick={onViewPublicSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Manage Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'about'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Edit About & Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'contact'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Edit Contact & Links</span>
          </button>
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                  Projects & Creatives Showcase
                </h2>
                <p className="text-xs text-neutral-500">
                  Manage your portfolio pieces. Click "+ Add Project" to upload a new video ad or creative.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetData}
                  disabled={isResetting}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Reset showcase with starter templates"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                  <span>Restore Starter Projects</span>
                </button>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsEditorOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Project</span>
                </button>
              </div>
            </div>

            {/* Beginner Quick Tip Bar */}
            <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>
                  <strong>Tip for beginners:</strong> You can reorder projects using the up/down arrows (highest appears first). Use the eye icon to show or hide a project anytime.
                </span>
              </div>
            </div>

            {/* Projects Table / List */}
            <div className="bg-white dark:bg-[#111215] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800">
              {projects.length === 0 ? (
                <div className="p-12 text-center text-sm text-neutral-500">
                  No projects yet. Click "Add Project" or "Restore Seed Data".
                </div>
              ) : (
                projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40 transition-colors"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-4">
                      {/* Order Controls */}
                      <div className="flex flex-col gap-1 items-center">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          aria-label="Move up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                          {proj.order || idx + 1}
                        </span>
                        <button
                          disabled={idx === projects.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          aria-label="Move down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Thumbnail */}
                      <div className="w-16 h-12 rounded-lg bg-neutral-900 overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                        <BlurImage
                          src={proj.coverImage}
                          alt={proj.title}
                          containerClassName="w-full h-full"
                        />
                      </div>

                      {/* Info */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-1">
                            {proj.title}
                          </h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              proj.isPublished !== false
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            {proj.isPublished !== false ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-1">
                          {proj.category} {proj.clientOrBrand ? `• ${proj.clientOrBrand}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleTogglePublish(proj)}
                        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title={proj.isPublished ? 'Unpublish to draft' : 'Publish to live site'}
                      >
                        {proj.isPublished !== false ? (
                          <Eye className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setIsEditorOpen(true);
                        }}
                        className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(proj)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: EDIT ABOUT & BIO */}
        {activeTab === 'about' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                  About & Creative Bio
                </h2>
                <p className="text-xs text-neutral-500">
                  Update your name, tagline, background, and headshot.
                </p>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {profileSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="bg-white dark:bg-[#111215] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
              {/* Photo & Basic details */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                    Profile Photo
                  </label>
                  <div className="relative w-32 h-40 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <BlurImage
                      src={profileForm.photoUrl}
                      alt={profileForm.name}
                      containerClassName="w-full h-full"
                    />
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 text-white">
                        <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                        <span className="text-[10px] font-medium">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium cursor-pointer transition-colors ${uploadingAvatar ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingAvatar ? 'Uploading...' : 'Change Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={profileForm.tagline}
                        onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                        placeholder="Build. Automate. Create."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Photo URL (Direct Link)
                    </label>
                    <input
                      type="text"
                      value={profileForm.photoUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Full Creative Bio
                </label>
                <textarea
                  rows={5}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Detail your UGC advertising, Veo generative video, character and product consistency, and cinematic commercial experience..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm leading-relaxed"
                />
              </div>

              {/* Skills Editor */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Skills & Capabilities (comma separated)
                </label>
                <input
                  type="text"
                  value={profileForm.skills ? profileForm.skills.join(', ') : ''}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>

              {/* Highlight Badges / Strengths Editor */}
              <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Hero Strengths & Highlights (4 Key Offerings)
                  </label>
                  <span className="text-[11px] text-neutral-400">Shows under hero header</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(profileForm.stats || []).map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 space-y-2"
                    >
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5">
                          Value / Metric
                        </span>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...(profileForm.stats || [])];
                            newStats[idx] = { ...newStats[idx], value: e.target.value };
                            setProfileForm({ ...profileForm, stats: newStats });
                          }}
                          placeholder="e.g. 24–48h"
                          className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-0.5">
                          Label
                        </span>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...(profileForm.stats || [])];
                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                            setProfileForm({ ...profileForm, stats: newStats });
                          }}
                          placeholder="e.g. Turnaround Time"
                          className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: EDIT CONTACT & SOCIAL LINKS */}
        {activeTab === 'contact' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                  Contact & Social Profiles
                </h2>
                <p className="text-xs text-neutral-500">
                  Manage your inquiry email and connected platforms.
                </p>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {profileSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="bg-white dark:bg-[#111215] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Inquiry Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Location / Availability
                  </label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="Worldwide / Remote"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                    Social & Content Channels
                  </h3>
                  <span className="text-[11px] text-neutral-400">
                    Leave blank any you don't use — they will auto-hide from your site
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 dark:text-neutral-400">TikTok Profile URL</label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.tiktok || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socialLinks: { ...profileForm.socialLinks, tiktok: e.target.value }
                        })
                      }
                      placeholder="https://tiktok.com/@..."
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 dark:text-neutral-400">Instagram Profile URL</label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.instagram || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socialLinks: { ...profileForm.socialLinks, instagram: e.target.value }
                        })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 dark:text-neutral-400">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.youtube || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socialLinks: { ...profileForm.socialLinks, youtube: e.target.value }
                        })
                      }
                      placeholder="https://youtube.com/@..."
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 dark:text-neutral-400">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.linkedin || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socialLinks: { ...profileForm.socialLinks, linkedin: e.target.value }
                        })
                      }
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 dark:text-neutral-400">X / Twitter URL</label>
                    <input
                      type="url"
                      value={profileForm.socialLinks.twitter || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socialLinks: { ...profileForm.socialLinks, twitter: e.target.value }
                        })
                      }
                      placeholder="https://x.com/..."
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Project Editor Modal */}
      {isEditorOpen && (
        <ProjectEditorModal
          isOpen={isEditorOpen}
          project={editingProject}
          existingProjectsCount={projects.length}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingProject(null);
          }}
          onSave={onSaveProject}
        />
      )}

      {/* Firebase Setup Guide Modal */}
      {showGuide && (
        <FirebaseSetupGuide onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
};
