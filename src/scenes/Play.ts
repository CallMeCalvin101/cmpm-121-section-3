import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;

  scrollSpeed = -4;

  shipSize = 50;
  shipSpeed = 0.5;
  shipColor = 0xff0000;
  canMove = true;

  heightOffset = 100;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.spinner = this.add.rectangle(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) - this.heightOffset,
      this.shipSize,
      this.shipSize,
      this.shipColor,
    );
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX += this.scrollSpeed;

    if (this.left!.isDown && this.canMove) {
      this.spinner!.x -= delta * this.shipSpeed;
    }
    if (this.right!.isDown && this.canMove) {
      this.spinner!.x += delta * this.shipSpeed;
    }

    if (this.fire!.isDown && this.canMove) {
      this.canMove = false;
      this.tweens.add({
        targets: this.spinner,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });
      this.canMove = true;
    }
  }
}
