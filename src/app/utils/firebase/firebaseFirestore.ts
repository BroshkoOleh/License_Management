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
  DocumentData,
  UpdateData,
  QuerySnapshot,
  FirestoreError,
  QueryConstraint,
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

export const updateEntry = async (
  collectionName: string,
  path: string,
  newData: UpdateData<DocumentData>
) => {
  try {
    const docRef = doc(db, collectionName, path);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.log(`Error updating entry at ${path} in ${collectionName}: ${error}`);
  }
};
export const getUserRole = async (email: string) => {
  try {
    const userDoc = await getEntry(FIREBASE_COLLECTION_NAMES.USERS, email);
    return userDoc?.role || null;
  } catch (error) {
    console.log(`Error getting role for user ${email}: ${error}`);
    return null;
  }
};

export const getCollection = async (collectionName: string): Promise<DocumentData[]> => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const coll = querySnapshot.docs.reduce<DocumentData[]>((acc, docSnapshot) => {
    acc.push(docSnapshot.data());
    return acc;
  }, []);

  return coll;
};

export const getEntry = async (collectionName: string, path: string) => {
  try {
    const docRef = doc(db, collectionName, path);
    const snapshot = await getDoc(docRef);
    const result = snapshot.data();
    return result;
  } catch (error) {
    console.log(`Error getting ${path} in ${collectionName}`, error);
  }
};

export const countDocs = async (
  collectionName: string,
  ...conditions: QueryConstraint[]
): Promise<number> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...conditions);
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.log(`error occured during query: `, error);
    return 0;
  }
};

export const addEntry = async (collectionName: string, path: string, data: DocumentData) => {
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

export const deleteEntry = async (collectionName: string, path: string) => {
  try {
    const docRef = doc(db, collectionName, path);
    await deleteDoc(docRef);
  } catch (error) {
    console.log(`Error removing ${collectionName}: ${error}`);
  }
};

export const replaceEntry = async (
  collectionName: string,
  oldPath: string,
  newPath: string,
  data: DocumentData
) => {
  try {
    await deleteEntry(collectionName, oldPath);
    await addEntry(collectionName, newPath, data);
  } catch (error) {
    console.log(`Error updating entry ${oldPath} in ${collectionName}: ${error}`);
  }
};

export const onCollectionChangedListener = (
  collectionName: string,
  callback: (snapshot: QuerySnapshot, error?: FirestoreError) => void
): (() => void) => {
  return onSnapshot(query(collection(db, collectionName)), callback);
};
