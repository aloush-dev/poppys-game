import { SavedLevel } from "@/lib/types";
import { create } from "zustand";

interface PlayGameStore {
    level: SavedLevel | null;
    setLevel: (level: SavedLevel) => void;
}

export const usePlayGameStore = create<PlayGameStore>((set) => ({
    level: null,
    setLevel: (level: SavedLevel) => set({ level }),
}));

