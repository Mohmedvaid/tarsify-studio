export { app, auth } from './config';
export {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  resetPassword,
  getIdToken,
  getCurrentUser,
  mapFirebaseUser,
  type AuthUser,
} from './auth';
