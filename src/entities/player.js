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

    getTilePosition() {
        return {
            tileX: Math.floor(this.x / TILE_SIZE),
            tileY: Math.floor(this.y / TILE_SIZE)
        }
    }

    draw(gl) {

    }

    plantCrop(game) {
        const{tileX, tileY} = this.getTilePosition();

        const tile = game.map.find(t => t.x / TILE_SIZE === tileX && t.y / TILE_SIZE === tileY);
        const randomLogsPlanting = [
            "No planting here...",
            "Hey! Stop that! >:(",
            "This soil isn't tilled...",
            "You have to plant on the brown stuff."
        ];
        const randomLogsAlreadyPlanted = [
            "There's already a plant growing in this dirt.",
            "Find a different plot of dirt.",
            "Home occupied, please find another :)"
        ];
        if(!tile || !tile.isCropArea) {
            console.log(randomLogsPlanting[Math.floor(Math.random() * randomLogsPlanting.length)]);
            return;
        }
        const crop = game.crops.crops.find(c => c.x / TILES_SIZE === tileX && c.y / TILE_SIZE === tileY);

        if(!crop) return;

        if(crop.state == 1) {
            console.log(randomLogsAlreadyPlanted[Math.floor(Math.random() * randomLogsAlreadyPlanted.length)]);
            return;
        }
        crop.state = 1;
        crop.timer = 0;

        tile.tileIndex = CROP_TILES["radish seedling"];
    }

    harvestCrop(tileX, tileY) {

    }

    addItem(item) {

    }

    deleteItem(item) {

    }
}