import { Scene } from "phaser";
import { Block } from "@/game/tools/Block";
import { Enemy } from "@/game/tools/Enemy";
import { EndPoint, StartPoint } from "@/game/tools/Points";
import { useLevelEditorStore } from "@/stores/useLevelEditorStore";
import { gameThemes, gameBackgrounds } from "@/lib/gameThemes";
import { GridUtils } from "./gridUtils";
import { PointerHandler } from "./PointerHandler";
import { BlockData, EnemyData, PointData } from "@/lib/types";
import { loadThemeAssets } from "../SceneSetup";

export class LevelEditor extends Scene {
    public gridSize: number = 32;
    public gridColumns: number;
    public gridRows: number;
    public gridGraphics: Phaser.GameObjects.Graphics;
    public currentBackground: Phaser.GameObjects.Image;

    public blocks: { [key: string]: Block } = {};
    public enemies: { [key: string]: Enemy } = {};
    public startPoint: StartPoint | null = null;
    public endPoint: EndPoint | null = null;

    public gridUtils: GridUtils;
    public pointerHandler: PointerHandler;

    private unsubscribeStore: (() => void)[] = [];

    constructor() {
        super({ key: "LevelEditor" });
        this.gridUtils = new GridUtils(this);
        this.pointerHandler = new PointerHandler(this);
    }

    preload() {
        loadThemeAssets(this, useLevelEditorStore.getState().levelData);
    }

