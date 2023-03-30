const COLORS = ["#0000ff", "#00ff00", "#ffff00", "#ff8000", "#ff0000"];

class Bubble {
  posX: number;
  posY: number;
  color: string;
  vel: number;
  radius: number;
  angle: number;

  constructor(posX: number, posY: number, color: string) {
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.vel = 0;
    this.radius = 30;
    this.angle = 0;
  }
}
