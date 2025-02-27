import { completeLevel, likeLevel, playLevel } from "@/firebase/firestore";
import { SavedLevel } from "@/lib/types";
import { create } from "zustand";

interface PlayGameStore {
    level: SavedLevel | null;
    isComplete: boolean;

    setLevel: (level: SavedLevel) => void;
    levelCompleted: () => void;
    likeLevel: () => void;
    resetGame: () => void;
    isGameComplete: () => boolean;
}

export const usePlayGameStore = create<PlayGameStore>((set, get) => ({
    level: null,
    isComplete: false,
    setLevel: (level: SavedLevel) => {
        playLevel(level.id);
        set({ level });
    },
    levelCompleted: () => {
        const { level } = get();
        if (level) {
            completeLevel(level.id);
        }
        set({ isComplete: true });
    },
    likeLevel: () => {
        const currentLevel = get().level;
        if (currentLevel) {
            likeLevel(currentLevel.id);
        }
    },
    resetGame: () => set({ level: null, isComplete: false }),

    isGameComplete: () => get().isComplete,
}));

