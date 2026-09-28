import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsGrid } from './components/ProjectsGrid';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  getProfile,
  getProjects,
  saveProject,
  deleteProject,
  reorderProjects,
  updateProfile,
  seedInitialFirestore
} from './lib/firestoreService';
import { initialProfileData, initialProjects } from './lib/initialData';
import { Project, ProfileData } from './types';
import { Loader2 } from 'lucide-react';

function PortfolioApp() {
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return (
      window.location.hash === '#admin' ||
      window.location.pathname.startsWith('/admin')
    );
  });

  const [profile, setProfile] = useState<ProfileData>(initialProfileData);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync URL hash with view
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsAdminView(true);
      } else if (hash.startsWith('#project-')) {
        const projectId = hash.replace('#project-', '');
        const found = projects.find((p) => p.id === projectId || p.slug === projectId);
        if (found) setSelectedProject(found);
      } else {
        setIsAdminView(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [projects]);

  // Initial Firestore Data Fetch
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const [fetchedProfile, fetchedProjects] = await Promise.all([
          getProfile(),
          getProjects()
        ]);

        if (isMounted) {
          setProfile(fetchedProfile);
          setProjects(fetchedProjects);

          // Check if URL directly opened a project
          const hash = window.location.hash;
          if (hash.startsWith('#project-')) {
            const pId = hash.replace('#project-', '');
            const match = fetchedProjects.find((p) => p.id === pId || p.slug === pId);
            if (match) setSelectedProject(match);
          }
        }
      } catch (err) {
        console.warn('Using seeded data due to fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigateToAdmin = () => {
    if (isAdminView) {
      setIsAdminView(false);
      window.location.hash = '';
    } else {
      setIsAdminView(true);
      window.location.hash = '#admin';
    }
  };

  const handleViewPublicSite = () => {
    setIsAdminView(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProject = async (saved: Project) => {
    await saveProject(saved);
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy.sort((a, b) => a.order - b.order);
      }
      return [...prev, saved].sort((a, b) => a.order - b.order);
    });
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReorderProjects = async (reordered: Project[]) => {
    setProjects(reordered);
    await reorderProjects(reordered);
  };

  const handleSaveProfile = async (updated: ProfileData) => {
    await updateProfile(updated);
    setProfile(updated);
  };

  const handleResetSeedData = async () => {
    await seedInitialFirestore();
    const [freshProfile, freshProjects] = await Promise.all([
      getProfile(),
      getProjects()
    ]);
    setProfile(freshProfile);
    setProjects(freshProjects);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    window.history.pushState(null, '', `#project-${project.slug || project.id}`);
  };

  const handleCloseProjectModal = () => {
    setSelectedProject(null);
    window.history.pushState(null, '', window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0c0c0e] text-[#121212] dark:text-[#f0f0f0] flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onNavigateToAdmin={handleNavigateToAdmin}
        isAdminView={isAdminView}
      />

      {/* Main Content View */}
      {isAdminView ? (
        <AdminDashboard
          projects={projects}
          profile={profile}
          onUpdateProjects={setProjects}
          onUpdateProfile={setProfile}
          onSaveProject={handleSaveProject}
          onDeleteProject={handleDeleteProject}
          onReorderProjects={handleReorderProjects}
          onSaveProfile={handleSaveProfile}
          onResetSeedData={handleResetSeedData}
          onViewPublicSite={handleViewPublicSite}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            profile={profile}
            onViewWork={() => {
              const el = document.getElementById('work');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Work / Projects Grid */}
          <ProjectsGrid
            projects={projects}
            isLoading={loading}
            onSelectProject={handleSelectProject}
          />

          {/* About Section */}
          <AboutSection profile={profile} />

          {/* Contact Section */}
          <ContactSection profile={profile} />

          {/* Project Details Modal / Overlay */}
          <ProjectDetailModal
            project={selectedProject}
            onClose={handleCloseProjectModal}
          />
        </main>
      )}

      {/* Footer */}
      {!isAdminView && <Footer onNavigateToAdmin={handleNavigateToAdmin} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
