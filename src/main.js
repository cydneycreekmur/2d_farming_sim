/**
 * 
 * Initialize WebGL and canvas
 * Load all assets
 * Initialize spritesheets
 * Create game object
 * Start requestAnimationFrame loop
 * 
 */

const MAP_WIDTH = 60;
const MAP_HEIGHT = 60;

const CROP_WIDTH = 30;
const CROP_HEIGHT = 30;

const TILE_SIZE = 8;
const PLAYER_SIZE = 16;

const MAP = [];

const GROUND_TILES = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    4, 4, 4,
    5, 5,
    16, 
    17, 17, 17,
    18
];

// crop tiles dictionary
// "tile name": "tile location"
const CROP_TILES = {
    "full dirt": 1, 
    "partial dirt": 2, 
    "grown radish": 33,
    "radish seedling": 34,
    "grown wheat": 46,
    "wheat seedling": 47
};

const WATER_TILES = [126, 127, 128];

async function main() {
    const canvas = document.getElementById("game-surface");

    const gl = canvas.getContext("webgl2");
    if (!gl) alert("WebGL2 not supported");

    const assets = await loadAssets(gl);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const tileSheet = new SpriteSheet(assets.tileSetImg, TILE_SIZE, TILE_SIZE);
    const playerSheet = new SpriteSheet(assets.playerImg, PLAYER_SIZE, PLAYER_SIZE);

    const renderer = await initRenderer(gl);

    const input = new Input();
    const game = new Game(gl, assets, tileSheet, playerSheet);

    const cropStartX = Math.floor((MAP_WIDTH - CROP_WIDTH) / 2);
    const cropStartY = Math.floor((MAP_HEIGHT - CROP_HEIGHT) / 2);
    
    for(let y=0; y < MAP_HEIGHT; y++){
        for(let x=0; x < MAP_WIDTH; x++){

            const inCropArea = x >= cropStartX && x < cropStartX + CROP_WIDTH && y >= cropStartY && y < cropStartY + CROP_HEIGHT;
            const inBorderArea = !inCropArea && x >= cropStartX - 1 && x <= cropStartX + CROP_WIDTH && y >= cropStartY - 1 && y <= cropStartY + CROP_HEIGHT;
            const inMapBorder = !inCropArea && !inBorderArea && (x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_WIDTH - 1);

            let tileIndex;

            if(inCropArea) {
                tileIndex = CROP_TILES["full dirt"];
            } else if(inBorderArea) {
                tileIndex = CROP_TILES["partial dirt"];
            } else if(inMapBorder) {
                tileIndex = WATER_TILES[Math.floor(Math.random() * WATER_TILES.length)];
            } else {
                tileIndex = GROUND_TILES[Math.floor(Math.random() * GROUND_TILES.length)];
            }

            MAP.push({
                x: x*TILE_SIZE, 
                y: y*TILE_SIZE, 
                tileIndex: tileIndex,
                isCropArea: inCropArea,
                isBorderArea: inBorderArea,
                isMapBorder: inMapBorder
            });
        }
    }

    let lastTime = 0;

    function loop(time){
        const dt = time - lastTime;
        lastTime = time;

        game.update(dt, input);

        if(input.keys["e"]) {
            game.player.plantCrop(game);
        }

        gl.clearColor(0.2,0.6,0.2,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // draw map
        for(const tile of MAP){
            drawTile(
                gl, 
                assets.shaders.sprite, 
                renderer, 
                tileSheet, 
                tile.tileIndex, 
                tile.x, 
                tile.y, 
                assets.tilesTex, 
                [canvas.width, canvas.height]
            );
        }

        // draw player
        drawTile(
            gl, 
            assets.shaders.sprite, 
            renderer, 
            playerSheet, 
            0, 
            game.player.x, 
            game.player.y, 
            assets.playerTex, 
            [canvas.width, canvas.height]
        );

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

main();
