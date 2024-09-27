document.addEventListener('DOMContentLoaded', function() {
    const greetingText = document.getElementById('greeting');

    // Get the username from sessionStorage
    const username = sessionStorage.getItem('username') || 'Guest';
    alert(username);
    // Update the greeting text
    if (greetingText) {
        greetingText.textContent = `Hello, ${username}`;
    }
});
