import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

export const signInUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const sendResetPasswordEmail = async (email) => {
  if (!email) return;

  return await sendPasswordResetEmail(auth, email);
};

export const signOutUser = async () => await signOut(auth);

export const deleteUser = async (user) => await deleteUser(user);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);
