/**
 * Environment variable validation
 * This file validates that all required environment variables are set
 * and provides type-safe access to them
 * 
 * IMPORTANT: For Next.js to inline NEXT_PUBLIC_* variables at build time,
 * we must access them directly as process.env.NEXT_PUBLIC_XXX (not dynamically)
 */

// Type-safe environment configuration
// These are accessed directly so Next.js can inline them at build time
export const env = {
  // API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',

  // Firebase
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  },
} as const;

// Validation function - call this at runtime to check env vars
export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!env.apiUrl) missing.push('NEXT_PUBLIC_API_URL');
  if (!env.firebase.apiKey) missing.push('NEXT_PUBLIC_FIREBASE_API_KEY');
  if (!env.firebase.authDomain) missing.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  if (!env.firebase.projectId) missing.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  if (!env.firebase.storageBucket) missing.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  if (!env.firebase.messagingSenderId) missing.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  if (!env.firebase.appId) missing.push('NEXT_PUBLIC_FIREBASE_APP_ID');

  if (missing.length > 0) {
    console.error('\n🚨 Missing required environment variables:');
    missing.forEach((v) => console.error(`   - ${v}`));
    console.error('\nPlease create a .env.local file with these variables.');
    console.error('See .env.example for reference.\n');
  }

  return { valid: missing.length === 0, missing };
}

// Debug helper - logs env status (safe, doesn't expose full values)
export function logEnvStatus(): void {
  console.log('\n📋 Environment Configuration Status:');
  console.log('─'.repeat(50));
  
  const vars = {
    NEXT_PUBLIC_API_URL: env.apiUrl,
    NEXT_PUBLIC_FIREBASE_API_KEY: env.firebase.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: env.firebase.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: env.firebase.projectId,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: env.firebase.storageBucket,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: env.firebase.messagingSenderId,
    NEXT_PUBLIC_FIREBASE_APP_ID: env.firebase.appId,
  };

  for (const [name, value] of Object.entries(vars)) {
    const status = value ? '✅' : '❌';
    const preview = value ? `${value.substring(0, 15)}...` : 'NOT SET';
    console.log(`${status} ${name}: ${preview}`);
  }

  console.log('─'.repeat(50));
}
