import { AUTO, Game } from "phaser";
import { LevelCreator } from "./scenes/LevelCreator";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1025,
    height: 1025,
    parent: "game-container",
    backgroundColor: "#000000",
    scene: [LevelCreator],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

