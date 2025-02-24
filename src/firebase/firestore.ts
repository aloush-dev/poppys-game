import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { LevelData, StoredLevelData } from "../lib/types";
import { db } from "./config";
import { DBUser } from "../lib/dbTypes";

export const SaveLevel = async (levelData: LevelData, levelId?: string) => {
    try {
        if (levelId) {
            const levelQuery = query(
                collection(db, "levels"),
                where("id", "==", levelId),
            );
            const levelDocs = await getDocs(levelQuery);
            if (!levelDocs.empty) {
                const docRef = doc(db, "levels", levelDocs.docs[0].id);
                await updateDoc(docRef, {
                    ...levelData,
                    published: false,
                    updatedAt: serverTimestamp(),
                });
                return levelDocs.docs[0].id;
            }
        } else {
            const docRef = await addDoc(collection(db, "levels"), {
                ...levelData,
                published: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return docRef.id;
        }
    } catch (error) {
        console.error("Error Saving level", error);
        throw error;
    }
};

export const publishLevel = async (levelData: LevelData, levelId?: string) => {
    try {
        if (levelId) {
            const levelQuery = query(
                collection(db, "levels"),
                where("id", "==", levelId),
            );
            const levelDocs = await getDocs(levelQuery);
            if (!levelDocs.empty) {
                const docRef = doc(db, "levels", levelDocs.docs[0].id);
                await updateDoc(docRef, {
                    ...levelData,
                    published: true,
                    updatedAt: serverTimestamp(),
                });
                return;
            }
        } else {
            await addDoc(collection(db, "levels"), levelData);
        }
    } catch (error) {
        console.error("Error publishing level", error);
        throw error;
    }
};

export const getPublishedLevelsByUserId = async (userId: string) => {
    try {
        const levels = await getDocs(
            query(
                collection(db, "levels"),
                where("userId", "==", userId),
                where("published", "==", true),
            ),
        );

        return levels.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as StoredLevelData[];
    } catch (error) {
        console.error("Error getting levels by user id", error);
        throw error;
    }
};

export const getLevelById = async (levelId: string) => {
    try {
        const level = await getDocs(
            query(collection(db, "levels"), where("id", "==", levelId)),
        );

        return level.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))[0] as StoredLevelData;
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
        })) as LevelData[];
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

