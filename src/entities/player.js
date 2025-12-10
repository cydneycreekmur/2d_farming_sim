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
    constructor(x=0, y=0, speed=1.5, direction="down") {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;

        this.frame = 0;
        this.frameTimer = 0;

        this.selectedSeed = "radish";

        this.inventory = {
            "radish_seeds": 50,
            "wheat_seeds": 0,
            "radishes": 0,
            "wheat": 0
        };
        this.money = 100;

        this.lastActionTime = 0;
        this.actionCooldown = 2000;
    }

    move(dx, dy) {
        const nextX = this.x + dx * this.speed;
        const nextY = this.y + dy * this.speed;

        const oldX = this.x;
        const oldY = this.y;

        this.x = nextX;
        this.y = nextY;

        if (this.checkCollision()) {
            this.x = oldX;
            this.y = oldY;
            return;
        }

        this.updateDirection(dx, dy);
    }

    checkCollision() {
        const left = this.x;
        const right = this.x + PLAYER_SIZE - 1;
        const top = this.y;
        const bottom = this.y + PLAYER_SIZE - 1;

        const corners = [
            {tx: Math.floor(left / TILE_SIZE),  ty: Math.floor(top / TILE_SIZE)},
            {tx: Math.floor(right / TILE_SIZE), ty: Math.floor(top / TILE_SIZE)},
            {tx: Math.floor(left / TILE_SIZE),  ty: Math.floor(bottom / TILE_SIZE)},
            {tx: Math.floor(right / TILE_SIZE), ty: Math.floor(bottom / TILE_SIZE)}
        ];
        for(const c of corners) {
            const index = c.ty * MAP_WIDTH + c.tx;
            const tile = MAP[index];

            if(!tile) return false;

            if(tile.isMapBorder) return true; // collision
        }
        return false;
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

    update(dt, input) {
        let dx = 0, dy = 0;
        if (input.keys["w"]) dy = -1;
        if (input.keys["s"]) dy = 1;
        if (input.keys["a"]) dx = -1;
        if (input.keys["d"]) dx = 1;
        if (dx || dy) this.move(dx, dy);
    }


    getTilePosition() {
        const centerX = this.x + PLAYER_SIZE / 2;
        const centerY = this.y + PLAYER_SIZE / 2;

        return {
            tileX: Math.floor(centerX / TILE_SIZE),
            tileY: Math.floor(centerY / TILE_SIZE)
        }
    }

    setSelectedSeed(type) {
        if(type === "radish" || type === "wheat") {
            this.selectedSeed = type;
        }
    }

    plantCrop(game) {

        const{tileX, tileY} = this.getTilePosition();

        const tile = MAP.find(t => t.x / TILE_SIZE === tileX && t.y / TILE_SIZE === tileY);

        const cx = tileX - game.crops.startX;
        const cy = tileY - game.crops.startY;

        const crop = game.crops.crops.find(c =>
            c.x / TILE_SIZE === cx &&
            c.y / TILE_SIZE === cy
        );
        let seedType = this.selectedSeed;

        const outOfPlantingBounds = !tile || !tile.isCropArea;

        if(outOfPlantingBounds) {
            this.cropMessages(true, false, false);
            return;
        }
        if(!crop) return;

        const alreadyPlanted = crop.state == 1;

        if(alreadyPlanted) {
            return;
        }
        const outOfRadishSeeds = this.inventory.radish_seeds <= 0;
        const outOfWheatSeeds = this.inventory.wheat_seeds <= 0;

        if((seedType === "radish" && outOfRadishSeeds) || (seedType === "wheat" && outOfWheatSeeds)) {
            this.cropMessages(false, false, true);
            return;
        }    
        if(crop.state === 2) return;
        
        crop.state = 1;
        crop.timer = 0;

        if(seedType === "radish") {
            this.inventory.radish_seeds--;
        } else if(seedType === "wheat") {
            this.inventory.wheat_seeds--;
        }
        updateSeedCounter(this);

        if(seedType === "radish") {
            tile.tileIndex = CROP_TILES["radish seedling"];
        } else if(seedType === "wheat") {
            tile.tileIndex = CROP_TILES["wheat seedling"];
        }
        crop.type = seedType;
    }

    harvestCrop(game) {
        const{tileX, tileY} = this.getTilePosition();

        const tile = MAP.find(t => t.x / TILE_SIZE === tileX && t.y / TILE_SIZE === tileY);

        const cx = tileX - game.crops.startX;
        const cy = tileY - game.crops.startY;

        const crop = game.crops.crops.find(c =>
            c.x / TILE_SIZE === cx &&
            c.y / TILE_SIZE === cy
        );
        let seedType = this.selectedSeed;

        const outOfPlantingBounds = !tile || !tile.isCropArea;

        if(outOfPlantingBounds) {
            this.cropMessages(true, false, false);
            return;
        }
        if(!crop) return;

        if(crop.state === 1) {
            showMessage("Crop not ready...");
            return;
        }

        if(crop.state === 2) {
            if(tile.tileIndex === 33) {
                this.inventory.radishes++;
            } else if(tile.tileIndex === 46) {
                this.inventory.wheat++;
            } else {
                showMessage("Undiscovered crop detected...");
            }
        }
        crop.state = 0;
        crop.timer = 0;
        crop.type = null;

        tile.tileIndex = CROP_TILES["full dirt"];
    }
    
    cropMessages(outOfPlantingBounds, outOfSeeds) {
        const now = performance.now();
        if(now - this.lastActionTime < this.actionCooldown) return;

        this.lastActionTime = now;

        // messages
        const randomLogsPlanting = [
            "No planting here...",
            "Hey! Stop that! >:(",
            "This soil isn't tilled...",
            "You have to plant on the brown stuff."
        ];
        const randomLogsOutOfSeeds = [
            "You're out of seeds!",
            "Buy more seeds!",
            "What are you planting? You've got no seeds!"
        ];

        if(outOfPlantingBounds) {
            showMessage(randomLogsPlanting[Math.floor(Math.random() * randomLogsPlanting.length)]);
        } else if(outOfSeeds) {
            showMessage(randomLogsOutOfSeeds[Math.floor(Math.random() * randomLogsOutOfSeeds.length)]);
        }
    }
}