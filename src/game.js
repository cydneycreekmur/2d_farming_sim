/**
 * 
 * Overall world state
 * 
 * Player object
 * Map tiles
 * Crop grid
 * Money
 * Shop logic
 * Growth timers
 * 
 */

const TILE_SIZE = 8;

class Game {
    constructor(gl, assets, tileSheet, playerSheet) {
        this.gl = gl;
        this.assets = assets;

        this.tileSheet = tileSheet;
        this.playerSheet = playerSheet;

        this.mapWidth = 60;   // smaller for testing
        this.mapHeight = 60;

        this.player = new Player(100, 100); // pixel coords
        this.crops = new Crops(assets.tilesTex);

        // Create simple map array
        this.map = [];
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                this.map.push({
                    x: x * TILE_SIZE,
                    y: y * TILE_SIZE,
                    tileIndex: 0  // default grass tile
                });
            }
        }
    }

    update(dt, input) {
        this.player.updateDirection(dt, input, this);
        // TODO: update crops growth here
    }

    render(renderer, options) {
        const gl = this.gl;
        const resolution = options.resolution;

        // draw tilemap
        for (const tile of this.map) {
            drawTile(
                gl,
                this.assets.shaders.sprite,  // shader program
                renderer,                    // renderer object
                this.tileSheet,              // spritesheet
                tile.tileIndex,              // index of tile in sheet
                tile.x, tile.y,              // position in pixels
                this.assets.tilesTex,        // WebGLTexture
                resolution
            );
        }

        // TODO: draw crops
        // Example (if crop tile exists at tileIndex):
        /*
        for (const crop of this.crops.list) {
            drawTile(
                gl,
                this.assets.shaders.sprite,
                renderer,
                this.tileSheet,
                crop.tileIndex,
                crop.x * TILE_SIZE,
                crop.y * TILE_SIZE,
                this.assets.tilesTex,
                resolution
            );
        }
        */

        // draw player (assume frame 0 of playerSheet for idle)
        const playerFrame = this.playerSheet.getTile(0);

        drawTile(
            gl,
            this.assets.shaders.sprite,
            renderer,
            playerFrame,              // pass frame directly
            this.player.x,
            this.player.y,
            this.assets.playerTex,    // player texture
            resolution
        );
    }
}
