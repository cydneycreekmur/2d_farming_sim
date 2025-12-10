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

    // open controls list
    document.getElementById("controls").addEventListener("click", () => {
        document.getElementById("controls-window").style.display = "block";
    });

    // close controls list
    document.getElementById("close-controls").addEventListener("click", () => {
        document.getElementById("controls-window").style.display = "none";
    });

    // sell crops
    document.getElementById("sell-all-crops").addEventListener("click", () => {
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
    });

    // close inventory
    document.getElementById("close-inventory").addEventListener("click", () => {
        closeInventory();
    });
    
    // open shop
    document.getElementById("shop").addEventListener("click", () => {
        document.getElementById("shop-window").style.display = "block";
        document.getElementById("shop-error").textContent = "";
    });

    // close shop
    document.getElementById("close-shop").addEventListener("click", () => {
        document.getElementById("shop-window").style.display = "none";
    });

    // buying logic
    document.getElementById("confirm-buy").addEventListener("click", () => {
        const seedType = document.getElementById("seed-type").value;
        const amount = document.getElementById("seed-amount");
        const errorBox = document.getElementById("shop-error");

        const prices = {
            radish: 2,
            wheat: 4
        };
        const price = prices[seedType];
        
        let quantity = parseInt(amount.value);

        if(isNaN(quantity) || quantity <= 0) {
            errorBox.textContent = "That's not a number...";
            return;
        }
        const max = Math.floor(game.player.money / price);

        if(quantity > max) {
            errorBox.textContent = `You don't have enough money for ${quantity} seeds...`;
            quantity = max;
            amount.value = quantity;

            if(quantity === 0) return;
        }
        const totalCost = quantity * price;
        game.player.money -= totalCost;

        if(seedType === "radish"){
            game.player.inventory.radish_seeds += quantity;
        }
        if(seedType === "wheat") {
            game.player.inventory.wheat_seeds += quantity;
        }

        updateMoneyCounter(game.player);
        updateSeedCounter(game.player);
    });

    // max button
    document.getElementById("max-amount").addEventListener("click", () => {
        const seedType = document.getElementById("seed-type").value;
        const amount = document.getElementById("seed-amount");
        const errorBox = document.getElementById("shop-error");

        const prices = {
            radish: 2,
            wheat: 4
        };
        const price = prices[seedType];

        const max = Math.floor(game.player.money / price);

        amount.value = max;

        if(max <= 0) {
            errorBox.textContent = `You don't have enough money for ${quantity} seeds...`;
        } else {
            errorBox.textContent = "";
        }
        updateMaxAndTotal();
    });

    // change max amount with seed type
    document.getElementById("seed-type").addEventListener("change", () => {
        updateMaxAndTotal();
    });

    // update cost after player enters new amount
    document.getElementById("seed-amount").addEventListener("input", () => {
        updateMaxAndTotal();
    });


    const cropStartX = Math.floor((MAP_WIDTH - CROP_WIDTH) / 2);
    const cropStartY = Math.floor((MAP_HEIGHT - CROP_HEIGHT) / 2);

    game.crops.setOffset(cropStartX, cropStartY);

    const cropPixelX = cropStartX * TILE_SIZE * SCALE;
    const cropPixelY = cropStartY * TILE_SIZE * SCALE;

    const cropPixelWidth  = CROP_WIDTH  * TILE_SIZE * SCALE;
    const cropPixelHeight = CROP_HEIGHT * TILE_SIZE * SCALE;
    
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

            MAP.push({
                x: x * TILE_SIZE, 
                y: y * TILE_SIZE, 
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
                [canvas.width, canvas.height],
                SCALE
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
            [canvas.width, canvas.height],
            SCALE
        );

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

main();
