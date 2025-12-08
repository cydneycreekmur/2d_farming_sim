/**
 * 
 * Handles loading assets
 * Creates textures
 * Loads shaders
 * 
 */

async function initShaders(gl, vertexPath, fragmentPath) {
    // fetch shader source
    const [vsSrc, fsSrc] = await Promise.all([
        fetch(vertexPath).then(r => r.text()),
        fetch(fragmentPath).then(r => r.text())
    ]);

    // compile shader
    function loadShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader compile error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSrc);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSrc);

    // create program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Shader link error:", gl.getProgramInfoLog(shaderProgram));
        gl.deleteProgram(shaderProgram);
        return null;
    }

    return shaderProgram;
}


function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // important for WebGL
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

function createTexture(gl, image) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return tex;
}

async function loadAssets(gl) {
    const tileSetImg = await loadImage("spritesheets/5_Tiles/TileSet.png");
    const playerImg = await loadImage("spritesheets/1_Character/D_Idle.png");

    const tilesTex = createTexture(gl, tileSetImg);
    const playerTex = createTexture(gl, playerImg);

    const spriteShader = await initShaders(gl, "shaders/vertex.glsl", "shaders/fragment.glsl");

    return {
        tileSetImg,
        playerImg,
        tilesTex,
        playerTex,
        shaders: { sprite: spriteShader }
    };
}
