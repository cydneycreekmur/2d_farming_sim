/**
 * 
 * Initialize WebGL and canvas
 * Load all assets
 * Initialize spritesheets
 * Create game object
 * Start requestAnimationFrame loop
 * 
 */

const TILE_SIZE = 8;
const PLAYER_SIZE = 16;

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
    const player = new Player(32, 32);

    const mapWidth = 60;
    const mapHeight = 60;

    const cropWidth = 30;
    const cropHeight = 30;

    const cropStartX = Math.floor((mapWidth - cropWidth) / 2);
    const cropStartY = Math.floor((mapHeight - cropHeight) / 2);

    const map = [];
    
    for(let y=0; y < mapHeight; y++){
        for(let x=0; x < mapWidth; x++){

            const inCropArea = x >= cropStartX && x < cropStartX + cropWidth && y >= cropStartY && y < cropStartY + cropHeight;
            const inBorderArea = !inCropArea && x >= cropStartX - 1 && x <= cropStartX + cropWidth && y >= cropStartY - 1 && y <= cropStartY + cropHeight;
            let tileIndex;

            if(inCropArea) {
                tileIndex = CROP_TILES["full dirt"];

            }else if(inBorderArea) {
                tileIndex = CROP_TILES["partial dirt"];
            } else {
                tileIndex = GROUND_TILES[Math.floor(Math.random() * GROUND_TILES.length)];
            }

            map.push({
                x: x*TILE_SIZE, 
                y: y*TILE_SIZE, 
                tileIndex: tileIndex,
                isCropArea: inCropArea,
                isBorderArea: inBorderArea
            });
        }
    }

    let lastTime = 0;

    function loop(time){
        const dt = time - lastTime;
        lastTime = time;

        player.update(dt, input);

        gl.clearColor(0.2,0.6,0.2,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // draw map
        for(const tile of map){
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
            player.x, 
            player.y, 
            assets.playerTex, 
            [canvas.width, canvas.height]
        );

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

main();
