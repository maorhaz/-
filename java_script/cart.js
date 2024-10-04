document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

function loadCart() {
    // For now, we'll use dummy data
    const cartItems = [
        { id: 1, name: "סטייק סינטה", price: 190, quantity: 1, image: "../resources/images/product_id_photos/1.jpg" },
        { id: 2, name: "נקניקיות מרגז", price: 50, quantity: 2, image: "../resources/images/product_id_photos/2.jpg" }
    ];
    
    displayCart(cartItems);
}

function displayCart(items) {
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = '';
    
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
    // In a real app, you'd remove the item from the database here
    // For now, we'll just reload the cart
    loadCart();
}

document.getElementById('checkout-button').addEventListener('click', function() {
    alert('המשך לתשלום');
    // Here you would typically redirect to a checkout page
});