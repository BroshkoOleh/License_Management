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
  UpdateData,
  QuerySnapshot,
  FirestoreError,
  QueryConstraint,
} from "firebase/firestore";

import { db } from "./firebase";
import { User } from "../../types/types";

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
  newData: UpdateData<User>
) => {
  try {
    const docRef = doc(db, collectionName, path);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.log(`Error updating entry at ${path} in ${collectionName}: ${error}`);
  }
};

// export const getCollection = async (collectionName: string) => {
//   const collectionRef = collection(db, collectionName);
//   const q = query(collectionRef);

//   const querySnapshot = await getDocs(q);
//   const coll = querySnapshot.docs.reduce((acc, docSnapshot) => {
//     acc.push(docSnapshot.data());
//     return acc;
//   }, []);

//   return coll;
// };

export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const coll = querySnapshot.docs.map((docSnapshot) => {
    return docSnapshot.data() as T;
  });

  return coll;
};

export const getEntry = async <T>(collectionName: string, path: string): Promise<T | undefined> => {
  try {
    const docRef = doc(db, collectionName, path);
    const snapshot = await getDoc(docRef);
    const result = snapshot.data() as T;
    return result;
  } catch (error) {
    console.log(`Error getting ${path} in ${collectionName}`, error);
    return undefined;
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

export const addEntry = async (collectionName: string, path: string, data: User) => {
  try {
    const docRef = doc(db, collectionName, path);
    await setDoc(
      docRef,
      {
        ...data,
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
  data: User
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
