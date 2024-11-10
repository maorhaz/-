document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.querySelector('.form-admin-login');
    
    // Admin login
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const adminEmail = document.getElementById('admin-email').value;
            const adminPassword = document.getElementById('admin-password').value;

            try {
                const response = await fetch('http://localhost:3000/api/admins', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: adminEmail, password: adminPassword })
                });

                if (response.ok) {
                    const data = await response.json();
                    const adminName = data.firstName || 'Admin';

                    // Store the admin name in sessionStorage
                    sessionStorage.setItem('adminName', adminName);

                    // Redirect to the admin dashboard
                    window.location.href = '../html/admin_menu.html';
                } else {
                    const errorData = await response.json();
                    alert(`Admin login failed: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error during admin login:', error);
                alert('An error occurred during admin login.');
            }
        });
    }
});
