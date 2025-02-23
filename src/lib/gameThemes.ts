import { ThemeConfig } from "./types";

export const gameThemes: Record<string, ThemeConfig> = {
    standard: {
        name: "standard",
        blockSize: 64,
        blocks: [
            {
                id: "block_orange",
                asset: "block_orange.png",
                displayName: "Orange Block",
            },
            {
                id: "block_grass",
                asset: "block_grass.png",
                displayName: "Grass Block",
            },
            {
                id: "block_blue",
                asset: "block_blue.png",
                displayName: "Blue Block",
            },
            {
                id: "block_yellow",
                asset: "block_yellow.png",
                displayName: "Yellow Block",
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
                id: "block_cake_mid",
                asset: "block_cake_mid.png",
                displayName: "Cake Mid",
            },
        ],
        background: "background.png",
        startPoint: "start_point.png",
        endPoint: "end_point.png",
    },
};

