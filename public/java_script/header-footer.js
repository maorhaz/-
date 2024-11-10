(function() {
    let products = [];

    document.addEventListener('DOMContentLoaded', function() {
        fetch('/html/header-footer.html')
            .then(response => response.text())
            .then(data => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;

                const header = tempDiv.querySelector('header');  // insert header at the beginning of the body
                if (header) {
                    document.body.insertAdjacentElement('afterbegin', header);
                }

                const footer = tempDiv.querySelector('footer'); // footer at the end of the body
                if (footer) {
                    document.body.appendChild(footer);
                }

                setGreeting();
                initSearch();
                initSidebar();
            })
            .catch(error => console.error('Error loading header-footer:', error));
    });

    function setGreeting() { // different greeting for admin, user or guest
        const username = sessionStorage.getItem('username'); 
        const adminName = sessionStorage.getItem('adminName'); 
        const greeting = document.getElementById('greeting');
        const logoutButton = document.getElementById('logout-button');
    
        if (adminName) {
            greeting.textContent = `ברוך הבא, ${adminName}!`;
            logoutButton.style.display = 'block'; 
        } else if (username) {
            greeting.textContent = `ברוך הבא, ${username}!`;
            logoutButton.style.display = 'block'; 
        } else {
            greeting.textContent = 'ברוך הבא, אורח';
            logoutButton.style.display = 'none'; 
        }
    
        logoutButton.addEventListener('click', function() { // logout functionality
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('adminName'); 
            sessionStorage.removeItem('customerId');
            window.location.href = '../html/login.html'; 
        });
    }

    function initSidebar() {
        const menuIcon = document.querySelector('.menu-icon');
        if (!menuIcon) {
            console.error('Menu icon not found');
            return;
        }
    
       
        const sidebar = document.createElement('div');
        sidebar.className = 'sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-header">תפריט</div>
            <div class="sidebar-content">
                <a href="meat_page.html" class="sidebar-item">
                    <img src="../resources/images/general/sidebar_meat.jpg" alt="בשר" class="sidebar-item-image">
                    <span class="sidebar-item-text">בשר</span>
                    <i class="bi bi-chevron-left"></i>
                </a>
                <a href="chicken_page.html" class="sidebar-item">
                    <img src="../resources/images/general/sidebar_chicken.jpg" alt="עוף" class="sidebar-item-image">
                    <span class="sidebar-item-text">עוף</span>
                    <i class="bi bi-chevron-left"></i>
                </a>
                <a href="fish_page.html" class="sidebar-item">
                    <img src="../resources/images/general/sidebar_fish.jpg" alt="דגים" class="sidebar-item-image">
                    <span class="sidebar-item-text">דגים</span>
                    <i class="bi bi-chevron-left"></i>
                </a>
                <a href="cheese_page.html" class="sidebar-item">
                    <img src="../resources/images/general/sidebar_cheese.jpg" alt="גבינות" class="sidebar-item-image">
                    <span class="sidebar-item-text">גבינות</span>
                    <i class="bi bi-chevron-left"></i>
                </a>
                <a href="pantry_page.html" class="sidebar-item">
                    <img src="../resources/images/general/sidebar_pantry.jpg" alt="מוצרי מזווה" class="sidebar-item-image">
                    <span class="sidebar-item-text">מוצרי מזווה</span>
                    <i class="bi bi-chevron-left"></i>
                </a>
                <a href="alcohol_page.html" class="sidebar-item">
                    <img src="../resources/images/general/sidebar_wine.jpg" alt="יין" class="sidebar-item-image">
                    <span class="sidebar-item-text">יין</span>
                    <i class="bi bi-chevron-left"></i>
                </a>
                  <a href="required.html" class="sidebar-item">
                <span class="sidebar-item-text">בואו לעבוד איתנו</span>
            </a>
            <a href="contact.html" class="sidebar-item">
                <span class="sidebar-item-text">צרו קשר</span>
            </a>
             <a href="personal_area.html" class="sidebar-item">
                <span class="sidebar-item-text">אזור אישי</span>
            </a>
            </div>
            
        `;
        document.body.appendChild(sidebar);
    
        menuIcon.addEventListener('click', () => toggleSidebar(sidebar)); // toggle sidebar on menu icon click
    
        // close sidebar when clicking outside
        document.addEventListener('click', (event) => {
            if (!sidebar.contains(event.target) && !menuIcon.contains(event.target) && sidebar.classList.contains('open')) {
                toggleSidebar(sidebar);
            }
        });
    }

    // toggle the sidebar
    function toggleSidebar(sidebar) {
        sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open');
    }

    function initSearch() {
        const searchIcon = document.getElementById('search-icon');
        const searchOverlay = document.createElement('div');
        searchOverlay.id = 'search-overlay';
        searchOverlay.className = 'search-overlay';
        
        // search overlay without filters
        searchOverlay.innerHTML = `
            <div class="search-container">
                <div class="search-input-wrapper">
                    <input type="text" id="search-input" placeholder="חפש מוצרים...">
                    <button id="close-search">&times;</button>
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
        }); // close search on ESC key

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm.length > 0) {
                const filtered = filterProducts(searchTerm);
                displaySearchResults(filtered.slice(0, 5), searchResults);
                viewAllResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '';
                viewAllResults.style.display = 'none';
            }
        });

        viewAllResults.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `../html/search_results.html?query=${encodeURIComponent(searchTerm)}`;
            }
        });
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

    function filterProducts(searchTerm) {
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    function displaySearchResults(results, container) {
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = '<p class="no-results">אין תוצאות חיפוש.</p>';
            return;
        }

        results.forEach(product => {
            const resultItem = createResultItem(product);
            container.appendChild(resultItem);
        });
    }

    function createResultItem(product) { 
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
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
        resultItem.addEventListener('click', () => showProductDetails(product));
        return resultItem;
    }

    function showProductDetails(product) {
        const productDetailOverlay = document.createElement('div');
        productDetailOverlay.className = 'product-detail-overlay';
        productDetailOverlay.innerHTML = `
            <div class="product-detail-content">
                <button class="close-product-detail">&times;</button>
                <img src="../resources/images/product_id_photos/${product.product_id}.jpg" 
                     alt="${product.name}" 
                     onerror="this.src='../resources/images/product_id_photos/${product.product_id}.png'">
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
            addToCart(product);
            document.body.removeChild(productDetailOverlay);
        });
    }

    function openSearchOverlay(overlay, input) {
        overlay.style.display = 'flex';
        input.focus();
    }

    function closeSearchOverlay(overlay, input, results) {
        overlay.style.display = 'none';
        input.value = '';
        results.innerHTML = '';
        if(document.getElementById('view-all-results')) {
            document.getElementById('view-all-results').style.display = 'none';
        }
    }

    function addToCart(product) { // add to cart
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
})();

console.log('Header and footer loaded');