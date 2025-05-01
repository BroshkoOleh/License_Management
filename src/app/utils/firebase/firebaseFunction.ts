import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebase";

const functions = getFunctions(firebaseApp, "us-central1");

export const addUser = async (email: string, password: string) => {
  try {
    const cloudFunction = httpsCallable(functions, "addUser");
    const response = await cloudFunction({ email, password });
    return response.data;
  } catch (error) {
    console.log(`error occured during user creation: `, error);
  }
};

export const deleteUser = async (email: string) => {
  try {
    const cloudFunction = httpsCallable(functions, "deleteUser");
    const response = await cloudFunction({ email });
    return response.data;
  } catch (error) {
    console.log(`error occured during user deletion: `, error);
  }
};
