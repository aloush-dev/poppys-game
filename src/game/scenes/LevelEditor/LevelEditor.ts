import { Scene } from "phaser";
import { EventBus } from "@/game/EventBus";
import { Block } from "@/game/tools/Block";
import { LevelData, LevelThemes, EditorTool } from "@/lib/types";
import { EndPoint, StartPoint } from "@/game/tools/Points";
import { gameBackgrounds, gameThemes } from "@/lib/gameThemes";
import { Enemy } from "@/game/tools/Enemy";
import { publishLevel, SaveLevel } from "@/firebase/firestore";
import { setupLevel } from "../setupLevel";

export class LevelEditor extends Scene {
    public levelTheme: LevelThemes = "standard";
    public levelData: LevelData;
    public selectedTool: EditorTool | null = null;
    public blocks: Block[] = [];
    public enemies: Enemy[] = [];
    public startPoint: StartPoint | null = null;
    public endPoint: EndPoint | null = null;
    public gridSize: number = 32;
    public gridColumns: number;
    public gridRows: number;
    public gridGraphics: Phaser.GameObjects.Graphics;
    public currentBackground: Phaser.GameObjects.Image;
    public levelId?: string;

    private saveLevelListener: (
        levelName: string,
        userId: string,
        levelId?: string,
    ) => void;

    constructor() {
        super({ key: "LevelEditor" });
    }

    init(data: { levelData: LevelData; id?: string } | LevelData) {
        if (data) {
            if ("levelData" in data) {
                this.levelData = data.levelData;
                this.levelId = data.id;
            } else {
                this.levelData = data;
            }
        } else {
            this.levelData = {
                theme: this.levelTheme,
                blocks: [],
                enemies: [],
                backgroundId: gameBackgrounds[0].id,
            };
            this.levelId = undefined;
        }
    }

    preload() {
        const themeConfig = gameThemes[this.levelTheme];

        themeConfig.blocks.forEach((block) => {
            this.load.image(
                block.id,
                `assets/theme_${this.levelTheme}/${block.asset}`,
            );
        });

        themeConfig.enemies?.forEach((enemy) => {
            this.load.image(
                enemy.id,
                `assets/theme_${this.levelTheme}/${enemy.asset}`,
            );
        });

        gameBackgrounds.forEach((background) => {
            this.load.image(
                background.id,
                `assets/backgrounds/${background.asset}`,
            );
        });

        this.load.image(
            "start",
            `assets/theme_${this.levelTheme}/${themeConfig.startPoint}`,
        );
        this.load.image(
            "end",
            `assets/theme_${this.levelTheme}/${themeConfig.endPoint}`,
        );
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        this.gridColumns = Math.floor(gameWidth / this.gridSize);
        this.gridRows = Math.floor(gameHeight / this.gridSize);

        this.gridGraphics = this.add.graphics();
        this.drawGrid();

        const defaultBackground = gameBackgrounds[0];
        this.currentBackground = this.add
            .image(0, 0, defaultBackground.id)
            .setOrigin(0, 0)
            .setScale(defaultBackground.scale);

        EventBus.on("backgroundChanged", this.handleBackgroundChange, this);

        if (this.levelData) {
            setupLevel(this, this.levelData);
        }

        EventBus.on("themeChanged", this.handleThemeChange, this);
        EventBus.on("toolSelected", this.onToolSelected, this);
        this.input.on("pointerdown", this.handlePointerDown, this);
        EventBus.on("testLevel", () => this.testLevel(), this);

        this.saveLevelListener = (
            levelName: string,
            userId: string,
            levelId?: string,
        ) => this.saveLevel(levelName, userId, levelId);

        EventBus.on("saveLevelData", this.saveLevelListener, this);

        EventBus.on("publishLevelData", (levelName: string, userId: string) =>
            this.publishLevel(levelName, userId),
        );
    }

    shutdown() {
        EventBus.off("themeChanged", this.handleThemeChange);
        EventBus.off("toolSelected", this.onToolSelected);
        EventBus.off("testLevel");
        EventBus.off("backgroundChanged", this.handleBackgroundChange);
        EventBus.off("saveLevelData", this.saveLevelListener);
        EventBus.off("publishLevelData");
    }

    private handleBackgroundChange = (backgroundId: string) => {
        const backgroundConfig = gameBackgrounds.find(
            (bg) => bg.id === backgroundId,
        );

        if (backgroundConfig && this.currentBackground) {
            this.currentBackground.setTexture(backgroundId);
            this.currentBackground.setScale(backgroundConfig.scale);
        }
    };

    private handleThemeChange = (newTheme: LevelThemes) => {
        const currentState = {
            blocks: this.blocks.map((block) => ({
                x: block.x,
                y: block.y,
                blockId: block.blockId,
                baseId: block.baseId,
                rotation: block.rotation,
            })),
            enemies: this.enemies.map((enemy) => ({
                x: enemy.x,
                y: enemy.y,
                enemyId: enemy.enemyId,
                baseId: enemy.baseId,
            })),
            startPoint: this.startPoint
                ? {
                      x: this.startPoint.x,
                      y: this.startPoint.y,
                  }
                : undefined,
            endPoint: this.endPoint
                ? {
                      x: this.endPoint.x,
                      y: this.endPoint.y,
                  }
                : undefined,
            theme: newTheme,
            name: "temp",
            creator: "temp",
            createdAt: Date.now(),
        };

        this.levelTheme = newTheme;
        this.scene.restart(currentState);
    };

