import { create } from "zustand";
import {
    LevelData,
    BlockData,
    EnemyData,
    PointData,
    EditorTool,
    LevelThemes,
} from "@/lib/types";
import { useModalStore } from "./useModalStore";
import { SaveLevelToDb } from "@/firebase/firestore";

interface LevelEditorState {
    levelData: LevelData;
    selectedTool: EditorTool | null;
    game: Phaser.Game | null;

    setLevelData: (data: LevelData) => void;
    setSelectedTool: (tool: EditorTool | null) => void;
    setLevelTheme: (theme: LevelThemes) => void;
    setBackgroundId: (id: string) => void;

    addBlock: (block: BlockData) => void;
    updateBlock: (x: number, y: number, blockId: string) => void;
    removeBlock: (x: number, y: number) => void;

    addEnemy: (enemy: EnemyData) => void;
    updateEnemy: (x: number, y: number, enemyId: string) => void;
    removeEnemy: (x: number, y: number) => void;

    setStartPoint: (point: PointData | null) => void;
    setEndPoint: (point: PointData | null) => void;

    setGame(game: Phaser.Game | null): void;

    publishLevel: () => void;
    saveLevel: () => void;
    testLevel: () => void;
    resetLevel: () => void;
}

const defaultLevel: LevelData = {
    backgroundId: "background_1",
    blocks: [],
    enemies: [],
    startPoint: null,
    endPoint: null,
    theme: "standard",
};

export const useLevelEditorStore = create<LevelEditorState>()((set, get) => ({
    levelData: { ...defaultLevel },
    selectedTool: null,
    game: null,

    setLevelData: (data) => {
        set({ levelData: data });
    },

    setSelectedTool: (tool) => set({ selectedTool: tool }),

    setLevelTheme: (theme) =>
        set((state) => ({
            levelData: { ...state.levelData, theme },
        })),

    setBackgroundId: (backgroundId) =>
        set((state) => ({
            levelData: { ...state.levelData, backgroundId },
        })),

    addBlock: (block: BlockData) =>
        set((state) => {
            const filteredBlocks = (state.levelData.blocks || []).filter(
                (b) => !(b.x === block.x && b.y === block.y),
            );

            return {
                levelData: {
                    ...state.levelData,
                    blocks: [
                        ...filteredBlocks,
                        {
                            ...block,
                            blockId: block.blockId,
                            baseId: block.baseId || block.blockId,
                        },
                    ],
                },
            };
        }),

    updateBlock: (x: number, y: number, blockId: string) =>
        set((state) => {
            const blocks = [...(state.levelData.blocks || [])];
            const index = blocks.findIndex((b) => b.x === x && b.y === y);

            if (index !== -1) {
                blocks[index] = {
                    ...blocks[index],
                    blockId,
                    x,
                    y,
                };
            }

            return {
                levelData: { ...state.levelData, blocks },
            };
        }),

    removeBlock: (x, y) =>
        set((state) => ({
            levelData: {
                ...state.levelData,
                blocks: (state.levelData.blocks || []).filter(
                    (b) => !(b.x === x && b.y === y),
                ),
            },
        })),

    addEnemy: (enemy) =>
        set((state) => {
            const filteredEnemies = (state.levelData.enemies || []).filter(
                (e) => !(e.x === enemy.x && e.y === enemy.y),
            );

            return {
                levelData: {
                    ...state.levelData,
                    enemies: [...filteredEnemies, enemy],
                },
            };
        }),

    updateEnemy: (x, y, enemyId) =>
        set((state) => {
            const enemies = [...(state.levelData.enemies || [])];
            const index = enemies.findIndex((e) => e.x === x && e.y === y);

            if (index !== -1) {
                enemies[index] = { ...enemies[index], enemyId };
            }

            return {
                levelData: { ...state.levelData, enemies },
            };
        }),

    removeEnemy: (x, y) =>
        set((state) => ({
            levelData: {
                ...state.levelData,
                enemies: (state.levelData.enemies || []).filter(
                    (e) => !(e.x === x && e.y === y),
                ),
            },
        })),

    setStartPoint: (startPoint) =>
        set((state) => ({
            levelData: { ...state.levelData, startPoint },
        })),

    setEndPoint: (endPoint) =>
        set((state) => ({
            levelData: { ...state.levelData, endPoint },
        })),

    setGame: (game) => set({ game }),

    publishLevel: async () => {
        const { openModal } = useModalStore.getState();
        const { levelData } = get();
        if (!levelData.startPoint || !levelData.endPoint) {
            openModal("error", "Level must have a start and end point");
            return;
        }

        openModal("publish", "Publish Level");
    },

    saveLevel: async () => {
        const { openModal } = useModalStore.getState();
        const { levelData } = get();

        if (levelData.name) {
            await SaveLevelToDb(levelData, levelData.id);
        } else {
            openModal("save", "Save Level");
        }
    },

    testLevel: () => {
        const { openModal } = useModalStore.getState();
        const { levelData, game } = get();
        if (!levelData.startPoint) {
            openModal("error", "No start point set");
            return;
        }

        if (game) {
            game.scene.stop("LevelEditor");
            game.scene.start("TestGame");
        }
    },

    resetLevel: () =>
        set({
            levelData: { ...defaultLevel },
        }),
}));

