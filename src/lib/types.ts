export interface LevelData {
    id?: string;
    name: string;
    blocks: BlockData[];
    startPoint: PointData;
    endPoint: PointData;
    creator: string;
    createdAt: number;
}

export interface TempLevelData {
    id?: string;
    blocks: BlockData[];
    startPoint: PointData;
    endPoint: PointData;
}

export interface BlockData {
    x: number;
    y: number;
    type: "block_middle" | "block_left" | "block_right";
}

export interface PointData {
    x: number;
    y: number;
}
