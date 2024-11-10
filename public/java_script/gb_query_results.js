window.onload = function() {
    const adminName = sessionStorage.getItem('adminName');
    if (!adminName) {
        window.location.href = '../html/admin_login.html';
    }
};

let productsData = [];
let chart;
let currentLoadFunction = null;

const categoryMap = {
    '10': 'Meat',
    '20': 'Chicken',
    '30': 'Fish',
    '40': 'Cheese',
    '50': 'Pantry',
    '60': 'Alcohol'
};

function getCategoryName(categoryId) {
    return categoryMap[categoryId] || `Category ${categoryId}`;
}

async function fetchProducts() {
    if (productsData.length === 0) {
        const response = await fetch('http://localhost:3000/api/products');
        productsData = await response.json();
    }
    return productsData;
}

async function loadProductsByCategory() {
    const products = await fetchProducts();
    const groupedProducts = _.groupBy(products, 'category_id');
    const result = Object.entries(groupedProducts).map(([category, products]) => ({
        category: getCategoryName(category),
        count: products.length,
        Average_Price: _.meanBy(products, 'price')
    }));
    currentLoadFunction = loadProductsByCategory;
    displayResults(result, 'Products by Category');
}

async function loadTopSellingProducts() {
    const products = await fetchProducts();
    const sortedProducts = _.orderBy(products, ['stock_quantity'], ['desc']);
    const topProducts = _.take(sortedProducts, 10);
    currentLoadFunction = loadTopSellingProducts;
    displayResults(topProducts.map(p => ({ name: p.name, stock: p.stock_quantity })), 'Top Selling Products');
}

async function loadAveragePriceByCategory() {
    const products = await fetchProducts();
    const groupedProducts = _.groupBy(products, 'category_id');
    const result = Object.entries(groupedProducts).map(([category, products]) => ({
        category: getCategoryName(category),
        averagePrice: _.meanBy(products, 'price')
    }));
    currentLoadFunction = loadAveragePriceByCategory;
    displayResults(result, 'Average Price by Category');
}

function applyViewChange() {
    if (currentLoadFunction) {
        currentLoadFunction();
    }
}

function displayResults(data, title) {
    const viewType = document.getElementById('viewType').value;
    if (viewType === 'table') {
        displayTable(data, title);
    } else {
        displayChart(data, title);
    }
}

function displayTable(data, title) {
    let tableHtml = `<div class="card p-6"><h2 class="text-2xl font-bold mb-4">${title}</h2>`;
    tableHtml += '<div class="overflow-x-auto"><table class="min-w-full bg-white rounded-lg overflow-hidden"><thead><tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">';
    
    Object.keys(data[0]).forEach(key => {
        tableHtml += `<th class="py-3 px-6 text-left">${key}</th>`;
    });
    tableHtml += '</tr></thead><tbody class="text-gray-600 text-sm font-light">';

    data.forEach((item, index) => {
        tableHtml += `<tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100">`;
        Object.values(item).forEach(value => {
            tableHtml += `<td class="py-3 px-6">${typeof value === 'number' ? value.toFixed(2) : value}</td>`;
        });
        tableHtml += '</tr>';
    });

    tableHtml += '</tbody></table></div></div>';
    document.getElementById('tableResults').innerHTML = tableHtml;
    document.getElementById('tableResults').classList.add('show');
    document.getElementById('tableResults').classList.remove('hidden');
    document.getElementById('chartResults').classList.add('hidden');
}

function displayChart(data, title) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = data.map(item => item.category || item.name);
    const values = data.map(item => item.averagePrice || item.stock || item.count);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: values,
                backgroundColor: 'rgba(198, 190, 69, 0.6)',
                borderColor: 'rgba(198, 190, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    document.getElementById('tableResults').classList.add('hidden');
    document.getElementById('chartResults').classList.remove('hidden');
}
