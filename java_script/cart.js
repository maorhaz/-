document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    document.getElementById('clear-cart-button').addEventListener('click', clearCart);
});

// Load cart items from local storage or initialize if not available
function loadCart() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
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
    updateCartInDatabase(cartItems); // Upload updated cart to MongoDB
}

function clearCart() {
    localStorage.removeItem('cartItems'); // Clear local storage
    loadCart(); // Reload cart
    updateCartInDatabase([]); // Clear the cart in MongoDB
}

// 
function updateCartInDatabase(cartItems) {
    const customerId = sessionStorage.getItem('customerId'); 
    const username = sessionStorage.getItem('username'); 

    const cartData = {
        customerId: customerId,
        username: username,
        cartItems: cartItems
    };

    // Alert the JSON data that will be sent
    alert('Sending the following data to MongoDB:\n' + JSON.stringify(cartData, null, 2));

    fetch('http://localhost:3000/update-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData) // Use the cartData variable here
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update cart in database');
        }
        return response.text();
    })
    .then(data => {
        console.log(data); // Show success message in console
    })
    .catch(error => {
        console.error('Error updating cart:', error);
    });
}

document.getElementById('checkout-button').addEventListener('click', async function() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length === 0) {
        alert('העגלה ריקה! אנא הוסף מוצרים לפני שתמשיך.');
        return; // Stop if the cart is empty
    }

    // Save the current cart to MongoDB
    await updateCartInDatabase(cartItems);
});
