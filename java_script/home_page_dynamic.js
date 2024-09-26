// dynamic change content when clicked
$(document).ready(function() {
    const items = [
        { class: 'meat', pageSrc: '../html/dynamic_meat_page.html' },
        { class: 'fish', pageSrc: '../html/fish_page.html' },
        { class: 'chicken', pageSrc: '../html/chicken_page.html' },
        { class: 'pantry', pageSrc: '../html/extras_page.html' },
        { class: 'cheese', pageSrc: '../html/cheese_page.html' },
        { class: 'alcohol', pageSrc: '../html/kebab_page.html' },
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


