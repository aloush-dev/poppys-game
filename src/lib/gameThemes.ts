import { BackgroundData, ThemeConfig } from "./types";

export const gameThemes: Record<string, ThemeConfig> = {
    standard: {
        name: "standard",
        blockSize: 64,
        blocks: [
            {
                id: "block_orange",
                asset: "block_orange.png",
                displayName: "Orange Block",
                baseId: "block_2",
            },
            {
                id: "standard_block_with_top",
                asset: "block_grass.png",
                displayName: "Grass Block",
                baseId: "block_1",
            },
        ],
        enemies: [
            {
                id: "enemy_1",
                asset: "enemy_spikes.png",
                displayName: "Enemy Spikes",
                baseId: "enemy_static",
            },
        ],
        startPoint: "start_point.png",
        endPoint: "end_point.png",
    },
    candy: {
        name: "candy",
        blockSize: 70,
        blocks: [
            {
                id: "candy_block_with_top",
                asset: "block_cake_mid.png",
                displayName: "Cake Mid",
                baseId: "block_1",
            },
            {
                id: "chocolate_block",
                asset: "block_chocolate_mid.png",
                displayName: "Chocolate Mid",
                baseId: "block_2",
            },
        ],
        enemies: [
            {
                id: "enemy_1",
                asset: "enemy_spikes.png",
                displayName: "Enemy Spikes",
                baseId: "enemy_static",
            },
        ],
        startPoint: "start_point.png",
        endPoint: "end_point.png",
    },
};

export const gameBackgrounds: BackgroundData[] = [
    {
        id: "background_1",
        asset: "1.png",
        scale: 0.6,
    },
    {
        id: "background_2",
        asset: "2.png",
        scale: 1,
    },
];

