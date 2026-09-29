import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, isAuthorizedAdminEmail, authorizedAdminEmails } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  authorizedEmails: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear legacy demo token if it existed
    try {
      localStorage.removeItem('demo-admin-active');
    } catch (e) {}

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = !!user && isAuthorizedAdminEmail(user.email);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(auth, provider);
    if (!isAuthorizedAdminEmail(userCredential.user.email)) {
      await signOut(auth);
      throw new Error(
        `Access denied. The Google account (${userCredential.user.email}) is not in the authorized admin list: ${authorizedAdminEmails.join(', ')}`
      );
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      if (!isAuthorizedAdminEmail(userCredential.user.email)) {
        // Sign out immediately if not authorized
        await signOut(auth);
        throw new Error(`Access denied. The email ${userCredential.user.email} is not authorized for admin access.`);
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        throw new Error(
          'Email/Password sign-in is not enabled in your Firebase Console. Please enable "Email/Password" in Firebase Console > Authentication > Sign-in method, or click "Continue with Google Account".'
        );
      }
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        throw new Error(
          'Incorrect password or no password set for this email yet. If you need to set or reset your password, click the "Reset / Forgot" tab above!'
        );
      }
      if (err.code === 'auth/wrong-password') {
        throw new Error(
          'Incorrect password. Click the "Reset / Forgot" tab above to receive a password reset link by email.'
        );
      }
      throw err;
    }
  };

  const signup = async (email: string, pass: string) => {
    if (!isAuthorizedAdminEmail(email)) {
      throw new Error(`Unauthorized email. Only specified admin addresses (${authorizedAdminEmails.join(', ')}) can register.`);
    }
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        throw new Error(
          'Email/Password sign-in is not enabled in your Firebase Console. Please enable "Email/Password" in Firebase Console > Authentication > Sign-in method, or click "Continue with Google Account".'
        );
      }
      if (err.code === 'auth/email-already-in-use') {
        throw new Error(
          'This email is already registered! Click "Already set password? Sign in" below to enter your password, or click "Reset password" if you forgot it.'
        );
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('demo-admin-active');
    } catch (e) {}
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        authorizedEmails: authorizedAdminEmails
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
