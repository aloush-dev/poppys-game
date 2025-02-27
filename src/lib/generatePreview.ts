import { LevelData } from "./types";

export const generateLevelPreviewSVG = (levelData: LevelData): string => {
    const SVG_WIDTH = 800;
    const SVG_HEIGHT = 160;
    const CELL_SIZE = 10;

    const theme = levelData.theme;

    const themeColours = {
        standard: {
            background: "#3399da",
            block: "#ffcc00",
            enemy: "#89a4a6",
            start: "#2ecc71",
            end: "#FFFF00",
        },
        candy: {
            background: "#FFB6C1",
            block: "#FF69B4",
            enemy: "#FF0000",
            start: "#00FF00",
            end: "#FFFF00",
        },
        scribble: {
            background: "#FFFFFF",
            block: "#000000",
            enemy: "#FF0000",
            start: "#00FF00",
            end: "#FFFF00",
        },
    };

    let svg = `<svg width="${SVG_WIDTH}" height="${SVG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">`;

    svg += `<rect width="100%" height="100%" fill="${themeColours[theme].background}" />`;

    levelData.blocks?.forEach((block) => {
        const x = (block.x / 32) * CELL_SIZE;
        const y = (block.y / 32) * CELL_SIZE;
        svg += `<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" fill="${themeColours[theme].block}"/>`;
    });

    levelData.enemies?.forEach((enemy) => {
        const x = (enemy.x / 32) * CELL_SIZE;
        const y = (enemy.y / 32) * CELL_SIZE;
        svg += `<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" fill="${themeColours[theme].enemy}"/>`;
    });

    if (levelData.startPoint) {
        const x = (levelData.startPoint.x / 32) * CELL_SIZE;
        const y = (levelData.startPoint.y / 32) * CELL_SIZE;
        svg += `<circle cx="${x + CELL_SIZE / 2}" cy="${y + CELL_SIZE / 2}" r="${CELL_SIZE / 2}" fill="${themeColours[theme].start}"/>`;
    }

    if (levelData.endPoint) {
        const x = (levelData.endPoint.x / 32) * CELL_SIZE;
        const y = (levelData.endPoint.y / 32) * CELL_SIZE;
        svg += `<circle cx="${x + CELL_SIZE / 2}" cy="${y + CELL_SIZE / 2}" r="${CELL_SIZE / 2}" fill="${themeColours[theme].end}"/>`;
    }

    svg += `</svg>`;

    return svg;
};

