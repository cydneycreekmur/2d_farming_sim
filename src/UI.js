function showMessage(text, duration = 2000) {
    const box = document.getElementById("game-message");
    box.textContent = text;
    box.style.opacity = "1";

    // fade out after a delay
    setTimeout(() => {
        box.style.opacity = "0";
    }, duration);
}