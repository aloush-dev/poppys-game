import { gameThemes } from "@/lib/gameThemes";
import { useLevelEditorStore } from "@/stores/useLevelEditorStore";
import { LevelEditor } from "./LevelEditor";

export class PointerHandler {
    private scene: LevelEditor;

    constructor(scene: LevelEditor) {
        this.scene = scene;
    }

    handlePointerDown(pointer: Phaser.Input.Pointer): void {
        const store = useLevelEditorStore.getState();
        const selectedTool = store.selectedTool;

        if (!selectedTool) return;

        if (
            pointer.x < 0 ||
            pointer.x > this.scene.gridColumns * this.scene.gridSize ||
            pointer.y < 0 ||
            pointer.y > this.scene.gridRows * this.scene.gridSize
        ) {
            return;
        }

        const x = this.scene.gridUtils.snapToGrid(pointer.x);
        const y = this.scene.gridUtils.snapToGrid(pointer.y);
        const themeConfig = gameThemes[store.levelData.theme];

        const blockConfig = themeConfig.blocks.find(
            (block) => block.id === selectedTool,
        );
        const enemyConfig = themeConfig.enemies?.find(
            (enemy) => enemy.id === selectedTool,
        );

        if (blockConfig) {
            store.addBlock({
                x,
                y,
                blockId: blockConfig.id,
                baseId: blockConfig.baseId || blockConfig.id,
            });
            return;
        }

        if (enemyConfig) {
            store.addEnemy({
                x,
                y,
                enemyId: enemyConfig.id,
                baseId: enemyConfig.baseId || enemyConfig.id,
            });
            return;
        }

        switch (selectedTool) {
            case "start":
                store.setStartPoint({ x, y });
                break;
            case "end":
                store.setEndPoint({ x, y });
                break;
            case "delete": {
                store.removeBlock(x, y);
                store.removeEnemy(x, y);

                const startPoint = store.levelData?.startPoint;
                if (startPoint && startPoint.x === x && startPoint.y === y) {
                    store.setStartPoint(null);
                }

                const endPoint = store.levelData?.endPoint;
                if (endPoint && endPoint.x === x && endPoint.y === y) {
                    store.setEndPoint(null);
                }
                break;
            }
        }
    }
}

