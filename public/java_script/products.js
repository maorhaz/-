const CATEGORY_MAPPING = {
    'meat_page.html': 10,
    'chicken_page.html': 20,
    'fish_page.html': 30,
    'cheese_page.html': 40,
    'pantry_page.html': 50,
    'alcohol_page.html': 60
};

class ProductManager {
    constructor() {
        this.productGrid = document.getElementById('productGrid');
        this.template = document.getElementById('product-card-template');
        this.products = []; // stores the products for sorting
        this.initializeSorting();
    }

    initializeSorting() {
        const sortSelect = document.querySelector('.filter-options select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const selectedOption = e.target.selectedIndex;
                switch(selectedOption) {
                    case 1: // מהנמוך לגבוה
                        this.sortProducts('low-to-high');
                        break;
                    case 2: // מהגבוה לנמוך
                        this.sortProducts('high-to-low');
                        break;
                    default:
                        this.sortProducts('default');
                        break;
                }
            });
        }
    }

    sortProducts(sortOrder) {
        let sortedProducts = [...this.products]; // copy for sorting
        
        switch(sortOrder) {
            case 'low-to-high':
                sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'high-to-low':
                sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'default':
                sortedProducts = [...this.products];
                break;
        }

        this.renderProducts(sortedProducts);
    }

    getCurrentCategory() {
        const currentPage = window.location.pathname.split('/').pop();
        return CATEGORY_MAPPING[currentPage];
    }

    async loadProducts(categoryId) {
        try {
            const products = await this.fetchProducts();
            this.products = products.filter(product => product.category_id === categoryId);
            this.renderProducts(this.products);
        } catch (error) {
            console.error('Error fetching or processing product data:', error);
        }
    }

    async fetchProducts() {
        const response = await fetch('http://localhost:3000/api/products');
        return await response.json();
    }

    renderProducts(products) {
        this.productGrid.innerHTML = ''; // clear existing products
        products.forEach(product => {
            const productCard = this.createProductCard(product);
            this.productGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const productCard = this.template.content.cloneNode(true);
        const elements = {
            image: productCard.querySelector('.product-image'),
            title: productCard.querySelector('.product-title'),
            description: productCard.querySelector('.product-description'),
            price: productCard.querySelector('.product-price'),
            minusBtn: productCard.querySelector('.quantity-btn.minus'),
            plusBtn: productCard.querySelector('.quantity-btn.plus'),
            quantityInput: productCard.querySelector('.quantity-input'),
            addToCartBtn: productCard.querySelector('.add-to-cart')
        };

        this.setupProductImage(elements.image, product);
        this.setupProductDetails(elements, product);
        this.setupQuantityControls(elements, product);
        this.setupAddToCart(elements.addToCartBtn, elements.quantityInput, product);

        return productCard;
    }

    setupProductImage(imageElement, product) {
        imageElement.alt = product.name;

        // JPG or PNG
        const jpgPath = `../resources/images/product_id_photos/${product.product_id}.jpg`;
        const pngPath = `../resources/images/product_id_photos/${product.product_id}.png`;
        
        imageElement.src = jpgPath;

        imageElement.onerror = () => {
            // if JPG fails try PNG
            imageElement.src = pngPath;
            imageElement.onerror = () => {
                imageElement.src = '../resources/images/general/default.jpg';
            };
        };
    }

    setupProductDetails(elements, product) {
        elements.title.textContent = product.name;
        elements.description.textContent = product.description || 'תיאור מוצר';
        elements.price.textContent = `₪${product.price}`;
    }

    setupQuantityControls(elements, product) {
        const updateTotalPrice = () => {
            const quantity = parseInt(elements.quantityInput.value);
            const totalPrice = product.price * quantity;
            elements.price.textContent = `₪${totalPrice.toFixed(2)}`;
        };

        elements.minusBtn.addEventListener('click', () => {
            if (elements.quantityInput.value > 0) {
                elements.quantityInput.value = parseInt(elements.quantityInput.value) - 1;
                updateTotalPrice();
            }
        });

        elements.plusBtn.addEventListener('click', () => {
            elements.quantityInput.value = parseInt(elements.quantityInput.value) + 1;
            updateTotalPrice();
        });

        elements.quantityInput.addEventListener('input', () => {
            if (elements.quantityInput.value < 0) {
                elements.quantityInput.value = 0;
            }
            updateTotalPrice();
        });
    }

    setupAddToCart(addToCartBtn, quantityInput, product) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0) {
                this.addToCart(product, quantity);
            }
        });
    }

    addToCart(product, quantity) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingItemIndex = cartItems.findIndex(item => item.id === product.product_id);
        
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            cartItems.push({
                id: product.product_id,
                name: product.name,
                price: product.price,
                quantity: quantity,
            });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        alert(`הוספת ${quantity} של ${product.name} לסל הקניות`);
    }
}

// auto initialize page launch 
document.addEventListener('DOMContentLoaded', async function() {
    const productManager = new ProductManager();
    const categoryId = productManager.getCurrentCategory();
    if (categoryId) {
        await productManager.loadProducts(categoryId);
    }
});