(function() {
    let products = [];

    function initSearch() {
        const searchIcon = document.getElementById('search-icon');
        const searchOverlay = document.getElementById('search-overlay');
        const closeSearch = document.getElementById('close-search');
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const viewAllResults = document.getElementById('view-all-results');

        if (!searchIcon || !searchOverlay || !closeSearch || !searchInput || !searchResults || !viewAllResults) {
            console.error('Some search elements are missing from the page');
            return;
        }

        fetchProducts();

        searchIcon.addEventListener('click', () => openSearchOverlay(searchOverlay, searchInput));
        closeSearch.addEventListener('click', () => closeSearchOverlay(searchOverlay, searchInput, searchResults));
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
                closeSearchOverlay(searchOverlay, searchInput, searchResults);
            }
        });

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            if (searchTerm.length > 0) {
                const filteredProducts = filterProducts(searchTerm);
                displaySearchResults(filteredProducts, searchResults);
            } else {
                searchResults.innerHTML = '';
            }
            viewAllResults.style.display = 'block';
        });

        viewAllResults.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== '') {
                window.location.href = `../html/search_results.html?query=${encodeURIComponent(searchTerm)}`;
            } else {
                alert('הזן שאילתת חיפוש חוקית');
            }
        });

        // Check if we're on the search results page
        if (window.location.pathname.includes('search_results.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('query');
            if (query) {
                searchInput.value = query;
                performSearch(query, searchResults);
            }
        }
    }

    function fetchProducts() {
        fetch('http://localhost:3000/api/products')
            .then(response => response.json())
            .then(data => {
                products = data;
                console.log('Products loaded:', products.length);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function openSearchOverlay(overlay, input) {
        overlay.style.display = 'flex';
        input.focus();
    }

    function closeSearchOverlay(overlay, input, results) {
        overlay.style.display = 'none';
        input.value = '';
        results.innerHTML = '';
    }

    function filterProducts(searchTerm) {
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );
    }

    function displaySearchResults(results, container) {
        container.innerHTML = '';
        if (results.length === 0) {
            container.innerHTML = '<p class="no-results">אין תוצאות חיפוש.</p>';
            return;
        }

        const resultsToShow = results.slice(0, 5);

        resultsToShow.forEach(product => {
            const resultItem = createResultItem(product);
            container.appendChild(resultItem);
        });
    }

    function createResultItem(product) {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img class="search-result-image" src="../resources/images/product_id_photos/${product.product_id}.jpg" alt="${product.name}" onerror="this.src='../resources/images/product_id_photos/${product.product_id}.png'">
            <div class="search-result-info">
                <h3 class="search-result-name">${product.name}</h3>
                <p class="search-result-description">${product.description || 'תיאור מוצר לא זמין'}</p>
                <span class="search-result-price">₪${product.price}</span>
            </div>
        `;
        resultItem.addEventListener('click', () => showProductDetails(product));
        return resultItem;
    }

    function showProductDetails(product) {
        const productDetailOverlay = document.createElement('div');
        productDetailOverlay.className = 'product-detail-overlay';
        productDetailOverlay.innerHTML = `
            <div class="product-detail-content">
                <button class="close-product-detail">&times;</button>
                <img src="../resources/images/product_id_photos/${product.product_id}.jpg" alt="${product.name}" onerror="this.src='../resources/images/product_id_photos/${product.product_id}.png'">
                <h2>${product.name}</h2>
                <p>${product.description || 'תיאור מוצר לא זמין'}</p>
                <p class="price">₪${product.price}</p>
                <button class="add-to-cart">הוסף לסל</button>
            </div>
        `;
        document.body.appendChild(productDetailOverlay);

        productDetailOverlay.querySelector('.close-product-detail').addEventListener('click', () => {
            document.body.removeChild(productDetailOverlay);
        });

        productDetailOverlay.querySelector('.add-to-cart').addEventListener('click', () => {
            console.log('Adding to cart:', product);
            // Implement your add to cart logic here
        });
    }

    function performSearch(query, container) {
        const filteredProducts = filterProducts(query);
        displaySearchResults(filteredProducts, container);
    }

    // Initialize the search functionality when the DOM is ready
    document.addEventListener('DOMContentLoaded', initSearch);
})();

console.log('Improved global search script loaded');

