document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    document.getElementById('clear-cart-button').addEventListener('click', clearCart);
});

// Load cart items from local storage or another source
function loadCart() {
    // Retrieve cart items from local storage or initialize if not available
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Display cart items
    displayCart(cartItems);
}

function displayCart(items) {
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = ''; // Clear existing items

    if (items.length === 0) {
        cartContainer.innerHTML = '<p>העגלה ריקה</p>'; // Message when cart is empty
        updateCartSummary(items); // Update summary with no items
        return;
    }

    items.forEach(item => {
        const itemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>מחיר: ₪${item.price}</p>
                    <p>כמות: ${item.quantity}</p>
                </div>
                <button onclick="removeItem(${item.id})">הסר</button>
            </div>
        `;
        cartContainer.innerHTML += itemHTML;
    });

    updateCartSummary(items);
}

function updateCartSummary(items) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 20 : 0; // Example shipping cost
    const total = subtotal + shipping;

    document.getElementById('subtotal-amount').textContent = `₪${subtotal.toFixed(2)}`;
    document.getElementById('shipping-amount').textContent = `₪${shipping.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `₪${total.toFixed(2)}`;
}

function removeItem(itemId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.id !== itemId); // Remove item from cart
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update local storage
    loadCart(); // Reload cart
}

function clearCart() {
    localStorage.removeItem('cartItems'); // Clear local storage
    loadCart(); // Reload cart
}

document.getElementById('checkout-button').addEventListener('click', function() {
    alert('המשך לתשלום');
    // Here you would typically redirect to a checkout page
});
