(function() {
    let products = [];

    document.addEventListener('DOMContentLoaded', function() {
        fetch('/html/header-footer.html')
            .then(response => response.text())
            .then(data => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;

                const header = tempDiv.querySelector('header');
                if (header) {
                    document.body.insertAdjacentElement('afterbegin', header);
                }

                const footer = tempDiv.querySelector('footer');
                if (footer) {
                    document.body.appendChild(footer);
                }

                setGreeting()
                initSearch();
            })
            .catch(error => console.error('Error loading header-footer:', error));
    });

    function setGreeting() {
        const username = sessionStorage.getItem('username'); 
        const adminName = sessionStorage.getItem('adminName'); 
        const greeting = document.getElementById('greeting');
        const logoutButton = document.getElementById('logout-button');
    
        if (adminName) {
            greeting.textContent = `ברוך הבא, מנהל ${adminName}!`;
            logoutButton.style.display = 'block'; 
        } else if (username) {
            greeting.textContent = `ברוך הבא, ${username}!`;
            logoutButton.style.display = 'block'; 
        } else {
            greeting.textContent = 'ברוך הבא, אורח!';
            logoutButton.style.display = 'none'; 
        }
    
        logoutButton.addEventListener('click', function() {
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('adminName'); 
            window.location.href = '../html/login.html'; 
        });
    }
    

    function initSearch() {
        const searchIcon = document.getElementById('search-icon');
        const searchOverlay = document.createElement('div');
        searchOverlay.id = 'search-overlay';
        searchOverlay.className = 'search-overlay';
        searchOverlay.innerHTML = `
            <div class="search-container">
                <div class="search-input-wrapper">
                    <input type="text" id="search-input" placeholder="חפש מוצרים...">
                    <button id="close-search">&times;</button>
                </div>
                <div id="advanced-search">
                    <h3>חיפוש מתקדם</h3>
                    <div id="advanced-search-options">
                        <select id="search-category">
                            <option value="">בחר קטגוריה</option>
                            <option value="meat">בשר</option>
                            <option value="chicken">עוף</option>
                            <option value="cheese">גבינות</option>
                            <option value="fish">דגים</option>
                            <option value="alcohol">אלכוהול</option>
                            <option value="pantry">מוצרי מזווה</option>
                        </select>
                        <input type="number" id="min-price" placeholder="מחיר מינימום">
                        <input type="number" id="max-price" placeholder="מחיר מקסימום">
                        <select id="sort-by">
                            <option value="">מיין לפי</option>
                            <option value="price-asc">מחיר: מהנמוך לגבוה</option>
                            <option value="price-desc">מחיר: מהגבוה לנמוך</option>
                            <option value="name-asc">שם: א-ת</option>
                            <option value="name-desc">שם: ת-א</option>
                        </select>
                    </div>
                </div>
                <div id="search-results"></div>
                <button id="view-all-results">צפה בכל התוצאות</button>
            </div>
        `;
        document.body.appendChild(searchOverlay);

        const closeSearch = document.getElementById('close-search');
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const viewAllResults = document.getElementById('view-all-results');
        const advancedSearchOptions = document.getElementById('advanced-search-options');

        if (!searchIcon || !searchOverlay || !closeSearch || !searchInput || !searchResults || !viewAllResults || !advancedSearchOptions) {
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

        searchInput.addEventListener('input', performSearch);
        advancedSearchOptions.addEventListener('change', performSearch);

        viewAllResults.addEventListener('click', function() {
            const searchParams = getSearchParams();
            const queryString = new URLSearchParams(searchParams).toString();
            window.location.href = `search_results.html?${queryString}`;
        });

       
        if (window.location.pathname.includes('search_results.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            setSearchParamsFromUrl(urlParams);
            performSearch();
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
        resetAdvancedSearchOptions();
    }

    function resetAdvancedSearchOptions() {
        document.getElementById('search-category').value = '';
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        document.getElementById('sort-by').value = '';
    }

    function getSearchParams() {
        return {
            query: document.getElementById('search-input').value,
            category: document.getElementById('search-category').value,
            minPrice: document.getElementById('min-price').value,
            maxPrice: document.getElementById('max-price').value,
            sortBy: document.getElementById('sort-by').value
        };
    }

    function setSearchParamsFromUrl(urlParams) {
        document.getElementById('search-input').value = urlParams.get('query') || '';
        document.getElementById('search-category').value = urlParams.get('category') || '';
        document.getElementById('min-price').value = urlParams.get('minPrice') || '';
        document.getElementById('max-price').value = urlParams.get('maxPrice') || '';
        document.getElementById('sort-by').value = urlParams.get('sortBy') || '';
    }

    function performSearch() {
        const searchParams = getSearchParams();
        const filteredProducts = filterProducts(searchParams);
        const sortedProducts = sortProducts(filteredProducts, searchParams.sortBy);
        displaySearchResults(sortedProducts, document.getElementById('search-results'));
    }

    function filterProducts(params) {
        return products.filter(product => {
            const matchesQuery = !params.query || product.name.toLowerCase().includes(params.query.toLowerCase()) ||
                                 (product.description && product.description.toLowerCase().includes(params.query.toLowerCase()));
            const matchesCategory = !params.category || product.category === params.category;
            const matchesMinPrice = !params.minPrice || product.price >= parseFloat(params.minPrice);
            const matchesMaxPrice = !params.maxPrice || product.price <= parseFloat(params.maxPrice);
            
            return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice;
        });
    }

    function sortProducts(products, sortBy) {
        switch (sortBy) {
            case 'price-asc':
                return products.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return products.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return products.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return products.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return products;
        }
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
            
        });
    }
})();

console.log('Header, footer, and advanced search functionality loaded');