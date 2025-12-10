/**
 * 
 * Handles crop status and animation
 * 
 * States: seed -> growing -> ready
 * Timers
 * Animation / texture switching
 * 
 */
class Crops {
    constructor(sprite) {
        this.sprite = sprite;

        this.tileSize = 8;
        this.mapWidth = CROP_WIDTH;
        this.mapHeight = CROP_HEIGHT;

        this.name = null;

        this.timeUntilGrown = 10000 // ms

        this.crops = [];
        this.createCropGrid();
    }

    createCropGrid() {
        for(let i = 0; i < this.mapWidth; i++) {
            for(let j = 0; j < this.mapHeight; j++) {
                this.crops.push({
                    x: i * this.tileSize, 
                    y: j * this.tileSize, 
                    state:0, // 0 = empty, 1 = growing, 2 = ready
                    timer:0,
                    type: null // can be radish or wheat
                });
            }
        }
        return this.crops;
    }

    setOffset(x, y) {
        this.startX = x;
        this.startY = y;
    }

    updateToGrown(dt) {
        for(const crop of this.crops) {
            if(crop.state === 1) {
                crop.timer += dt;

                if(crop.timer >= this.timeUntilGrown) {
                    crop.state = 2;
                    crop.timer = 0;

                    const tileX = crop.x / TILE_SIZE + this.startX;
                    const tileY = crop.y / TILE_SIZE + this.startY;

                    const index = tileY * MAP_WIDTH + tileX;

                    if(crop.type === "radish") {
                        MAP[index].tileIndex = CROP_TILES["grown radish"];
                    } else if(crop.type === "wheat") {
                        MAP[index].tileIndex = CROP_TILES["grown wheat"];
                    }
                }
            }
        }
    }
}