    create() {
        if (
            this.scene.isActive("LevelEditor") &&
            this.scene.key !== "LevelEditor"
        ) {
            console.warn(
                "Duplicate LevelEditor detected, stopping this instance",
            );
            this.scene.stop(this.scene.key);
            return;
        }

        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        this.gridColumns = Math.floor(gameWidth / this.gridSize);
        this.gridRows = Math.floor(gameHeight / this.gridSize);

        this.cleanupGameObjects();

        this.gridGraphics = this.add.graphics();
        this.gridUtils.drawGrid();

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.pointerHandler.handlePointerDown(pointer);
        });

        this.setupStoreSubscriptions();

        this.renderFromStore();
    }

    private setupStoreSubscriptions() {
        this.unsubscribeStore.forEach((unsubscribe) => unsubscribe());
        this.unsubscribeStore = [];

        this.unsubscribeStore.push(
            useLevelEditorStore.subscribe((state) => {
                if (!state.levelData) return;

                if (
                    !this.scene ||
                    !this.scene.manager ||
                    this.scene.isActive() === false
                ) {
                    return;
                }

                try {
                    this.syncBlocks(state.levelData.blocks || []);
                    this.syncEnemies(state.levelData.enemies || []);
                    this.syncStartPoint(state.levelData.startPoint ?? null);
                    this.syncEndPoint(state.levelData.endPoint ?? null);

                    const backgroundId =
                        state.levelData.backgroundId || "background_1";
                    if (
                        this.currentBackground?.getData("backgroundId") !==
                        backgroundId
                    ) {
                        this.handleBackgroundChange(backgroundId);
                    }
                } catch (error) {
                    console.error("Error in store subscription:", error);
                }
            }),
        );
    }

    private renderFromStore() {
        if (!this.cameras?.main) {
            console.warn("Camera not ready in renderFromStore");
            this.time.delayedCall(50, () => {
                this.renderFromStore();
            });
            return;
        }

        const store = useLevelEditorStore.getState();

        try {
            this.cleanupGameObjects();

            if (store.levelData) {
                this.handleBackgroundChange(
                    store.levelData.backgroundId || "background_1",
                );

                if (
                    store.levelData.blocks &&
                    store.levelData.blocks.length > 0
                ) {
                    this.syncBlocks(store.levelData.blocks);
                }

                if (
                    store.levelData.enemies &&
                    store.levelData.enemies.length > 0
                ) {
                    this.syncEnemies(store.levelData.enemies);
                }

                this.syncStartPoint(store.levelData.startPoint ?? null);
                this.syncEndPoint(store.levelData.endPoint ?? null);
            }
        } catch (error) {
            console.error("Error in renderFromStore:", error);
        }
    }

    private syncBlocks(blocks: BlockData[]) {
        const currentBlockKeys: { [key: string]: boolean } = {};

        blocks.forEach((blockData: BlockData) => {
            const key = `${blockData.x}-${blockData.y}`;
            currentBlockKeys[key] = true;

            const existingBlock = this.blocks[key];
            if (!existingBlock) {
                const blockConfig = this.getBlockConfig(blockData.blockId);
                if (blockConfig) {
                    this.blocks[key] = new Block(
                        this,
                        blockData.x,
                        blockData.y,
                        this.getStore().levelData.theme,
                        blockConfig,
                    );
                }
            } else if (existingBlock.blockId !== blockData.blockId) {
                existingBlock.destroy();
                const blockConfig = this.getBlockConfig(blockData.blockId);
                if (blockConfig) {
                    this.blocks[key] = new Block(
                        this,
                        blockData.x,
                        blockData.y,
                        this.getStore().levelData.theme,
                        blockConfig,
                    );
                }
            }
        });

        Object.keys(this.blocks).forEach((key) => {
            if (!currentBlockKeys[key]) {
                this.blocks[key].destroy();
                delete this.blocks[key];
            }
        });
    }

    private syncEnemies(enemies: EnemyData[]) {
        const currentEnemyKeys: { [key: string]: boolean } = {};

        enemies.forEach((enemyData) => {
            const key = `${enemyData.x}-${enemyData.y}`;
            currentEnemyKeys[key] = true;

            if (!this.enemies[key]) {
                const enemyConfig = this.getEnemyConfig(enemyData.baseId);
                if (enemyConfig) {
                    this.enemies[key] = new Enemy(
                        this,
                        enemyData.x,
                        enemyData.y,
                        this.getStore().levelData.theme,
                        enemyConfig,
                    );
                }
            } else if (this.enemies[key].enemyId !== enemyData.enemyId) {
                this.enemies[key].destroy();
                const enemyConfig = this.getEnemyConfig(enemyData.baseId);
                if (enemyConfig) {
                    this.enemies[key] = new Enemy(
                        this,
                        enemyData.x,
                        enemyData.y,
                        this.getStore().levelData.theme,
                        enemyConfig,
                    );
                }
            }
        });

        Object.keys(this.enemies).forEach((key) => {
            if (!currentEnemyKeys[key]) {
                this.enemies[key].destroy();
                delete this.enemies[key];
            }
        });
    }

    private syncStartPoint(startPoint: PointData | null) {
        if (this.startPoint) {
            this.startPoint.destroy();
            this.startPoint = null;
        }

        if (startPoint) {
            this.startPoint = new StartPoint(this, startPoint.x, startPoint.y);
        }
    }

    private syncEndPoint(endPoint: PointData | null) {
        if (this.endPoint) {
            this.endPoint.destroy();
            this.endPoint = null;
        }

        if (endPoint) {
            this.endPoint = new EndPoint(this, endPoint.x, endPoint.y);
        }
    }

    private handleBackgroundChange(backgroundId: string) {
        if (!this.cameras || !this.cameras.main) {
            console.warn("Camera system not ready in handleBackgroundChange");
            this.game.events.once("postupdate", () => {
                this.handleBackgroundChange(backgroundId);
            });
            return;
        }

        if (this.currentBackground) {
            this.currentBackground.destroy();
        }

        const background = gameBackgrounds.find((bg) => bg.id === backgroundId);
        if (background) {
            this.currentBackground = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                backgroundId,
            );
            this.currentBackground.setScale(background.scale);
            this.currentBackground.setDepth(-10);
            this.currentBackground.setData("backgroundId", backgroundId);
        }
    }

    private getBlockConfig(blockId: string) {
        const theme = this.getStore().levelData.theme;
        return gameThemes[theme].blocks.find(
            (b) => b.id === blockId || b.baseId === blockId,
        );
    }

    private getEnemyConfig(enemyId: string) {
        const theme = this.getStore().levelData.theme;
        return gameThemes[theme].enemies?.find(
            (e) => e.id === enemyId || e.baseId === enemyId,
        );
    }

    private getStore() {
        return useLevelEditorStore.getState();
    }

    private cleanupGameObjects() {
        Object.values(this.blocks).forEach((block) => block.destroy());
        Object.values(this.enemies).forEach((enemy) => enemy.destroy());
        if (this.startPoint) this.startPoint.destroy();
        if (this.endPoint) this.endPoint.destroy();

        this.blocks = {};
        this.enemies = {};
        this.startPoint = null;
        this.endPoint = null;
    }

    shutdown() {
        this.unsubscribeStore.forEach((unsubscribe) => unsubscribe());
        this.unsubscribeStore = [];

        Object.values(this.blocks).forEach((block) => block.destroy());
        Object.values(this.enemies).forEach((enemy) => enemy.destroy());
        if (this.startPoint) this.startPoint.destroy();
        if (this.endPoint) this.endPoint.destroy();
        if (this.currentBackground) this.currentBackground.destroy();

        this.blocks = {};
        this.enemies = {};
        this.startPoint = null;
        this.endPoint = null;
    }
}

