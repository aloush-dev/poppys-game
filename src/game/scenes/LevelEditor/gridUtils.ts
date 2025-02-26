import { LevelEditor } from "./LevelEditor";

export class GridUtils {
    private scene: LevelEditor;

    constructor(scene: LevelEditor) {
        this.scene = scene;
    }

    drawGrid(): void {
        this.scene.gridGraphics.clear();
        this.scene.gridGraphics.lineStyle(1, 0xffffff, 0.3);

        for (let i = 0; i <= this.scene.gridColumns; i++) {
            const x = i * this.scene.gridSize;
            this.scene.gridGraphics.moveTo(x, 0);
            this.scene.gridGraphics.lineTo(
                x,
                this.scene.gridRows * this.scene.gridSize,
            );
        }

        for (let j = 0; j <= this.scene.gridRows; j++) {
            const y = j * this.scene.gridSize;
            this.scene.gridGraphics.moveTo(0, y);
            this.scene.gridGraphics.lineTo(
                this.scene.gridColumns * this.scene.gridSize,
                y,
            );
        }

        this.scene.gridGraphics.strokePath();
    }

    snapToGrid(value: number): number {
        const maxX = (this.scene.gridColumns - 1) * this.scene.gridSize;
        const maxY = (this.scene.gridRows - 1) * this.scene.gridSize;

        const snapped =
            Math.floor(value / this.scene.gridSize) * this.scene.gridSize;

        return Math.max(
            0,
            Math.min(
                snapped,
                value === value % this.scene.cameras.main.width ? maxX : maxY,
            ),
        );
    }
}

