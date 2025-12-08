/**
 * 
 * Initialize WebGL and canvas
 * Load all assets
 * Initialize spritesheets
 * Create game object
 * Start requestAnimationFrame loop
 * 
 */

const TILE_SIZE = 32;

async function main() {
    const canvas = document.getElementById("game-surface");
    const gl = canvas.getContext("webgl2");
    if (!gl) alert("WebGL2 not supported");

    const assets = await loadAssets(gl);

    const tileSheet = new SpriteSheet(assets.tileSetImg, TILE_SIZE, TILE_SIZE);
    const playerSheet = new SpriteSheet(assets.playerImg, TILE_SIZE, TILE_SIZE);

    const renderer = await initRenderer(gl);

    const input = new Input();
    const player = new Player(32, 32);

    const mapWidth = 10;
    const mapHeight = 10;

    const map = [];
    for(let y=0;y<mapHeight;y++){
        for(let x=0;x<mapWidth;x++){
            map.push({x: x*TILE_SIZE, y: y*TILE_SIZE, tileIndex: 0});
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
            drawTile(gl, assets.shaders.sprite, renderer, tileSheet, tile.tileIndex, tile.x, tile.y, assets.tilesTex, [canvas.width, canvas.height]);
        }

        // draw player
        drawTile(gl, assets.shaders.sprite, renderer, playerSheet, 0, player.x, player.y, assets.playerTex, [canvas.width, canvas.height]);

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

main();
