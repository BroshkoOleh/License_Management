import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  NextOrObserver,
  UserCredential,
} from "firebase/auth";

import { auth } from "./firebase";

// /**
//  * Authenticates user with email and password
//  * @param email - User email
//  * @param password - User password
//  * @returns Promise resolving to UserCredential
//  */
export const signInUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential | undefined> => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

// /**
//  * Sends password reset email
//  * @param email - User email
//  * @returns Promise resolving to void
//  */
export const sendResetPasswordEmail = async (email: string): Promise<void | undefined> => {
  if (!email) return;

  return await sendPasswordResetEmail(auth, email);
};

// /**
//  * Signs out current user
//  * @returns Promise resolving to void
//  */
export const signOutUser = async (): Promise<void> => {
  return await signOut(auth);
};

// * Sets up an authentication state change listener
// * @param callback - Function or observer to handle auth state changes
// * @returns Unsubscribe function
// */
export const onAuthStateChangedListener = (callback: NextOrObserver<User>): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
