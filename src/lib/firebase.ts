import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore (with explicit databaseId if specified)
export const db = (() => {
  try {
    if (firebaseConfig.firestoreDatabaseId) {
      return getFirestore(app, firebaseConfig.firestoreDatabaseId);
    }
    return getFirestore(app);
  } catch (error) {
    console.warn('Initializing default firestore due to:', error);
    return getFirestore(app);
  }
})();

// Initialize Storage
export const storage = getStorage(app);

export const authorizedAdminEmails = [
  'arman.bianson@yahoo.com',
  'just4jawal@gmail.com'
];

export const isAuthorizedAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return authorizedAdminEmails.some(adminEmail => adminEmail.toLowerCase() === normalized);
};

export default app;
