import { useLevelEditorStore } from "@/stores/useLevelEditorStore";
import { gameThemes } from "../../lib/gameThemes";
import { EnemyConfig } from "../../lib/types";

export class Enemy extends Phaser.GameObjects.Image {
    public enemyId: string;
    public baseId: string;
    public body: Phaser.Physics.Arcade.StaticBody;
    public config: EnemyConfig;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        theme: string,
        enemyConfig: EnemyConfig,
    ) {
        super(scene, x, y, enemyConfig.id);
        const themeConfig = gameThemes[theme];

        this.enemyId = enemyConfig.id;
        this.baseId = enemyConfig.baseId;
        this.config = enemyConfig;
        this.body = this.body as Phaser.Physics.Arcade.StaticBody;

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        const scale = 32 / themeConfig.blockSize;
        this.setOrigin(0, 0);
        this.setScale(scale);

        this.body.setSize(10, 10);
        this.body.position.set(x, y);
        this.body.updateFromGameObject();

        if (scene.scene.key === "LevelEditor") {
            this.setInteractive();
            scene.input.setDraggable(this);
            this.setupDragEvents(scene);
        }
    }

    private setupDragEvents(scene: Phaser.Scene) {
        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Enemy,
                dragX: number,
                dragY: number,
            ) => {
                if (gameObject === this) {
                    const store = useLevelEditorStore.getState();
                    if (store.selectedTool === "select") {
                        const snappedX = Math.floor(dragX / 32) * 32;
                        const snappedY = Math.floor(dragY / 32) * 32;

                        this.setPosition(snappedX, snappedY);
                        if (this.body) {
                            this.body.position.set(snappedX, snappedY);
                            this.body.updateFromGameObject();
                        }

                        store.updateBlock(snappedX, snappedY, this.enemyId);
                    }
                }
            },
        );
    }
}

