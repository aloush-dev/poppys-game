export interface LevelData {
    id?: string;
    backgroundId: string;
    blocks?: BlockData[];
    enemies?: EnemyData[];
    startPoint?: PointData | null;
    endPoint?: PointData | null;
    theme: LevelThemes;
}

export interface LevelDataToPost {
    id?: string;
    name: string;
    creator: string;
    levelData: LevelData;
}

export interface SavedLevel {
    id: string;
    name: string;
    creator: string;
    createdAt: number;
    plays: number;
    completes: number;
    likes: number;
    levelData: Omit<LevelData, "testMode">;
}

export type LevelThemes = "candy" | "standard";

export interface PointData {
    x: number;
    y: number;
}

export interface ThemeConfig {
    name: string;
    blockSize: number;
    blocks: BlockConfig[];
    enemies?: EnemyConfig[];
    startPoint: string;
    endPoint: string;
}

export interface BackgroundData {
    id: string;
    asset: string;
    scale: number;
}
export interface BlockConfig {
    id: string;
    asset: string;
    displayName: string;
    baseId: string;
}

export interface EnemyConfig {
    id: string;
    asset: string;
    displayName: string;
    baseId: string;
}

export interface EnemyData {
    x: number;
    y: number;
    enemyId: string;
    baseId: string;
}

export interface BlockData {
    x: number;
    y: number;
    blockId: string;
    baseId: string;
}

export type EditorTool =
    | "select"
    | "start"
    | "end"
    | "delete"
    | "rotate"
    | string;

