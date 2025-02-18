import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Block, BlockLeft, BlockRight } from "../tools/Block";
import { ToolType } from "../../components/Toolbar";

export class LevelCreator extends Scene {
    private selectedTool: ToolType | null = null;
    private elements: Block[] = [];
    private gridSize: number = 32;
    private gridWidth: number = 32;
    private gridHeight: number = 32;
    private gridGraphics: Phaser.GameObjects.Graphics;

    constructor() {
        super("LevelEditor");
    }

    preload() {
        this.load.image("block", "assets/block_middle.png");
        this.load.image("block_left", "assets/block_left.png");
        this.load.image("block_right", "assets/block_right.png");
    }

    create() {
        this.gridGraphics = this.add.graphics();
        this.drawGrid();

        EventBus.on("toolSelected", this.onToolSelected, this);
    }

    private onToolSelected(tool: ToolType) {
        this.selectedTool = tool;
    }

    private createElement(x: number, y: number) {
        let element;
        switch (this.selectedTool) {
            case "block_middle":
                element = new Block(
                    this,
                    Math.floor(x / this.gridSize) * this.gridSize,
                    Math.floor(y / this.gridSize) * this.gridSize
                );
                break;
            case "block_left":
                element = new BlockLeft(
                    this,
                    Math.floor(x / this.gridSize) * this.gridSize,
                    Math.floor(y / this.gridSize) * this.gridSize
                );
                break;
            case "block_right":
                element = new BlockRight(
                    this,
                    Math.floor(x / this.gridSize) * this.gridSize,
                    Math.floor(y / this.gridSize) * this.gridSize
                );
                break;
            default:
                return null;
        }

        if (element) {
            return element;
        }

        return null;
    }

    update() {
        if (this.input.activePointer.isDown && this.selectedTool) {
            const pointer = this.input.activePointer;
            const worldX = this.snapToGrid(pointer.worldX);
            const worldY = this.snapToGrid(pointer.worldY);

            const element = this.createElement(worldX, worldY);
            if (element) {
                this.elements.push(element);
            }
        }
    }

    private drawGrid() {
        this.gridGraphics.lineStyle(1, 16777215, 0.3);

        for (let i = 0; i <= this.gridWidth; i++) {
            this.gridGraphics.moveTo(i * this.gridSize, 0);
            this.gridGraphics.lineTo(
                i * this.gridSize,
                this.gridHeight * this.gridSize
            );
        }

        for (let j = 0; j <= this.gridHeight; j++) {
            this.gridGraphics.moveTo(0, j * this.gridSize);
            this.gridGraphics.lineTo(
                this.gridWidth * this.gridSize,
                j * this.gridSize
            );
        }

        this.gridGraphics.strokePath();
    }

    private snapToGrid(value: number): number {
        return Math.floor(value / this.gridSize) * this.gridSize;
    }
}

