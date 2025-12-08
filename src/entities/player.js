/**
 * 
 * Handles player actions
 * 
 * Movement
 * Animation frame
 * Interacting with tiles
 * 
 */

class Player {
    constructor(sprite, x=0, y=0, speed=2.0, direction="down") {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;

        this.frame = 0;
        this.frameTimer = 0;

        this.holdingItem = null;
        this.inventory = {};
        this.money = 0;
    }

    move(dx, dy, map) {
        this.x += dx * this.speed;
        this.y += dy * this.speed;

        this.updateDirection(dx, dy);

        this.checkCollision(map);
    }

    updateDirection(dx, dy) {
        if(dx > 0) this.direction = "right";
        else if(dx < 0) this.direction = "left";
        else if(dy > 0) this.direction = "down";
        else if(dy < 0) this.direction = "up";
    }

    updateAnimation(delta) {
        this.frameTimer += delta;

        if(this.frameTimer > 200) {
            this.frame = (this.frame + 1) % this.sprite.frames;
            this.frameTimer = 0;
        }
    }

    draw(gl) {

    }

    plantCrop(tileX, tileY) {

    }

    harvestCrop(tileX, tileY) {

    }

    addItem(item) {

    }

    deleteItem(item) {

    }
}