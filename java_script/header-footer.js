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
        })
        .catch(error => console.error('Error loading header-footer:', error));
});