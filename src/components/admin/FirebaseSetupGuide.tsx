import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, ShieldCheck, Database, Key, Cloud } from 'lucide-react';

interface FirebaseSetupGuideProps {
  onClose: () => void;
}

export const FirebaseSetupGuide: React.FC<FirebaseSetupGuideProps> = ({ onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthorizedAdmin() {
      return request.auth != null && (
        request.auth.token.email == 'arman.bianson@yahoo.com' ||
        request.auth.token.email == 'just4jawal@gmail.com'
      );
    }
    match /{document=**} {
      allow read: if true;
      allow write: if isAuthorizedAdmin();
    }
  }
}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6 animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111215] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              Firebase Connection & Deployment Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Enable Firebase Email/Password Authentication</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 pl-7 text-xs leading-relaxed">
              In your <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a>, go to <strong>Build &gt; Authentication &gt; Sign-in method</strong>, click <strong>Email/Password</strong> and toggle it <strong>Enabled</strong>. Add your email (<code>arman.bianson@yahoo.com</code>) under the Users tab or sign up via the Admin portal.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Enable Cloud Firestore & Deploy Security Rules</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 pl-7 text-xs leading-relaxed">
              In the Firebase Console, go to <strong>Build &gt; Firestore Database</strong>. Your project already includes <code>firestore.rules</code> with public read and authenticated admin email writes:
            </p>
            <div className="pl-7 relative">
              <pre className="p-3 rounded-lg bg-neutral-950 text-neutral-200 font-mono text-[11px] overflow-x-auto border border-neutral-800">
                {sampleRules}
              </pre>
              <button
                onClick={() => copyToClipboard(sampleRules, 'rules')}
                className="absolute top-2 right-2 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] flex items-center gap-1"
              >
                {copiedKey === 'rules' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'rules' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Firebase Storage (For Media Uploads)</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 pl-7 text-xs leading-relaxed">
              Go to <strong>Build &gt; Storage</strong>, click <strong>Get Started</strong>. This app supports both direct Firebase Storage uploads AND automatic high-performance Base64 fallbacks, so image uploads work in any environment.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                4
              </span>
              <span>Deploying to Production</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 pl-7 text-xs leading-relaxed">
              To deploy your site on Firebase Hosting or Vercel:
            </p>
            <div className="pl-7">
              <code className="block p-2 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300 font-mono text-xs">
                npm run build<br />
                firebase deploy --only hosting
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium cursor-pointer"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