    private onToolSelected(tool: EditorTool) {
        if (tool.startsWith("background_")) {
            EventBus.emit("backgroundChanged", tool);
            return;
        }
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

        const themeConfig = gameThemes[this.levelTheme];

        const blockConfig = themeConfig.blocks.find(
            (block) => block.id === this.selectedTool,
        );
        const enemyConfig = themeConfig.enemies?.find(
            (enemy) => enemy.id === this.selectedTool,
        );

        if (blockConfig) {
            const block = new Block(this, x, y, this.levelTheme, blockConfig);
            this.blocks.push(block);
            return;
        }

        if (enemyConfig) {
            const enemy = new Enemy(this, x, y, this.levelTheme, enemyConfig);
            this.enemies.push(enemy);
            return;
        }

        switch (this.selectedTool) {
            case "start":
                if (this.startPoint) this.startPoint.destroy();
                this.startPoint = new StartPoint(this, x, y);
                break;
            case "end":
                if (this.endPoint) this.endPoint.destroy();
                this.endPoint = new EndPoint(this, x, y);
                break;
            case "delete": {
                const block = this.blocks.find(
                    (block) => block.x === x && block.y === y,
                );

                const enemy = this.enemies.find(
                    (enemy) => enemy.x === x && enemy.y === y,
                );

                if (enemy) {
                    enemy.destroy();
                    this.enemies = this.enemies.filter((e) => e !== enemy);
                }
                if (block) {
                    block.destroy();
                    this.blocks = this.blocks.filter((b) => b !== block);
                }
                if (this.startPoint?.x === x && this.startPoint?.y === y) {
                    this.startPoint.destroy();
                    this.startPoint = null;
                }
                if (this.endPoint?.x === x && this.endPoint?.y === y) {
                    this.endPoint.destroy();
                    this.endPoint = null;
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

    private async saveLevel(
        levelName: string,
        userId: string,
        levelId?: string,
    ) {
        const actualLevelId = levelId || this.levelId;

        const LevelData = {
            id: this.levelId || levelId,
            name: levelName,
            creator: userId,
            levelData: {
                blocks: this.blocks.map((block) => ({
                    x: block.x,
                    y: block.y,
                    blockId: block.blockId,
                    baseId: block.baseId,
                    rotation: block.rotation,
                })),
                enemies: this.enemies.map((enemy) => ({
                    x: enemy.x,
                    y: enemy.y,
                    enemyId: enemy.enemyId,
                    baseId: enemy.baseId,
                })),
                startPoint: this.startPoint
                    ? {
                          x: this.startPoint.x,
                          y: this.startPoint.y,
                      }
                    : null,
                endPoint: this.endPoint
                    ? {
                          x: this.endPoint.x,
                          y: this.endPoint.y,
                      }
                    : null,
                theme: this.levelTheme,
                backgroundId: this.currentBackground?.texture.key,
            },
        };

        try {
            const savedLevelId = await SaveLevel(LevelData, actualLevelId);
            this.levelId = savedLevelId;
            EventBus.emit("levelSaved", savedLevelId);
        } catch (error) {
            EventBus.emit("error", "Failed to save level");
        }
    }

    private async publishLevel(
        levelName: string,
        userId: string,
        levelId?: string,
    ) {
        if (!this.startPoint || !this.endPoint) {
            EventBus.emit("error", "Level must have both start and end points");
            return;
        }
        const LevelData = {
            id: levelId,
            name: levelName,
            creator: userId,
            levelData: {
                blocks: this.blocks.map((block) => ({
                    x: block.x,
                    y: block.y,
                    blockId: block.blockId,
                    baseId: block.baseId,
                    rotation: block.rotation,
                })),
                enemies: this.enemies.map((enemy) => ({
                    x: enemy.x,
                    y: enemy.y,
                    enemyId: enemy.enemyId,
                    baseId: enemy.baseId,
                })),
                startPoint: {
                    x: this.startPoint!.x,
                    y: this.startPoint!.y,
                },
                endPoint: {
                    x: this.endPoint.x,
                    y: this.endPoint.y,
                },

                theme: this.levelTheme,
                backgroundId: this.currentBackground?.texture.key,
            },
        };

        try {
            await publishLevel(LevelData, levelId);
            EventBus.emit("levelPublished");
        } catch (error) {
            EventBus.emit("error", "Failed to save level");
        }
    }

    private testLevel() {
        if (!this.startPoint) {
            EventBus.emit("error", "Level must have a start point");
            return;
        }

        const currentBackgroundId =
            gameBackgrounds.find(
                (bg) => bg.id === this.currentBackground.texture.key,
            )?.id || gameBackgrounds[0].id;

        const gameState: LevelData = {
            blocks: this.blocks.map((block) => ({
                x: block.x,
                y: block.y,
                blockId: block.blockId,
                rotation: block.rotation,
                baseId: block.baseId,
            })),
            enemies: this.enemies.map((enemy) => ({
                x: enemy.x,
                y: enemy.y,
                enemyId: enemy.enemyId,
                baseId: enemy.baseId,
            })),
            startPoint: this.startPoint
                ? {
                      x: this.startPoint.x,
                      y: this.startPoint.y,
                  }
                : undefined,
            endPoint: this.endPoint
                ? {
                      x: this.endPoint.x,
                      y: this.endPoint.y,
                  }
                : undefined,
            theme: this.levelTheme,
            backgroundId: currentBackgroundId,
        };

        if (this.startPoint) {
            this.scene.start("TestGame", gameState);
            EventBus.emit("testModeReady");
        }
    }

    public setTheme(theme: LevelThemes) {
        this.levelTheme = theme;
        this.scene.restart();
    }
}

