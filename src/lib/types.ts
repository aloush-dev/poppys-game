export interface LevelData {
    id?: string;
    name: string;
    blocks: BlockData[];
    enemies?: EnemyType[];
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
    background: string;
    startPoint: string;
    endPoint: string;
}
export interface BlockConfig {
    id: string;
    asset: string;
    displayName: string;
    physics?: {
        bounce?: number;
        friction?: number;
        isStatic?: boolean;
    };
}

export interface EnemyType {
    id: string;
    asset: string;
}

export interface BlockData {
    x: number;
    y: number;
    blockId: string;
    rotation: number;
}

export type EditorTool =
    | "select"
    | "start"
    | "end"
    | "delete"
    | "rotate"
    | string;

