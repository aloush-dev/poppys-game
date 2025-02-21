import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Block } from "../tools/Block";
import { ToolType } from "../components/Toolbar";
import { BlockData, LevelData, TempLevelData } from "../../lib/types";
import { EndPoint, StartPoint } from "../tools/Points";
import { SaveLevel } from "../../firebase/firestore";

export class LevelCreator extends Scene {
    private levelTheme: "forrest" | "desert" | "space" = "forrest";
    public selectedTool: ToolType | null = null;
    private elements: BlockData[] = [];
    private startPoint: StartPoint | null = null;
    private endPoint: EndPoint | null = null;
    private gridSize: number = 32;
    private gridColumns: number;
    private gridRows: number;
    private gridGraphics: Phaser.GameObjects.Graphics;

    constructor() {
        super("LevelEditor");
    }

    preload() {
        this.load.image("block_middle", "assets/block_middle.png");
        this.load.image("block_left", "assets/block_left.png");
        this.load.image("block_right", "assets/block_right.png");
        this.load.spritesheet("start", "assets/portal_green.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("end", "assets/portal_blue.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        this.gridColumns = Math.floor(gameWidth / this.gridSize);
        this.gridRows = Math.floor(gameHeight / this.gridSize);

        this.gridGraphics = this.add.graphics();
        this.drawGrid();

        EventBus.on("toolSelected", this.onToolSelected, this);
        EventBus.on("saveLevel", () => this.saveLevel());
        this.input.on("pointerdown", this.handlePointerDown, this);

        this.anims.create({
            key: "start_portal",
            frames: this.anims.generateFrameNumbers("start", {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "end_portal",
            frames: this.anims.generateFrameNumbers("end", {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });

        EventBus.emit("current-scene-ready", this);
    }

    private onToolSelected(tool: ToolType) {
        this.selectedTool = tool;
    }

    private handlePointerDown(pointer: Phaser.Input.Pointer) {
        if (!this.selectedTool) return;

        if (
            pointer.x < 0 ||
            pointer.x > this.gridColumns * this.gridSize ||
            pointer.y < 0 ||
            pointer.y > this.gridRows * this.gridSize
        ) {
            return;
        }

        const x = this.snapToGrid(pointer.x);
        const y = this.snapToGrid(pointer.y);

        switch (this.selectedTool) {
            case "start":
                if (this.startPoint) this.startPoint.destroy();
                this.startPoint = new StartPoint(this, x, y);
                break;
            case "end":
                if (this.endPoint) this.endPoint.destroy();
                this.endPoint = new EndPoint(this, x, y);
                break;
            case "block_middle":
            case "block_left":
            case "block_right": {
                const block = new Block(this, x, y, this.selectedTool);
                this.elements.push({
                    x: block.x,
                    y: block.y,
                    type: block.blockType as
                        | "block_middle"
                        | "block_left"
                        | "block_right",
                });
                break;
            }
            case "delete": {
                const block = this.elements.find(
                    (block) => block.x === x && block.y === y,
                );
                if (block) {
                    this.elements = this.elements.filter(
                        (block) => block.x !== x || block.y !== y,
                    );
                }
                break;
            }
        }
    }

    private drawGrid() {
        this.gridGraphics.clear();
        this.gridGraphics.lineStyle(1, 0xffffff, 0.3);

        for (let i = 0; i <= this.gridColumns; i++) {
            const x = i * this.gridSize;
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, this.gridRows * this.gridSize);
        }

        for (let j = 0; j <= this.gridRows; j++) {
            const y = j * this.gridSize;
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(this.gridColumns * this.gridSize, y);
        }

        this.gridGraphics.strokePath();
    }

    private snapToGrid(value: number): number {
        const maxX = (this.gridColumns - 1) * this.gridSize;
        const maxY = (this.gridRows - 1) * this.gridSize;

        const snapped = Math.floor(value / this.gridSize) * this.gridSize;

        return Math.max(
            0,
            Math.min(
                snapped,
                value === value % this.cameras.main.width ? maxX : maxY,
            ),
        );
    }

    private async publishLevel(levelName: string, userId: string) {
        if (!this.startPoint || !this.endPoint) {
            EventBus.emit("error", "Level must have start and end points");
            return;
        }

        const levelData: LevelData = {
            name: levelName,
            blocks: this.elements.map((block) => ({
                x: block.x,
                y: block.y,
                type: block.type,
            })),
            startPoint: {
                x: this.startPoint.x,
                y: this.startPoint.y,
            },
            endPoint: {
                x: this.endPoint.x,
                y: this.endPoint.y,
            },
            creator: userId,
            createdAt: Date.now(),
        };

        try {
            await SaveLevel(levelData);
            EventBus.emit("levelPublished");
        } catch (error) {
            EventBus.emit("error", "Failed to publish level");
        }
    }

    private async saveLevel() {
        if (!this.startPoint || !this.endPoint) {
            EventBus.emit("error", "Level must have start and end points");
            return;
        }
        const levelData: TempLevelData = {
            blocks: this.elements.map((block) => ({
                x: block.x,
                y: block.y,
                type: block.type,
            })),
            startPoint: {
                x: this.startPoint.x,
                y: this.startPoint.y,
            },
            endPoint: {
                x: this.endPoint.x,
                y: this.endPoint.y,
            },
        };
        try {
            localStorage.setItem("tempLevel", JSON.stringify(levelData));
            EventBus.emit("levelSaved");
        } catch (error) {
            console.log(error);
            EventBus.emit("error", "Failed to save level");
        }
    }

    private deleteElement(x: number, y: number) {
        const block = this.elements.find(
            (block) => block.x === x && block.y === y,
        );
        if (block) {
            this.elements = this.elements.filter(
                (block) => block.x !== x || block.y !== y,
            );
        }
    }
}

