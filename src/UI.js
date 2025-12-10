/**
 * 
 * Handles UI functions and helpers
 * 
 */


function showMessage(text, duration = 2000) {
    const box = document.getElementById("game-message");
    box.textContent = text;
    box.style.opacity = "1";

    // fade out after a delay
    setTimeout(() => {
        box.style.opacity = "0";
    }, duration);
}

function updateSeedCounter(player) {
    const counter = document.getElementById("seed-counter");
    counter.textContent = `Seeds: ${player.inventory.radish_seeds}`;
}

function updateMoneyCounter(player) {
    const counter = document.getElementById("money-counter");
    counter.textContent = `Money: ${player.money}`;
}

function openInventory(player) {
    const window = document.getElementById("inventory-window");
    const items = document.getElementById("inventory-items");

    items.innerHTML = `
        <p>Radish Seeds: ${player.inventory.radish_seeds}</p>
        <p>Wheat Seeds: ${player.inventory.wheat_seeds}</p>
        <p>Radishes: ${player.inventory.radishes}</p>
        <p>Wheat: ${player.inventory.wheat}</p>
        <p>Money: ${player.money}</p>
    `;
    window.style.display = "block";
}

function closeInventory() {
    const window = document.getElementById("inventory-window");
    window.style.display = "none";
}