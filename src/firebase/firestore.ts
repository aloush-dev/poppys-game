import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import { LevelData, SavedLevel } from "../lib/types";
import { db } from "./config";
import { DBUser } from "../lib/dbTypes";

export const SaveLevelToDb = async (levelData: LevelData, levelId?: string) => {
    try {
        let docRef;

        if (levelId) {
            docRef = doc(db, "levels", levelId);

            const levelDoc = await getDoc(docRef);
            if (levelDoc.exists() && levelDoc.data().published) {
                throw new Error("Cannot edit a published level");
            }

            await setDoc(
                docRef,
                {
                    ...levelData,
                    updatedAt: serverTimestamp(),
                },
                { merge: true },
            );
        } else {
            docRef = doc(collection(db, "levels"));

            await setDoc(docRef, {
                ...levelData,
                published: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        const updatedDoc = await getDoc(docRef);
        return {
            id: docRef.id,
            ...updatedDoc.data(),
        } as SavedLevel;
    } catch (error) {
        console.error("Error saving level", error);
        throw error;
    }
};

export const publishLevel = async (levelData: LevelData, levelId?: string) => {
    try {
        let docRef;

        if (levelId) {
            docRef = doc(db, "levels", levelId);

            const levelDoc = await getDoc(docRef);
            if (levelDoc.exists() && levelDoc.data().published) {
                throw new Error("Cannot edit a published level");
            }

            await setDoc(
                docRef,
                {
                    ...levelData,
                    published: true,
                    updatedAt: serverTimestamp(),
                },
                { merge: true },
            );
        } else {
            docRef = doc(collection(db, "levels"));

            await setDoc(docRef, {
                ...levelData,
                published: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        const updatedDoc = await getDoc(docRef);
        return {
            id: docRef.id,
            ...updatedDoc.data(),
        } as SavedLevel;
    } catch (error) {
        console.error("Error saving level", error);
        throw error;
    }
};

export const getPublishedLevelsByUserId = async (userId: string) => {
    try {
        const levels = await getDocs(
            query(
                collection(db, "levels"),
                where("creator", "==", userId),
                where("published", "==", true),
            ),
        );

        return levels.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as SavedLevel[];
    } catch (error) {
        console.error("Error getting levels by user id", error);
        throw error;
    }
};

export const getSavedLevelsByUserId = async (userId: string) => {
    try {
        const levels = await getDocs(
            query(
                collection(db, "levels"),
                where("creator", "==", userId),
                where("published", "==", false),
            ),
        );

        return levels.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as SavedLevel[];
    } catch (error) {
        console.error("Error getting levels by user id", error);
        throw error;
    }
};

export const getLevelById = async (levelId: string) => {
    try {
        const levelDoc = await getDoc(doc(db, "levels", levelId));
        if (!levelDoc.exists()) {
            return null;
        }
        return {
            id: levelDoc.id,
            ...levelDoc.data(),
        } as SavedLevel;
    } catch (error) {
        console.error("Error getting level by id", error);
        throw error;
    }
};

export const getAllLevels = async () => {
    try {
        const levels = await getDocs(collection(db, "levels"));

        return levels.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as SavedLevel[];
    } catch (error) {
        console.error("Error getting all levels", error);
        throw error;
    }
};

export const createDBUser = async (userId: string, username: string) => {
    try {
        await addDoc(collection(db, "users"), {
            userId,
            username,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        } as Omit<DBUser, "id">);
    } catch (error) {
        console.error("Error creating user", error);
        throw error;
    }
};

export const getUserById = async (userId: string) => {
    try {
        const user = await getDocs(
            query(collection(db, "users"), where("userId", "==", userId)),
        );

        if (user.empty) {
            return null;
        }

        return user.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))[0] as DBUser;
    } catch (error) {
        console.error("Error getting user by id", error);
        throw error;
    }
};

export const getUserByUsername = async (username: string) => {
    try {
        const user = await getDocs(
            query(collection(db, "users"), where("username", "==", username)),
        );

        if (user.empty) {
            return null;
        }

        return user.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))[0] as DBUser;
    } catch (error) {
        console.error("Error getting user by username", error);
        throw error;
    }
};

export const deleteSavedLevel = async (levelId: string) => {
    try {
        await deleteDoc(doc(db, "levels", levelId));
    } catch (error) {
        console.error("Error deleting saved level", error);
        throw error;
    }
};

