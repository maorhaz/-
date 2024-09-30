document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartDisplay() {
        const cartContainer = document.querySelector('.cart-items');
        const subtotalElement = document.getElementById('subtotal-amount');
        const shippingElement = document.getElementById('shipping-amount');
        const totalElement = document.getElementById('total-amount');
        
        cartContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="../resources/images/meat_page/${item.name.toLowerCase().replace(/ /g, '_')}.png" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>מחיר: ₪${item.price.toFixed(2)}</p>
                    <p>כמות: ${item.quantity}</p>
                    <p>סה"כ: ₪${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">הסר</button>
            `;
            cartContainer.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        });

        const shipping = subtotal > 0 ? 20 : 0; 
        const total = subtotal + shipping;

        subtotalElement.textContent = `₪${subtotal.toFixed(2)}`;
        shippingElement.textContent = `₪${shipping.toFixed(2)}`;
        totalElement.textContent = `₪${total.toFixed(2)}`;

        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                removeFromCart(this.dataset.id);
            });
        });

       
        updateCartIcon();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }

    function updateCartIcon() {
        const cartIcon = document.querySelector('.bi-cart2');
        if (cartIcon) {
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartIcon.setAttribute('data-count', itemCount);
        }
    }

    updateCartDisplay();

    
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            
            console.log('Proceeding to checkout');
        });
    }
});