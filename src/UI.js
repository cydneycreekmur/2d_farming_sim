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
    const radishCounter = document.getElementById("radish-seed-counter");
    const wheatCounter = document.getElementById("wheat-seed-counter");

    radishCounter.textContent = `Radish Seeds: ${player.inventory.radish_seeds}`;
    wheatCounter.textContent = `Wheat Seeds: ${player.inventory.wheat_seeds}`;
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

function updateMaxAndTotal(player) {
    const seedType = document.getElementById("seed-type").value;
    const amount = document.getElementById("seed-amount");
    const totalCost = document.getElementById("total-cost");
    const errorBox = document.getElementById("shop-error");

    const prices = {
        radish: 2,
        wheat: 4
    };
    const price = prices[seedType];

    let quantity = parseInt(amount.value);

    if(isNaN(quantity) || quantity <= 0) {
        quantity = 1;
    }
    const max = Math.floor(player.money / price);

    if(quantity > max) {
        quantity = max;
        amount.value = quantity;
        errorBox.textContent = (`The most you can afford is ${quantity}`);
    } else {
        errorBox.textContent = "";
    }
    const cost = quantity * price;
    console.log(cost);
    totalCost.textContent = `Total: $${cost}`;
}

function clearSeedSelection() {
    document.getElementById("radish-seed-counter").classList.remove("selected-seed");
    document.getElementById("wheat-seed-counter").classList.remove("selected-seed");
}