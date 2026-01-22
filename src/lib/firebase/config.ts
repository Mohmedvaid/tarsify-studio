import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { env, validateEnv, logEnvStatus } from '@/lib/env';

// Validate and log environment status in development
if (typeof window !== 'undefined') {
  const { valid, missing } = validateEnv();
  
  if (process.env.NODE_ENV === 'development') {
    logEnvStatus();
  }
  
  if (!valid) {
    console.error('❌ Firebase cannot initialize without required environment variables:', missing);
  }
}

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

// Initialize Firebase only on client side and only once
let app: FirebaseApp;
let auth: Auth;

if (typeof window !== 'undefined') {
  // Only initialize if we have the required config
  if (env.firebase.apiKey && env.firebase.projectId) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
      auth = getAuth(app);
      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      throw error;
    }
  } else {
    console.error('❌ Firebase config missing - check your .env.local file');
    app = {} as FirebaseApp;
    auth = {} as Auth;
  }
} else {
  // Server-side: create a dummy auth object that won't be used
  app = {} as FirebaseApp;
  auth = {} as Auth;
}

export { app, auth };
