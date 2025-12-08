#version 300 es

layout(location = 0) in vec2 aPosition; //quad vertices
layout(location = 1) in vec2 aTexCoord; // uv coords

out vec2 vTexCoord;

uniform vec2 uResolution; // canvas width/height
uniform vec2 uTranslate; // tile position in pixels
uniform vec2 uSize; // tile size in pixels

void main() {
    vec2 pPosition = uTranslate + aPosition * uSize;

    vec2 clip = (pPosition / uResolution) * 2.0 - 1.0;
    clip.y *= -1.0;

    gl_Position = vec4(clip , 0.0, 1.0);
    vTexCoord = aTexCoord;
}