$(document).ready(function () {
    // Simulated data (replace with actual data from your backend)
    const items = [
        { class: 'meat', title: 'בקר', imgSrc: '../resources/images/categories_pics/meat2.jpg' },
        { class: 'fish', title: 'דגים', imgSrc: '../resources/images/categories_pics/fish.jpg' },
        { class: 'chicken', title: 'עוף', imgSrc: '../resources/images/categories_pics/chicken.jpg' },
        { class: 'pantry', title: 'מזווה', imgSrc: '../resources/images/categories_pics/dry.jpg' },
        { class: 'cheese', title: 'גבינות', imgSrc: '../resources/images/categories_pics/cheese.jpg' },
        { class: 'alcohol', title: 'אלכוהול', imgSrc: '../resources/images/categories_pics/alcohol.jpg' },

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

// dynamic change content when clicked
$(document).ready(function() {
    const items = [
        { class: 'meat', pageSrc: '../html/meat_page.html' },
        { class: 'fish', pageSrc: '../html/fish_page.html' },
        { class: 'chicken', pageSrc: '../html/chicken_page.html' },
        { class: 'pantry', pageSrc: '../html/pantry_page.html' },
        { class: 'cheese', pageSrc: '../html/cheese_page.html' },
        { class: 'alcohol', pageSrc: '../html/alcohol_page.html' },
    ];


    items.forEach(item => { 
        const selector = `.${item.class}`; 
        // Add an event listener to card element 
        $(document).on('click', selector, function() { 
           // move to a new page
                window.location.href = item.pageSrc;
            }); 
        });
    });


