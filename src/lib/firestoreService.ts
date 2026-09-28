import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { initialProfileData, initialProjects } from './initialData';
import { ProfileData, Project } from '../types';

const PROFILE_DOC = 'main';
const PROJECTS_COLL = 'projects';
const PROFILE_COLL = 'profile';

/**
 * Fetch profile data from Firestore, falling back to initial data
 */
export async function getProfile(): Promise<ProfileData> {
  try {
    const docRef = doc(db, PROFILE_COLL, PROFILE_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as ProfileData;
      // If profile contains the legacy placeholder corporate ad metrics, upgrade to the beginner strengths
      const hasOldStats = data.stats?.some(
        (s) => s.value === '45M+' || s.value === '3.4x' || s.label === 'ROAS Average'
      );
      if (hasOldStats) {
        data.stats = initialProfileData.stats;
        // Background sync to Firestore so it stays persisted
        setDoc(docRef, { stats: initialProfileData.stats, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
      }
      return data;
    }
  } catch (error) {
    console.warn('Firestore getProfile warning, using fallback:', error);
  }
  return initialProfileData;
}

/**
 * Update profile data in Firestore
 */
export async function updateProfile(data: Partial<ProfileData>): Promise<void> {
  const docRef = doc(db, PROFILE_COLL, PROFILE_DOC);
  const updated = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  await setDoc(docRef, updated, { merge: true });
}

/**
 * Fetch all projects from Firestore, falling back to initial seed if empty
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const collRef = collection(db, PROJECTS_COLL);
    const q = query(collRef, orderBy('order', 'asc'));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const projects: Project[] = [];
      snap.forEach((d) => {
        projects.push({ ...d.data(), id: d.id } as Project);
      });
      return projects;
    }
  } catch (error) {
    console.warn('Firestore getProjects warning, using fallback:', error);
  }
  return initialProjects;
}

/**
 * Save (create or update) a project
 */
export async function saveProject(project: Project): Promise<void> {
  const docRef = doc(db, PROJECTS_COLL, project.id);
  const dataToSave = {
    ...project,
    updatedAt: new Date().toISOString()
  };
  await setDoc(docRef, dataToSave, { merge: true });
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLL, id);
  await deleteDoc(docRef);
}

/**
 * Reorder projects batch update
 */
export async function reorderProjects(projects: Project[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    projects.forEach((proj, idx) => {
      const docRef = doc(db, PROJECTS_COLL, proj.id);
      batch.update(docRef, { order: idx + 1, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error reordering projects in batch, falling back to individual updates:', error);
    for (let i = 0; i < projects.length; i++) {
      await saveProject({ ...projects[i], order: i + 1 });
    }
  }
}

/**
 * Seed Firestore with initial portfolio data
 */
export async function seedInitialFirestore(): Promise<void> {
  try {
    // 1. Save profile
    await updateProfile(initialProfileData);

    // 2. Save all initial projects
    for (const proj of initialProjects) {
      await saveProject(proj);
    }
  } catch (error) {
    console.error('Failed to seed initial Firestore data:', error);
    throw error;
  }
}

/**
 * Compress an image file to a lightweight data URL or blob to guarantee fast, reliable upload
 */
async function compressImageFile(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image or SVG/GIF, return as dataURL directly
    if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
            width = Math.round((img.width * maxHeight) / img.height);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image to Firebase Storage with automatic fallback to optimized compressed Data URL
 */
export async function uploadImage(file: File, folder = 'portfolio'): Promise<string> {
  // First compress the image to ensure quick handling & under 1MB Firestore limit if stored as Data URL
  const compressedDataUrl = await compressImageFile(file, 900, 1100, 0.82);

  // Try uploading to Firebase Storage with a strict 4-second timeout so it never hangs
  const uploadPromise = async (): Promise<string> => {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, path);
    const snap = await uploadBytes(storageRef, file);
    return await getDownloadURL(snap.ref);
  };

  const timeoutPromise = new Promise<string>((_, reject) =>
    setTimeout(() => reject(new Error('Storage upload timed out')), 3500)
  );

  try {
    return await Promise.race([uploadPromise(), timeoutPromise]);
  } catch (storageError) {
    console.warn('Firebase Storage direct upload skipped/timed out; using high-quality compressed image data URL:', storageError);
    return compressedDataUrl;
  }
}

/**
 * Upload a video file directly to Firebase Storage with fallback
 */
export async function uploadVideoFile(file: File): Promise<string> {
  // If file is larger than 100MB, warn user
  if (file.size > 100 * 1024 * 1024) {
    throw new Error('Video file size exceeds 100MB. Please use YouTube/Vimeo/Google Drive link or compress the file.');
  }

  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `videos/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, path);
    const snap = await uploadBytes(storageRef, file, { contentType: file.type || 'video/mp4' });
    return await getDownloadURL(snap.ref);
  } catch (storageError) {
    console.warn('Firebase Storage video direct upload error:', storageError);
    // For smaller video files (< 15MB), fallback to base64 Data URL so local demos work seamlessly
    if (file.size < 15 * 1024 * 1024) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read video file.'));
        reader.readAsDataURL(file);
      });
    }
    throw new Error('Could not upload video file directly to cloud storage. Please paste a YouTube, Vimeo, or Google Drive link instead.');
  }
}
