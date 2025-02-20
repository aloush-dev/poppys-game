import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { LevelData, TempLevelData } from "../../lib/types";
import { Block } from "../tools/Block";
import { StartPoint, EndPoint } from "../tools/Points";

export class PlayGame extends Scene {
    private levelData: LevelData | TempLevelData;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private blocks: Block[] = [];
    private startPoint: StartPoint;
    private endPoint: EndPoint;

    constructor() {
        super("Game");
    }

    init(data: { levelData: LevelData }) {
        const tempLevel = localStorage.getItem("tempLevel");
        this.levelData = tempLevel
            ? (JSON.parse(tempLevel) as TempLevelData)
            : data.levelData;
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
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        this.createLevel();

        EventBus.emit("current-scene-ready", this);
    }

    private createLevel() {
        this.levelData.blocks.forEach((block) => {
            this.blocks.push(new Block(this, block.x, block.y, block.type));
        });

        this.startPoint = new StartPoint(
            this,
            this.levelData.startPoint.x,
            this.levelData.startPoint.y,
        );
        this.endPoint = new EndPoint(
            this,
            this.levelData.endPoint.x,
            this.levelData.endPoint.y,
        );
    }
}

