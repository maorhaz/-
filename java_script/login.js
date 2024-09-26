document.addEventListener('DOMContentLoaded', function() {
    // Create account
    const createAccountForm = document.querySelector('.form-create-account');
    const loginForm = document.querySelector('.form-login');

    if (createAccountForm) {
        createAccountForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Form data
            const formData = {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                email: document.getElementById('create-account-email').value,
                phoneNumber: document.getElementById('phone-number').value,
                city: document.getElementById('city').value,
                address: document.getElementById('address').value,
                entrance: document.getElementById('entrance').value,
                apartment: document.getElementById('apartment').value,
                floor: document.getElementById('floor').value,
                password: document.getElementById('create-account-password').value,
                newsletter: document.getElementById('newsletter').checked
            };

            try {
                const response = await fetch('http://localhost:3000/api/create-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Account Creation Response:', data);
                    alert('Account created successfully!');

                    // Store first name in localStorage
                    localStorage.setItem('username', formData.firstName);
                    // Redirect to home page
                    window.location.href = '../html/amigos_home_page.html';
                } else {
                    const errorData = await response.json();
                    console.error('Error creating account:', errorData);
                    alert(`Failed to create account: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while creating the account.');
            }
        });
    }
        if (loginForm) {
            loginForm.addEventListener('submit', async function (e) {
                e.preventDefault();
    
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
    
                try {
                    // Make a GET request to your login endpoint with email and password as query parameters
                    const response = await fetch(`http://localhost:3000/api/customers?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    
                    if (response.ok) {
                        const data = await response.json();
                        const username = data.firstName || 'Guest'; // Default to 'Guest' if no first name is returned
    
                        // Store the username in sessionStorage
                        sessionStorage.setItem('username', username);
                        const greetingText = document.getElementById('greeting');
                        alert(1);
                        if (greetingText) {
                            // Get the username from sessionStorage
                            const username = sessionStorage.getItem('username') || 'Guest';
                    
                            // Update the greeting text
                            greetingText.textContent = `Hello, ${username}`;
                            ç
                        }
                        // Redirect to the home page
                        window.location.href = '../html/amigos_home_page.html';
                    } else {
                        const errorData = await response.json();
                        alert(`Login failed: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    alert('An error occurred during login.');
                }
            });
        }
    
   
    });
