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
        cartContainer.innerHTML = '<p>העגלה ריקה</p>'; 
        updateCartSummary(items); // Update summary with no items
        return;
    }

    items.forEach(item => {
        const itemHTML = `
            <div class="cart-item">
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
    const shipping = subtotal > 0 ? 20 : 0; 
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
    updateCartInDatabase(cartItems); // Upload cart to MongoDB
}

function clearCart() {
    localStorage.removeItem('cartItems'); 
    loadCart(); // Reload cart
    updateCartInDatabase([]); 
}

function updateCartInDatabase(cartItems) {
    const customerId = sessionStorage.getItem('customerId'); 
    const username = sessionStorage.getItem('username'); 

    const cartData = {
        customerId: customerId,
        username: username,
        cartItems: cartItems
    };

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
        console.log(data); 
    })
    .catch(error => {
        console.error('Error updating cart:', error);
    });
}

document.getElementById('checkout-button').addEventListener('click', async function() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const customerId = sessionStorage.getItem('customerId');

    if (!customerId) {
        alert('צריך להירשם לאתר כדי לבצע הזמנה');
        return; 
    }

    if (cartItems.length === 0) {
        alert('העגלה ריקה! אנא הוסף מוצרים לפני שתמשיך.');
        return; // Stop if the cart is empty
    }
    
    await updateCartInDatabase(cartItems);
    addPaymentButton(); // Call to add payment button after checkout
});

function addPaymentButton() {
    const existingPaymentButton = document.getElementById('payment-button');
    
    // Check if the payment button already exists
    if (existingPaymentButton) return;

    const checkoutButton = document.getElementById('checkout-button');
    
    // Create the new payment button
    const paymentButton = document.createElement('button');
    paymentButton.id = 'payment-button';
    paymentButton.classList.add('btn', 'btn-success', 'mt-3', 'w-100');
    paymentButton.textContent = 'לתשלום לחץ כאן';

    // Append the new button after the checkout button
    checkoutButton.insertAdjacentElement('afterend', paymentButton);

    // Add event listener to the new payment button
    paymentButton.addEventListener('click', async function() {
        const customerId = sessionStorage.getItem('customerId');

        const response = await fetch(`http://localhost:3000/get-shipping-address/${customerId}`);
        const data = await response.json();

        // Check if the shipping address and city were successfully retrieved
        if (!response.ok || !data.address || !data.city) {
            alert('Failed to retrieve shipping details. Please try again later.');
            return;
        }

    const shippingAddress = `${data.address}, ${data.city}`

        const totalAmount =  document.getElementById('total-amount').textContent;

        const orderData = {
            order_id: generateUniqueId(), // Function to generate a unique order ID
            customer_id: customerId,
            order_date: new Date().toISOString(),
            total_amount: totalAmount,
            status: "הושלם",
            shipping_address: shippingAddress
        };

        fetch('http://localhost:3000/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            return response.text();
        })
        .then(data => {
            alert('בוצע בהצלחה! ההזמנה מופיעה באזור האישי.');
            localStorage.removeItem('cartItems'); // Clear cart after successful order
            loadCart(); // Reload the empty cart
        })
        .catch(error => {
            console.error('Error creating order:', error);
            alert('אירעה שגיאה במהלך ביצוע ההזמנה. נסה שוב מאוחר יותר.');
        });
    });
}

function generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 9); // Generates a random unique ID
}
