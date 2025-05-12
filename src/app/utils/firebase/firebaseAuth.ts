import Cookies from "js-cookie";
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

  try {
    // Авторизуємося в Firebase Auth
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Отримуємо ID токен
    const idToken = await result.user.getIdToken();

    // Відправляємо запит на наш API для створення сесійного куки
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to create session");
    }

    return result;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
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
  try {
    // Виходимо з Firebase Auth
    await signOut(auth);

    // Видаляємо сесійний токен з клієнтської сторони
    Cookies.remove("authToken");

    // Альтернативно: відправляємо запит на API ендпоінт для надійного видалення куки з сервера
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error clearing server session:", error);
      // Навіть якщо серверне видалення не вдалося, продовжуємо виконання
    }

    // Опціонально: перенаправлення на сторінку входу
    window.location.href = "/";
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
// * Sets up an authentication state change listener
// * @param callback - Function or observer to handle auth state changes
// * @returns Unsubscribe function
// */
export const onAuthStateChangedListener = (callback: NextOrObserver<User>): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
