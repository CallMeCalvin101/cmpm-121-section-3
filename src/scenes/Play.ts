import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

const shipSize: number = 50;
const shipSpeed: number = 0.5;
const shipColor: number = 0xff0000;
let canMove: boolean = true;

const bulletSize = 10;
const bulletSpeed = 0.5;
let bulletAlive = false;

const heightOffset: number = 100;

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  ship?: Phaser.GameObjects.Shape;
  bullet?: Phaser.GameObjects.Shape;
  enemy?: Phaser.GameObjects.Shape;

  scrollSpeed: number = -4;

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

    this.ship = this.add.rectangle(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) - heightOffset,
      shipSize,
      shipSize,
      shipColor,
    );

    this.enemy = this.add.rectangle(
      this.game.config.width as number,
      heightOffset,
      shipSize,
      shipSize,
      shipColor,
    );
  }

  moveShip(factor: number) {
    if (canMove) {
      this.ship!.x += factor * shipSpeed;
    }
  }

  moveBullet(factor: number) {
    this.bullet!.y -= factor * bulletSpeed;
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX += this.scrollSpeed;

    if (this.left!.isDown) {
      this.moveShip(delta * -1);
    }
    if (this.right!.isDown) {
      this.moveShip(delta * 1);
    }

    if (this.fire!.isDown && canMove && !bulletAlive) {
      canMove = false;
      this.bullet = this.add.rectangle(
        this.ship?.x,
        this.ship!.y - shipSize / 2 - bulletSize / 2,
        bulletSize,
        bulletSize,
        0xffffff,
      );
      bulletAlive = true;
    }

    if (bulletAlive) {
      this.moveBullet(delta);

      if (this.bullet!.y < -bulletSize / 2) {
        bulletAlive = false;
        canMove = true;
      }
    }
  }
}
