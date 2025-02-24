import { Timestamp } from "firebase/firestore";
import { LevelThemes } from "./types";

export interface FirestoreDoc {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface DBUser extends FirestoreDoc {
    userId: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
}

export interface DBLevel extends FirestoreDoc {
    creator: string;
    name: string;
    theme: LevelThemes;
    published: boolean;
    plays: number;
    completes: number;
    likes: number;
    data: {
        blocks: Array<{
            x: number;
            y: number;
            blockId: string;
            rotation: number;
            baseId: string;
        }>;
        enemies: Array<{
            x: number;
            y: number;
            enemyId: string;
            baseId: string;
        }>;
        startPoint?: {
            x: number;
            y: number;
        };
        endPoint?: {
            x: number;
            y: number;
        };
        backgroundId?: string;
    };
}

