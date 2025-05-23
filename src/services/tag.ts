import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { SerializedTag } from "@/types/tag";

export const createTagIfNotExist = async (name: string) => {
  const q = query(collection(db, "tags"), where("name", "==", name));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) return snapshot.docs[0].data() as SerializedTag;

  const newTag = {
    name,
    createdAt: serverTimestamp() as Timestamp,
  };

  const newTagRef = await addDoc(collection(db, "tags"), newTag);

  return {
    ...newTag,
    id: newTagRef.id,
    createdAt: newTag.createdAt.toDate().toISOString(),
  } as SerializedTag;
};

export const getAllTags = async () => {
  const querySnapshot = await getDocs(collection(db, "tags"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate().toISOString(),
  })) as SerializedTag[];
};
