import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { LevelData } from "../lib/types";
import { db } from "./config";

export const SaveLevel = async (levelData: LevelData) => {
    try {
        const docRef = await addDoc(collection(db, "levels"), levelData);
        return docRef.id;
    } catch (error) {
        console.error("Error Saving level", error);
        throw error;
    }
};

export const publishLevel = async (levelData?: LevelData, levelId?: string) => {
    try {
        await addDoc(collection(db, "publishedLevels"), { levelId });
    } catch (error) {
        console.error("Error publishing level", error);
        throw error;
    }
};

export const getLevelsByUserId = async (userId: string) => {
    try {
        const levels = await getDocs(
            query(collection(db, "levels"), where("userId", "==", userId)),
        );

        return levels.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as LevelData[];
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
        }))[0] as LevelData;
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

