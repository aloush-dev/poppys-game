import { useLevelEditorStore } from "@/stores/useLevelEditorStore";
import { gameThemes } from "../../lib/gameThemes";
import { BlockConfig } from "../../lib/types";

export class Block extends Phaser.GameObjects.Image {
    public blockId: string;
    public baseId: string;
    public body: Phaser.Physics.Arcade.StaticBody;
    public config: BlockConfig;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        theme: string,
        blockConfig: BlockConfig,
    ) {
        super(scene, x, y, blockConfig.id);

        const themeConfig = gameThemes[theme];

        this.blockId = blockConfig.id;
        this.baseId = blockConfig.baseId;
        this.config = blockConfig;

        const scale = 32 / themeConfig.blockSize;
        this.setOrigin(0, 0);
        this.setScale(scale);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.body = this.body as Phaser.Physics.Arcade.StaticBody;

        this.body.setSize(32, 32);
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
                gameObject: Block,
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

                        store.updateBlock(snappedX, snappedY, this.blockId);
                    }
                }
            },
        );
    }
}

