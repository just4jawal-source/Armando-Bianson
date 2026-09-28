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
  isDemoAdmin: boolean;
  enableDemoAdmin: () => void;
  disableDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(() => {
    return localStorage.getItem('demo-admin-active') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = isDemoAdmin || (!!user && isAuthorizedAdminEmail(user.email));

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
          'Email/Password sign-in is disabled in this Firebase project. Please click "Continue with Google Account" above, or use "Instant Dashboard Access".'
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
          'Email/Password sign-in is disabled in this Firebase project. Please click "Continue with Google Account" above, or use "Instant Dashboard Access".'
        );
      }
      throw err;
    }
  };

  const logout = async () => {
    setIsDemoAdmin(false);
    localStorage.removeItem('demo-admin-active');
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const enableDemoAdmin = () => {
    setIsDemoAdmin(true);
    localStorage.setItem('demo-admin-active', 'true');
  };

  const disableDemoAdmin = () => {
    setIsDemoAdmin(false);
    localStorage.removeItem('demo-admin-active');
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
        authorizedEmails: authorizedAdminEmails,
        isDemoAdmin,
        enableDemoAdmin,
        disableDemoAdmin
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
