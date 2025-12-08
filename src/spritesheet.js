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

class Player {
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
        this.speed = 100; // pixels per second
    }

    update(dt, input) {
        const delta = dt / 1000;
        if (input.keys["w"]) this.y -= this.speed * delta;
        if (input.keys["s"]) this.y += this.speed * delta;
        if (input.keys["a"]) this.x -= this.speed * delta;
        if (input.keys["d"]) this.x += this.speed * delta;
    }
}
