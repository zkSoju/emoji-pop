import { Emojipop } from "@/game/emojipop/scenes/emojipop";
import { Types } from "phaser";

const gameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#222",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: Emojipop,
};

export default gameConfig;
