// SHOPORA - Premium E-Commerce Website

// 1. Product List
const products = [
    {
        id: 1,
        name: "Premium Sneakers",
        category: "fashion",
        price: 1999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        price: 2499,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },
    {
        id: 3,
        name: "Classic Handbag",
        category: "accessories",
        price: 1599,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"
    },
    {
        id: 4,
        name: "Wireless Headphones",
        category: "electronics",
        price: 2999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },
    {
        id: 5,
        name: "Men's Jacket",
        category: "fashion",
        price: 1899,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"
    },
    {
        id: 6,
        name: "Stylish Sunglasses",
        category: "accessories",
        price: 999,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    },
    {
        id: 7,
        name: "Running Shoes",
        category: "fashion",
        price: 2299,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 8,
        name: "Digital Camera",
        category: "electronics",
        price: 8999,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"
    }
];

// 2. HTML Elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

// 3. Cart Data
let cart = JSON.parse(localStorage.getItem("shoporaCart")) || [];
let selectedCategory = "all";

// 4. Display Products
function displayProducts(items) {
    if (!productGrid) return;
    productGrid.innerHTML = "";

    if (items.length === 0) {
        productGrid.innerHTML = "<p>No products found.</p>";
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>₹${product.price.toLocaleString("en-IN")}</p>
                <button class="add-cart" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

// 5. Category Filter
document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category-btn.active")?.classList.remove("active");

        button.classList.add("active");
        selectedCategory = button.dataset.category;

        filterProducts();
    });
});

// 6. Search Products
function filterProducts() {
    if (!searchInput) return;
    const searchText = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    displayProducts(filteredProducts);
}

if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

// 7. Add Products to Cart
if (productGrid) {
    productGrid.addEventListener("click", event => {
        if (event.target.classList.contains("add-cart")) {
            const productId = Number(event.target.dataset.id);

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productId,
                    quantity: 1
                });
            }

            saveCart();
            displayCart();
        }
    });
}

// 8. Save Cart
function saveCart() {
    localStorage.setItem("shoporaCart", JSON.stringify(cart));
}

// 9. Display Cart
function displayCart() {
    if (!cartItems) return;
    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return;

        total += product.price * item.quantity;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div>
                <h4>${product.name}</h4>
                <p>₹${product.price.toLocaleString("en-IN")}</p>
            </div>

            <div>
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    if (cartTotal) cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;
    if (cartCount) cartCount.textContent = totalQuantity;
}

// 10. Cart Quantity and Remove
if (cartItems) {
    cartItems.addEventListener("click", event => {
        const id = Number(event.target.dataset.id);

        if (event.target.classList.contains("quantity-btn")) {
            const item = cart.find(product => product.id === id);

            if (item) {
                if (event.target.dataset.action === "increase") {
                    item.quantity++;
                } else {
                    item.quantity--;

                    if (item.quantity <= 0) {
                        cart = cart.filter(product => product.id !== id);
                    }
                }
            }
        }

        if (event.target.classList.contains("remove-item")) {
            cart = cart.filter(product => product.id !== id);
        }

        saveCart();
        displayCart();
    });
}

// 11. Clear Cart (Fixed with Safety Check)
const clearCartBtn = document.getElementById("clearCart");
if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        cart = [];
        saveCart();
        displayCart();
    });
}

// 12. Search Button (Fixed with Safety Check)
const searchBtn = document.getElementById("searchBtn");
if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
        searchInput.focus();
    });
}

// 13. Cart Button Smooth Scroll (Fixed with Safety Check)
const cartBtn = document.getElementById("cartBtn");
if (cartBtn) {
    cartBtn.addEventListener("click", () => {
        // Targets 'cartItems' container if 'cart' section is not found
        const cartSection = document.getElementById("cart") || cartItems;
        if (cartSection) {
            cartSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}

// 14. Contact Form (Fixed with Safety Check)
const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        if (contactMessage) {
            contactMessage.textContent = "Thank you! Your message has been received.";
        }

        contactForm.reset();
    });
}

// 15. Initial Website Load
displayProducts(products);
displayCart();
