document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('productGrid');
    const template = document.getElementById('product-card-template');

    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(products => {
         
            const meatProducts = products.filter(product => product.category_id === 10);

            meatProducts.forEach(product => {
                const productCard = template.content.cloneNode(true);
                
                productCard.querySelector('.product-image').src = `../resources/images/meat_page/${product.name.toLowerCase().replace(/ /g, '_')}.png`;
                productCard.querySelector('.product-image').alt = product.name;
                productCard.querySelector('.product-title').textContent = product.name;
                productCard.querySelector('.product-description').textContent = product.description || 'תיאור מוצר';
                productCard.querySelector('.product-price').textContent = product.price ? `₪${product.price}` : 'מחיר לא זמין';

                // Set up quantity selectors
                const minusBtn = productCard.querySelector('.quantity-btn.minus');
                const plusBtn = productCard.querySelector('.quantity-btn.plus');
                const quantityInput = productCard.querySelector('.quantity-input');

                minusBtn.addEventListener('click', () => {
                    if (quantityInput.value > 1) {
                        quantityInput.value = parseInt(quantityInput.value) - 1;
                    }
                });

                plusBtn.addEventListener('click', () => {
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                });

                productGrid.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
