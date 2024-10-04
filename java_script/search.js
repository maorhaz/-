document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.getElementById('search-icon');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const viewAllResults = document.getElementById('view-all-results');
    let products = [];

    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            console.log('Products loaded:', products.length);
        })
        .catch(error => console.error('Error fetching products:', error));

    function openSearchOverlay() {
        searchOverlay.style.display = 'flex';
        searchIcon.classList.add('active');
        searchInput.focus();
    }

    function closeSearchOverlay() {
        searchOverlay.style.display = 'none';
        searchIcon.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }

    searchIcon.addEventListener('click', openSearchOverlay);
    closeSearch.addEventListener('click', closeSearchOverlay);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
            closeSearchOverlay();
        }
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        if (searchTerm.length > 0) {
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm))
            );
            displaySearchResults(filteredProducts);
        } else {
            searchResults.innerHTML = '';
        }
    });

    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">אין תוצאות חיפוש.</p>';
            viewAllResults.style.display = 'none';
            return;
        }

        const resultsToShow = results.slice(0, 5); // Show only first 5 results
        const template = document.getElementById('search-result-template');

        resultsToShow.forEach(product => {
            const resultItem = template.content.cloneNode(true);
            const img = resultItem.querySelector('.search-result-image');
            const name = resultItem.querySelector('.search-result-name');
            const description = resultItem.querySelector('.search-result-description');
            const price = resultItem.querySelector('.search-result-price');

            img.src = `../resources/images/product_id_photos/${product.product_id}.jpg`;
            img.onerror = () => { img.src = `../resources/images/product_id_photos/${product.product_id}.png`; };
            name.textContent = product.name;
            description.textContent = product.description || 'תיאור מוצר לא זמין';
            price.textContent = `₪${product.price}`;

            searchResults.appendChild(resultItem);
        });

        viewAllResults.style.display = results.length > 5 ? 'block' : 'none';
    }

    viewAllResults.addEventListener('click', function() {
        const searchTerm = searchInput.value;
        window.location.href = `search-results.html?query=${encodeURIComponent(searchTerm)}`;
    });
});

console.log('Enhanced search script loaded');