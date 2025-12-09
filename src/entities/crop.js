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

        this.timer = 0;

        this.crops = [];
        this.createCropGrid();
    }

    createCropGrid() {
        for(let i = 0; i < this.mapWidth; i++) {
            for(let j = 0; j < this.mapHeight; j++) {
                this.crops.push({
                    x: i*this.tileSize, 
                    y: j*this.tileSize, 
                    state:0, // 0 = empty, 1 = growing, 2 = ready
                    timer:0
                });
            }
        }
        return this.crops;
    }

    setOffset(x, y) {
        this.startX = x;
        this.startY = y;
    }
}