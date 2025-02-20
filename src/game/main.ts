import { AUTO, Game, Scale } from "phaser";
import { LevelCreator } from "./scenes/LevelCreator";
import { PlayGame } from "./scenes/PlayGame";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 960,
    height: 640,
    parent: "game-container",
    backgroundColor: "#000000",
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    scene: [LevelCreator],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

