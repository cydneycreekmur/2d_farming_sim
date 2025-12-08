/**
 * 
 * Handles draw calls
 * Binds shaders
 * Binds textures
 * Draws shapes
 * Sets Transform matrices
 * 
 */

async function initRenderer(gl) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const quadVertices = new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        1, 0,
        1, 1,
        0, 1
    ]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    const uv = new Float32Array([
        0,0, 1,0, 0,1, 1,0, 1,1, 0,1
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

    return { vao, posBuffer, uvBuffer };
}

function drawTile(gl, shader, renderer, spritesheet, index, x, y, texture, resolution) {
    const tile = spritesheet.getTile(index);

    gl.useProgram(shader);
    gl.bindVertexArray(renderer.vao);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(shader, "uTexture"), 0);

    gl.uniform2fv(gl.getUniformLocation(shader, "uResolution"), resolution);
    gl.uniform2fv(gl.getUniformLocation(shader, "uTranslate"), [x, y]);
    gl.uniform2fv(gl.getUniformLocation(shader, "uSize"), [tile.sw, tile.sh]);

    const texW = spritesheet.image.width;
    const texH = spritesheet.image.height;

    const u0 = tile.sx / texW;
    const v0 = tile.sy / texH;
    const u1 = (tile.sx + tile.sw) / texW;
    const v1 = (tile.sy + tile.sh) / texH;

    const uv = new Float32Array([
        u0,v0, u1,v0, u0,v1, u1,v0, u1,v1, u0,v1
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
