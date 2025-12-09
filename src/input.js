/**
 * 
 * Tracks keyboard inputs
 * 
 */

class Input {
    constructor() {
        this.keys = {};
        this.mouse = {
            left: false,
            x: 0,
            y: 0
        };
        //keyboard
        window.addEventListener("keydown", e => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener("keyup", e => this.keys[e.key.toLowerCase()] = false);
        //mouse position
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        //mouse buttons
        window.addEventListener("mousedown", e => {
            if(e.button === 0) this.mouse.left = true;
        });
        window.addEventListener("mouseup", e => {
            if(e.button === 0) this.mouse.left = false;
        });
    }
}
