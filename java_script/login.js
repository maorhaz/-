document.addEventListener('DOMContentLoaded', function() {
    // create account
    const createAccountForm = document.querySelector('.form-create-account');
    const loginForm = document.querySelector('.form-login');

    if (createAccountForm) {
        createAccountForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            //form data
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
                } else {
                    console.error('Error creating account:', response.statusText);
                    alert('Failed to create account.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while creating the account.');
            }
        });

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
    
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            try {
                const response = await fetch(`http://localhost:3000/api/customers?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    
                if (response.ok) {
                    const data = await response.json();
                    const username = data.firstName || 'Guest';
    
                    // Store the username in sessionStorage
                    sessionStorage.setItem('username', username);
                    alert(username);
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
 }
    });
