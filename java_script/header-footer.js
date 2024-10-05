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

            // Call the function to set the greeting
            setGreeting();
        })
        .catch(error => console.error('Error loading header-footer:', error));
});

function setGreeting() {

    const username = sessionStorage.getItem('username'); 
    const greeting = document.getElementById('greeting');
    const logoutButton = document.getElementById('logout-button');

    if (username) {
        greeting.textContent = `ברוך הבא, ${username}!`;
        logoutButton.style.display = 'block'; // Show logout button
    } else {
        greeting.textContent = 'ברוך הבא, אורח!';
        logoutButton.style.display = 'none'; // Hide logout button
    }

    logoutButton.addEventListener('click', function() {
        sessionStorage.removeItem('username');
        window.location.href = '../html/login.html'; 
    });
}
