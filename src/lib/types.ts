export interface LevelData {
    id?: string;
    name: string;
    backgroundId?: string;
    blocks: BlockData[];
    enemies?: EnemyData[];
    startPoint: PointData;
    endPoint: PointData;
    creator: string;
    createdAt: number;
    theme: LevelThemes;
    testMode?: boolean;
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
    physics?: {
        bounce?: number;
        friction?: number;
        isStatic?: boolean;
    };
}

export interface EnemyConfig {
    id: string;
    asset: string;
    displayName: string;
    baseId: string;
    physics?: {
        bounce?: number;
        friction?: number;
        isStatic?: boolean;
    };
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
    rotation: number;
    baseId: string;
}

export type EditorTool =
    | "select"
    | "start"
    | "end"
    | "delete"
    | "rotate"
    | string;

