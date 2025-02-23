import { ThemeConfig } from "./types";

export const gameThemes: Record<string, ThemeConfig> = {
    standard: {
        name: "standard",
        blockSize: 64,
        blocks: [
            // {
            //     id: "block_orange",
            //     asset: "block_orange.png",
            //     displayName: "Orange Block",
            // },
            {
                id: "standard_block_with_top",
                asset: "block_grass.png",
                displayName: "Grass Block",
                baseId: "block_with_top",
            },
            // {
            //     id: "block_blue",
            //     asset: "block_blue.png",
            //     displayName: "Blue Block",
            // },
            // {
            //     id: "block_yellow",
            //     asset: "block_yellow.png",
            //     displayName: "Yellow Block",
            // },
        ],
        enemies: [
            {
                id: "enemy_1",
                asset: "enemy_spikes.png",
                displayName: "Enemy Spikes",
                baseId: "enemy_static",
            },
        ],
        background: "background.png",
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
                baseId: "block_with_top",
            },
        ],
        background: "background.png",
        startPoint: "start_point.png",
        endPoint: "end_point.png",
    },
};

