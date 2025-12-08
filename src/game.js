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

class Game {
    constructor(gl, assets, tileSheet, playerSheet) {
        this.gl = gl;
        this.assets = assets;

        this.tileSheet = tileSheet;
        this.playerSheet = playerSheet;

        this.player = new Player(240, 240); // pixel coords
        this.crops = new Crops(assets.tileTex);

        // Create simple map array
        //this.map = MAP;
    }

    update(dt, input) {
        this.player.update(dt, input);
        // TODO: update crops growth here
    }

    render(renderer, options) {
        const gl = this.gl;
        const resolution = options.resolution;

        // draw tilemap
        for (const tile of MAP) {
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
