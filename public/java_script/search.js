let products = [];

function initSearch() {
    fetchProducts();

    if (window.location.pathname.includes('search_results.html')) { //check which page we are on
        setupSearchResultsPage();
    } else {
        setupSearchOverlay();
    }
}

function setupSearchOverlay() { //get all elements we need
    const searchIcon = document.getElementById('search-icon');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const viewAllResults = document.getElementById('view-all-results');

    searchIcon?.addEventListener('click', () => {
        searchOverlay.style.display = 'flex';
        searchInput.focus();
    });

    closeSearch?.addEventListener('click', closeSearchOverlay); //close when X is clicked 

    searchIcon?.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.innerHTML = '';
        viewAllResults.style.display = 'none';
    });

    searchInput?.addEventListener('input', () => { //show results when user types
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length > 0) {
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            displayOverlayResults(filtered.slice(0, 5));
            viewAllResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '';
            viewAllResults.style.display = 'none';
        }
    });

    viewAllResults?.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = `../html/search_results.html?query=${encodeURIComponent(searchTerm)}`;
        }
    });

    document.addEventListener('keydown', (e) => { //close overlay when ESC key is pressed
        if (e.key === 'Escape' && searchOverlay?.style.display === 'flex') {
            closeSearchOverlay();
        }
    });
}

function setupSearchResultsPage() {
    // get all filter elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const descriptionSearch = document.getElementById('description-search');
    const category = document.getElementById('category');
    const priceRange = document.getElementById('price-range');
    const sortBy = document.getElementById('sort-by');

    const urlParams = new URLSearchParams(window.location.search);
    if (searchInput) {
        searchInput.value = urlParams.get('query') || '';
    }


    searchInput?.addEventListener('input', debounce(performSearch, 300));
    
    //search when button clicked
    searchButton?.addEventListener('click', (e) => {
        e.preventDefault();
        performSearch();
    });

    // search when enter key clicked
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    descriptionSearch?.addEventListener('input', debounce(performSearch, 300));
    category?.addEventListener('change', performSearch);
    priceRange?.addEventListener('change', performSearch);
    sortBy?.addEventListener('change', performSearch);

    // initial search
    performSearch();
}
function performSearch() { //main search function
    console.log('Performing search...');
    let filtered = [...products];

    //get all filter values
    const searchInput = document.getElementById('search-input')?.value.trim().toLowerCase();
    const descriptionSearch = document.getElementById('description-search')?.value.trim().toLowerCase();
    const categoryValue = document.getElementById('category')?.value;
    const priceRange = document.getElementById('price-range')?.value;
    const sortBy = document.getElementById('sort-by')?.value;

    console.log('Filter values:', { 
        searchInput, 
        descriptionSearch, 
        category: categoryValue, 
        priceRange, 
        sortBy 
    });

    //text filters
    if (searchInput || descriptionSearch) {
        filtered = filtered.filter(product => {
            let matches = true;
            if (searchInput) {
                matches = matches && product.name.toLowerCase().includes(searchInput);
            }
            if (descriptionSearch) {
                matches = matches && (product.description || '').toLowerCase().includes(descriptionSearch);
            }
            return matches;
        });
    }

    //category filter
    if (categoryValue) {
        console.log('Filtering by category:', categoryValue);
        filtered = filtered.filter(product => {
            console.log('Product category:', product.category_id, 'Looking for:', parseInt(categoryValue));
            return product.category_id === parseInt(categoryValue);
        });
    }

    //price range filter
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filtered = filtered.filter(product => {
            const price = parseFloat(product.price);
            if (max) {
                return price >= min && price <= max;
            }
            return price >= min; //for "200+" case
        });
    }

    //sorting
    if (sortBy) {
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name.localeCompare(b.name, 'he');
                case 'name-desc':
                    return b.name.localeCompare(a.name, 'he');
                default:
                    return 0;
            }
        });
    }

    console.log('Final filtered results:', filtered.length, 'results');
    displaySearchResults(filtered);
}

function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">לא נמצאו תוצאות</p>';
        return;
    }

    results.forEach(product => { //create card for each product
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img class="product-image" 
                 src="../resources/images/product_id_photos/${product.product_id}.jpg" 
                 alt="${product.name}" 
                 onerror="this.src='../resources/images/product_id_photos/${product.product_id}.png'">
                <div class="product-info">
            <div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description || 'תיאור מוצר לא זמין'}</p>
                <p class="product-price">₪${product.price}</p>
            </div>
            <button class="add-to-cart" data-product='${JSON.stringify(product)}'>הוסף לסל</button>
        </div>
        `;

        const addToCartBtn = card.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productData = JSON.parse(e.target.dataset.product);
            addToCart(productData);
        });

        card.addEventListener('click', () => showProductDetails(product)); 
        container.appendChild(card);
    });
}

function displayOverlayResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">לא נמצאו תוצאות</p>';
        return;
    }

    results.forEach(product => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <img class="search-result-image" 
                 src="../resources/images/product_id_photos/${product.product_id}.jpg" 
                 alt="${product.name}" 
                 onerror="this.src='../resources/images/product_id_photos/${product.product_id}.png'">
            <div class="search-result-info">
                <h3 class="search-result-name">${product.name}</h3>
                <p class="search-result-description">${product.description || 'תיאור מוצר לא זמין'}</p>
                <span class="search-result-price">₪${product.price}</span>
            </div>
        `;
        item.addEventListener('click', () => {
            closeSearchOverlay();
            showProductDetails(product);
        });
        container.appendChild(item);
    });
}

function showProductDetails(product) {
    const overlay = document.createElement('div');
    overlay.className = 'product-detail-overlay';
    
    overlay.innerHTML = `
        <div class="product-detail-content">
            <button class="close-product-detail">&times;</button>
            <img src="../resources/images/product_id_photos/${product.product_id}.jpg" 
                 alt="${product.name}" 
                 onerror="this.src='../resources/images/product_id_photos/${product.product_id}.png'">
            <h2>${product.name}</h2>
            <p>${product.description || 'תיאור מוצר לא זמין'}</p>
            <p class="price">₪${product.price}</p>
            <button class="add-to-cart" data-product='${JSON.stringify(product)}'>הוסף לסל</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.close-product-detail');
    const addToCartBtn = overlay.querySelector('.add-to-cart');

    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    addToCartBtn.addEventListener('click', (e) => {
        const productData = JSON.parse(e.target.dataset.product);
        addToCart(productData);
        document.body.removeChild(overlay);
    });
}

function addToCart(product) { //add product to the shopping cart
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    const existingItem = cartItems.find(item => item.id === product.product_id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: product.product_id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    const customerId = sessionStorage.getItem('customerId');
    const username = sessionStorage.getItem('username');

    if (customerId && username) {
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
            body: JSON.stringify(cartData)
        })
        .catch(error => console.error('Error updating cart:', error));
    }

    alert('המוצר נוסף לסל בהצלחה!');
}

function fetchProducts() {
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            if (window.location.pathname.includes('search_results.html')) {
                performSearch();
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                searchResults.innerHTML = '<p class="no-results">שגיאה בטעינת מוצרים. אנא נסה שוב מאוחר יותר.</p>';
            }
        });
}

function debounce(func, wait) { //helper to prevent too many searches
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function closeSearchOverlay() {
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const viewAllResults = document.getElementById('view-all-results');

    searchOverlay.style.display = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '';
    viewAllResults.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', initSearch);