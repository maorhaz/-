$(document).ready(function() {
  
    var pageID = '605112776347746';
    var accessToken = 'EAAGgmZAiYiEoBOyeor5V6MlPkZBDX9NylpOT5fKPktnZCiyQOOjaK4GGSbZBO3RnbPwvp1iDghmnSbS0GcMZAlGSRGFvZC2js6eeEaY9sTycjdklRMv4ZCczcwGfCmLj25uEGblfYs6fhqNZA2VRXWn7TTa1v0idWBMd3zwsrHMMAhH2fYmSwOqtaObE2eO7Kh9o41j3n3kXVKQ0Xf44KODNv2ZB3';
  

    $.ajax({
      url: `https://graph.facebook.com/${pageID}/posts?fields=message,full_picture&access_token=${accessToken}&limit=4`,
      method: 'GET',
      success: function(response) {
          var posts = response.data;
          $('#facebook-feed').empty(); 

          posts.forEach(function(post) {
              var imageHtml = post.full_picture ? `<img src="${post.full_picture}" class="card-img-top" alt="Post image">` : '';
              var postContent = `
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
      }
  });
});