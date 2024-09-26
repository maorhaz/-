$(document).ready(function () {
    // Simulated data (replace with actual data from your backend)
    const items = [
        { class: 'meat', title: 'בקר', imgSrc: '../resources/images/categories_pics/meat2.jpg' },
        { class: 'fish', title: 'דגים', imgSrc: '../resources/images/categories_pics/fish.jpg' },
        { class: 'chicken', title: 'עוף', imgSrc: '../resources/images/categories_pics/chicken.jpg' },
        { class: 'pantry', title: 'מזווה', imgSrc: '../resources/images/categories_pics/' },
        { class: 'cheese', title: 'גבינות', imgSrc: '../resources/images/categories_pics/cheese.jpg' },
        { class: 'alcohol', title: 'אלכוהול', imgSrc: '../resources/images/categories_pics/' },

    ];

    const gridContainer = $('#dynamic-grid');

    // Generate cards dynamically
    items.forEach(item => {
        const card = `
            <div class="${item.class}">
                <div class="col">
                    <div class="card mb-4">
                        <img src="${item.imgSrc}" class="card-img-top" alt="${item.title}">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        gridContainer.append(card);
    });
});