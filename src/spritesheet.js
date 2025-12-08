/**
 * 
 * Cuts sprites from spritesheet
 * 
 */

class SpriteSheet {
    constructor(image, tileWidth, tileHeight) {
        this.image = image;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.columns = Math.floor(image.width / tileWidth);
    }

    getTile(index) {
        const x = (index % this.columns) * this.tileWidth;
        const y = Math.floor(index / this.columns) * this.tileHeight;
        return { sx: x, sy: y, sw: this.tileWidth, sh: this.tileHeight };
    }
}
