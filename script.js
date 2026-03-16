// ===============================
// GLOBAL STATE
// ===============================
let cart = [];
let total = 0;
let selectedItem = null;

// ===============================
// MENU DATA
// ===============================
const menuData = {
    snacks: [
        { 
            name: "The Overdrive", 
            price: 79, 
            image: "images/overdrive.jpg" 
        },

        { 
            name: "Sketch Fries", 
            price: 49, 
            image: "images/fries.jpg",
            addOns: [
                { name: "Cheese Flavor", price: 0 },
                { name: "Sour Cream Flavor", price: 0 },
                { name: "BBQ Flavor", price: 0 }
            ]
        },

        { 
            name: "Ink Blots", 
            price: 39, 
            image: "images/friesoreo.jpg" 
        },
    ],

    drinks: [
        { 
            name: "Soda Pop", 
            price: 75, 
            image: "images/soda.jpg",
            addOns: [
                { name: "Grape Flavor", price: 0 },
                { name: "Four Seasons Flavor", price: 0 },
                { name: "Strawberry Flavor", price: 0 },
                { name: "Blue Lemonade Flavor", price: 0 },
            ]
        },

        { 
            name: "Cloud Blend", 
            price: 85, 
            image: "images/frappe.jpg",
            addOns: [
                { name: "Coffee Crumble", price: 0},
                { name: "Rocky Road", price: 0},
            ]
        }
    ],

    meals: [
        { 
            name: "Bacon Luxe Bowl", 
            price: 115, 
            image: "images/bacon.jpg",
            addOns: [
                { name: "Sunny Side Up Egg", price: 15 },
                { name: "Cheese Sauce", price: 15 },
                { name: "Sea Weed", price: 10 }
            ]
        },

        { 
            name: "Blush Burn", 
            price: 125, 
            image: "images/carbonara.jpg",  
        }
    ],

    sidedrinks: [
        { name: "Nata", price: 10, image: "images/nata.jpg" },
        { name: "Yakult", price: 15, image: "images/yakult.jpg" }
    ]
};

// ===============================
// SCREEN REFERENCES
// ===============================
const welcomeScreen = document.getElementById("welcomeScreen");
const categoryScreen = document.getElementById("categoryScreen");
const menuScreen = document.getElementById("menuScreen");

const menuItemsDiv = document.getElementById("menuItems");
const menuTitle = document.getElementById("menuTitle");

const cartList = document.getElementById("cartList");
const totalDisplay = document.getElementById("total");

const subPanel = document.getElementById("subPanel");
const addOnOptions = document.getElementById("addOnOptions");
const subPanelTitle = document.getElementById("subPanelTitle");

const receiptModal = document.getElementById("receiptModal");
const receiptContent = document.getElementById("receiptContent");
const receiptTotal = document.getElementById("receiptTotal");

// ===============================
// START BUTTON
// ===============================
document.getElementById("startBtn").onclick = () => {
    hideAllScreens();
    categoryScreen.classList.add("active");
};

// ===============================
// NAVIGATION
// ===============================
function hideAllScreens() {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });
}

function backToWelcome() {
    hideAllScreens();
    welcomeScreen.classList.add("active");
}

function backToCategories() {
    hideAllScreens();
    categoryScreen.classList.add("active");
}

// ===============================
// CATEGORY DISPLAY
// ===============================
function showCategory(category) {
    menuItemsDiv.innerHTML = "";
    menuTitle.textContent = category.toUpperCase();

    menuData[category].forEach(item => {
        const card = document.createElement("div");
        card.classList.add("menu-card");

        const img = document.createElement("img");
        img.src = item.image ? item.image : "placeholder.jpg";

        const name = document.createElement("div");
        name.textContent = item.name;

        const price = document.createElement("div");
        price.textContent = `₱${item.price}`;

        const btn = document.createElement("button");
        btn.textContent = "Add";
        btn.onclick = () => selectItem(item);

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(btn);

        menuItemsDiv.appendChild(card);
    });

    hideAllScreens();
    menuScreen.classList.add("active");
}

// ===============================
// ITEM SELECTION
// ===============================
function selectItem(item) {
    if (item.addOns) {
        selectedItem = item;
        showAddOns(item);
    } else {
        addToCart(item.name, item.price);
    }
}

// ===============================
// ADD-ONS PANEL
// ===============================
function showAddOns(item) {
    subPanelTitle.textContent = item.name;
    addOnOptions.innerHTML = "";

    item.addOns.forEach(add => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = add.price;
        checkbox.dataset.name = add.name;

        const label = document.createElement("label");
        label.textContent = ` ${add.name} (+₱${add.price})`;

        addOnOptions.appendChild(checkbox);
        addOnOptions.appendChild(label);
        addOnOptions.appendChild(document.createElement("br"));
    });

    subPanel.style.display = "block";
}

function confirmAddOns() {
    let finalPrice = selectedItem.price;
    let finalName = selectedItem.name;

    const checked = addOnOptions.querySelectorAll("input:checked");

    checked.forEach(cb => {
        finalPrice += parseInt(cb.value);
        finalName += ` + ${cb.dataset.name}`;
    });

    addToCart(finalName, finalPrice);
    subPanel.style.display = "none";
}

function closeSubPanel() {
    subPanel.style.display = "none";
}

// ===============================
// CART FUNCTIONS
// ===============================
function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    updateCart();
}

function updateCart() {
    cartList.innerHTML = "";

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ₱${item.price}`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.onclick = () => removeItem(index);

        li.appendChild(removeBtn);
        cartList.appendChild(li);
    });

    totalDisplay.textContent = `Total: ₱${total}`;
}

function removeItem(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    updateCart();
}

// ===============================
// RECEIPT + CONFIRMATION + RESET
// ===============================
function showReceipt() {

    if (cart.length === 0) {
        alert("There is currently no order to process.");
        return;
    }

    const confirmation = confirm(
        "Is this your order? Please confirm to proceed with checkout."
    );

    if (!confirmation) return;

    receiptContent.innerHTML = `
        <h2 style="text-align:center;">CafeQueue by artspire</h2>
        <p style="text-align:center;">--------------------------------</p>
    `;

    cart.forEach(item => {
        receiptContent.innerHTML += `${item.name} - ₱${item.price}<br>`;
    });

    receiptContent.innerHTML += `
        <hr>
        <strong>TOTAL: ₱${total}</strong>
        <hr>
        Contact: lorem <br>
        Email: lorem
        <br><br>
        <p style="text-align:center;">
        Thank you for using CafeQueue by artspire.
        </p>
    `;

    receiptModal.style.display = "block";

    setTimeout(() => {
        window.print();
        completeOrder();
    }, 500);
}

function completeOrder() {

    saveTransaction(); // SAVE FIRST

    cart = [];
    total = 0;
    updateCart();

    receiptModal.style.display = "none";

    hideAllScreens();
    welcomeScreen.classList.add("active");
}

function closeReceipt() {
    receiptModal.style.display = "none";
}

function saveTransaction() {

    const now = new Date();

    const options = { 
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    };

    const formatter = new Intl.DateTimeFormat("en-PH", options);
    const manilaTime = formatter.format(now);

    const transaction = {
        dateTime: manilaTime,
        items: cart,
        total: total,
        timestamp: now.getTime()
    };

    let records = JSON.parse(localStorage.getItem("cafequeue_records")) || [];
    records.push(transaction);

    localStorage.setItem("cafequeue_records", JSON.stringify(records));
}
