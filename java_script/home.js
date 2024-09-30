document.addEventListener('DOMContentLoaded', function() {
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

    // Logout functionality
    logoutButton.addEventListener('click', function() {
        sessionStorage.removeItem('username');
        window.location.href = '../html/login.html'; // Redirect to login page after logout
    });
});
