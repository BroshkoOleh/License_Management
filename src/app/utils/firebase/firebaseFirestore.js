import {
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  getDoc,
  deleteDoc,
  onSnapshot,
  getCountFromServer,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

//
// Colection Names
//

export const FIREBASE_COLLECTION_NAMES = {
  LICENSES: "licenses",
  CONFIGURATIONS: "configurations",
  GROUPS: "groups",
  APPS: "apps",
  LANGUAGES: "languages",
  USERS: "users",
  PAYMENTS: "payments",
  FEATURES: "features",
};

//
// Methods
//

export const updateEntry = async (collectionName, path, newData) => {
  try {
    const docRef = doc(db, collectionName, path);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.log(`Error updating entry at ${path} in ${collectionName}: ${error}`);
  }
};

export const getCollection = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const coll = querySnapshot.docs.reduce((acc, docSnapshot) => {
    acc.push(docSnapshot.data());
    return acc;
  }, []);

  return coll;
};

export const getEntry = async (collectionName, path) => {
  try {
    const docRef = doc(db, collectionName, path);
    const snapshot = await getDoc(docRef);
    const result = snapshot.data();
    return result;
  } catch (error) {
    console.log(`Error getting ${path} in ${collectionName}`, error);
  }
};

export const countDocs = async (collectionName, condition) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, condition);
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.log(`error occured during query: `, error);
  }
};

export const addEntry = async (collectionName, path, data) => {
  const createdAt = new Date();

  try {
    const docRef = doc(db, collectionName, path);
    await setDoc(
      docRef,
      {
        ...data,
        createdAt,
      },
      {
        merge: true,
      }
    );
  } catch (error) {
    console.log(`Error adding ${collectionName}: ${error}`);
  }
};

export const deleteEntry = async (collectionName, path) => {
  try {
    const docRef = doc(db, collectionName, path);
    await deleteDoc(docRef);
  } catch (error) {
    console.log(`Error removing ${collectionName}: ${error}`);
  }
};

export const replaceEntry = async (collectionName, oldPath, newPath, data) => {
  try {
    await deleteEntry(collectionName, oldPath);
    await addEntry(collectionName, newPath, data);
  } catch (error) {
    console.log(`Error updating entry ${oldPath} in ${collectionName}: ${error}`);
  }
};

export const onCollectionChangedListener = (collectionName, callback) =>
  onSnapshot(query(collection(db, collectionName)), callback);
