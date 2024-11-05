$(document).ready(function() {
    $.ajax({
        url: '/api/config',
        method: 'GET',
        success: function(config) {
            $.ajax({
                url: `https://graph.facebook.com/${config.pageId}/posts?fields=message,full_picture&access_token=${config.accessToken}&limit=4`,
                method: 'GET',
                success: function(response) {
                    console.log('Response:', response);
                    if (!response.data || response.data.length === 0) {
                        $('#facebook-feed').append('<p>No posts available.</p>');
                        return;
                    }
                    $('#facebook-feed').empty(); 
                    response.data.forEach(function(post) {
                        const imageHtml = post.full_picture ? `<img src="${post.full_picture}" class="card-img-top" alt="Post image">` : '';
                        const postContent = `
                            <div class="col-md-3">
                                <div class="card mb-4">
                                    ${imageHtml}
                                    <div class="card-body">
                                        <p>${post.message || 'No message available'}</p>
                                        <a href="https://facebook.com/${post.id}" target="_blank" class="btn btn-primary btn-sm">View Post</a>
                                    </div>
                                </div>
                            </div>
                        `;
                        $('#facebook-feed').append(postContent);
                    });
                },
                error: function(error) {
                    console.log('Error fetching posts:', error);
                    $('#facebook-feed').append('<p>Error fetching posts. Please try again later.</p>');
                }
            });
        },
        error: function(error) {
            console.log('Error fetching config:', error);
            $('#facebook-feed').append('<p>Error fetching configuration. Please try again later.</p>');
        }
    });
});