import Phaser from "phaser";

export class Emojipop extends Phaser.Scene {
  boardWidth: number;
  boardHeight: number;
  xOffset: number;
  yOffset: number;
  bubbleSize: number;
  launcher: Phaser.Physics.Arcade.Image;
  bubbles: Phaser.Physics.Arcade.Group;
  board: Phaser.Physics.Arcade.Image[][];
  shooting: boolean;
  movingBubble: Phaser.Physics.Arcade.Image | null;

  launcherSpeed = 600;

  constructor() {
    super("Emojipop");
  }

  preload() {
    // Load your bubble images here
    this.load.image("bubble1", "game/skull_emoji.png");
    this.load.image("bubble2", "game/lion_emoji.png");
    this.load.image("bubble3", "game/monkey_emoji.png");

    // Load cannon image here
    this.load.image("cannon", "game/cannon.png");
  }

  init() {
    // Generate your board here
    this.boardWidth = 15;
    this.boardHeight = 6;
    this.bubbleSize = 50; // Change this according to your desired bubble size
    this.xOffset = 50;
    this.yOffset = 50;
    this.bubbles = this.physics.add.group();
    this.shooting = false;
  }

  create() {
    // Generate your board here
    this.board = this.generateBoard(this);

    // this.physics.add.collider(
    //   this.bubbles,
    //   this.bubbles,
    //   this.handleBubbleCollision,
    //   undefined,
    //   this
    // );

    // Add the bubbles on the board to the bubbles group
    for (let y = 0; y < this.boardHeight; y++) {
      for (let x = 0; x < this.boardWidth; x++) {
        this.bubbles.add(this.board[y][x]);
      }
    }

    this.launcher = this.physics.add.image(400, 550, "launcher");

    // Scale the launcher to the desired size
    const launcherScale = this.bubbleSize / this.launcher.width;
    this.launcher.setScale(launcherScale);

    // Set the launcher angle
    this.launcher.setAngle(-90);

    // Add more game elements here

    // Add input event listeners
    this.input.on("pointermove", this.updateLauncherAngle, this);
    this.input.on("pointerdown", this.shootBubble, this);
  }

  updateLauncherAngle(pointer: Phaser.Input.Pointer) {
    const dx = pointer.x - this.launcher.x;
    const dy = pointer.y - this.launcher.y;
    const angle = Phaser.Math.RadToDeg(Math.atan2(dy, dx));
    this.launcher.setAngle(angle);
  }

  shootBubble() {
    // Don't shoot if we're already shooting
    if (this.shooting) {
      return;
    }

    this.shooting = true;

    // Get a random image key for the bubble
    const bubbleImage = this.getRandomBubbleImageKey();

    // Create the bubble at the launcher position
    const bubble = this.physics.add.sprite(
      this.launcher.x,
      this.launcher.y - this.bubbleSize - 5,
      bubbleImage
    );

    // Scale the bubble to the desired size
    const scale = this.bubbleSize / bubble.width;
    bubble.setScale(scale);

    // Set bubble velocity based on launcher angle
    const angle = Phaser.Math.DegToRad(this.launcher.angle);
    const velocityX = Math.cos(angle) * this.launcherSpeed;
    const velocityY = Math.sin(angle) * this.launcherSpeed;
    bubble.setVelocity(10000, 10000);

    console.log(velocityX, velocityY);

    // Add the bubble to the bubbles group
    this.bubbles.add(bubble);
  }

  snapToGrid(bubble: Phaser.Physics.Arcade.Image) {
    const snappedX =
      Math.round((bubble.x - this.xOffset) / this.bubbleSize) *
        this.bubbleSize +
      this.xOffset;
    const snappedY =
      Math.round((bubble.y - this.yOffset) / this.bubbleSize) *
        this.bubbleSize +
      this.yOffset;
    bubble.setPosition(snappedX, snappedY);
  }

  handleBubbleCollision(
    bubble1: Phaser.Physics.Arcade.Image,
    bubble2: Phaser.Physics.Arcade.Image
  ) {
    // Snap the moving bubble to the grid
    const movingBubble = bubble1.body.velocity.length() > 0 ? bubble1 : bubble2;
    this.snapToGrid(movingBubble);

    // Stop the moving bubble
    movingBubble.body.stop();

    // Check for matches and clear bubbles
    const matches = this.checkMatches(this, movingBubble);
    if (matches.length >= 3) {
      this.clearMatches(matches);
    }

    this.shooting = false;
  }

  checkMatches(scene: Phaser.Scene, bubble: Phaser.Physics.Arcade.Image) {
    const { x, y } = this.getGridPosition(bubble);
    const board = this.board;
    const visited = new Set();
    const matches = [];
    const stack = [{ x, y }];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) {
        break;
      }

      const key = `${current?.x},${current?.y}`;

      if (!visited.has(key)) {
        visited.add(key);
        const currentBubble = board[current.y][current.x];

        if (currentBubble && currentBubble.texture.key === bubble.texture.key) {
          matches.push(currentBubble);

          // Get neighboring bubbles
          const neighbors = this.getNeighbors(board, current.x, current.y);
          neighbors.forEach((neighbor) => {
            const { x, y } = this.getGridPosition(neighbor);
            const neighborKey = `${x},${y}`;

            if (!visited.has(neighborKey)) {
              stack.push({ x, y });
            }
          });
        }
      }
    }

    return matches;
  }

  clearMatches(matches: Phaser.Physics.Arcade.Image[]) {
    // Remove the matched bubbles from the bubbles group and destroy them
    matches.forEach((match) => {
      this.bubbles.remove(match, true, true);
    });
  }

  getNeighbors(board: Phaser.Physics.Arcade.Image[][], x: number, y: number) {
    const neighbors = [];

    // Get left and right neighbors
    if (x > 0) neighbors.push(board[y][x - 1]);
    if (x < this.boardWidth - 1) neighbors.push(board[y][x + 1]);

    // Get top and bottom neighbors
    if (y > 0) neighbors.push(board[y - 1][x]);
    if (y < this.boardHeight - 1) neighbors.push(board[y + 1][x]);

    return neighbors;
  }

  getGridPosition(bubble: Phaser.Physics.Arcade.Image) {
    const x = Math.round((bubble.x - this.xOffset) / this.bubbleSize);
    const y = Math.round((bubble.y - this.yOffset) / this.bubbleSize);
    return { x, y };
  }

  update() {
    // Add your game logic and interactions here
  }

  generateBoard(scene: Phaser.Scene) {
    const board = [];

    for (let y = 0; y < this.boardHeight; y++) {
      const row = [];
      for (let x = 0; x < this.boardWidth; x++) {
        // You can use any logic to assign different images for the bubbles
        const bubbleImage = this.getRandomBubbleImageKey();

        // Create the bubble sprite
        const bubble = scene.physics.add.image(
          this.xOffset + x * this.bubbleSize,
          this.yOffset + y * this.bubbleSize,
          bubbleImage
        );

        // Scale the bubble to the desired size
        const scale = this.bubbleSize / bubble.width;
        bubble.setScale(scale);

        // Add the bubble to the row
        row.push(bubble);
      }
      board.push(row);
    }

    return board;
  }

  getRandomBubbleImageKey() {
    const imageKeys = ["bubble1", "bubble2", "bubble3"];
    const randomIndex = Math.floor(Math.random() * imageKeys.length);
    return imageKeys[randomIndex];
  }
}
