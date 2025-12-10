/**
 * 
 * Initialize WebGL and canvas
 * Load all assets
 * Initialize spritesheets
 * Create game object
 * Start requestAnimationFrame loop
 * 
 */


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

    /**
     * 
     * Event Listeners
     * 
     */

    // buy seeds
    document.getElementById("buy-seeds").addEventListener("click", () => {
        if(game.player.money < 10) {
            showMessage("You're broke...");
            return;
        }

        game.player.money -= 10;
        game.player.inventory.radish_seeds += 5;
        updateSeedCounter(game.player);
        updateMoneyCounter(game.player);
        showMessage("Bought 5 seeds!");
    });

    // sell crops
    document.getElementById("sell-crops").addEventListener("click", () => {
        const earnings = (game.player.inventory.radishes || 0) * 15;

        if(earnings <= 0) {
            showMessage("No crops, no money! >:(");
            return;
        }

        game.player.money += earnings;
        game.player.inventory.radishes = 0;

        updateMoneyCounter(game.player);
        showMessage(`Sold crops for $${earnings}.`);
    });

    // open inventory
    document.getElementById("inventory").addEventListener("click", () => {
        openInventory(game.player);
    })

    // close inventory
    document.getElementById("close-inventory").addEventListener("click", () => {
        closeInventory();
    })

    const cropStartX = Math.floor((MAP_WIDTH - CROP_WIDTH) / 2);
    const cropStartY = Math.floor((MAP_HEIGHT - CROP_HEIGHT) / 2);

    game.crops.setOffset(cropStartX, cropStartY);

    const cropPixelX = cropStartX * TILE_SIZE;
    const cropPixelY = cropStartY * TILE_SIZE;

    const cropPixelWidth  = CROP_WIDTH  * TILE_SIZE;
    const cropPixelHeight = CROP_HEIGHT * TILE_SIZE;
    
    // map creation loop
    for(let y=0; y < MAP_HEIGHT; y++){
        for(let x=0; x < MAP_WIDTH; x++){

            const inCropArea = x >= cropStartX && x < cropStartX + CROP_WIDTH && y >= cropStartY && y < cropStartY + CROP_HEIGHT;
            const inBorderArea = !inCropArea && x >= cropStartX - 1 && x <= cropStartX + CROP_WIDTH && y >= cropStartY - 1 && y <= cropStartY + CROP_HEIGHT;
            const inMapBorder = !inCropArea && !inBorderArea && (x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_HEIGHT - 1);

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
            drawColoredQuad(gl, cropPixelX, cropPixelY, cropPixelWidth, cropPixelHeight, [0.66, 0.32, 0.21, 1.0]);

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

        const rect = canvas.getBoundingClientRect();

        const insideCanvas = 
            input.mouse.x >= rect.left &&
            input.mouse.x <= rect.right &&
            input.mouse.y >= rect.top &&
            input.mouse.y <= rect.bottom;

        if(input.mouse.left) {
            
            if(insideCanvas) game.player.plantCrop(game);
        }
        if(input.mouse.right) {
            
            if(insideCanvas) game.player.harvestCrop(game);
        }

        gl.clearColor(0.2,0.6,0.2,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        drawColoredQuad(gl, cropPixelX, cropPixelY, cropPixelWidth, cropPixelHeight, [0.66, 0.32, 0.21, 1.0]);

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
