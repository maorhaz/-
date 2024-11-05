$(document).ready(function() {
  
  const pageID = process.env.PAGE_ID; 
  const accessToken = process.env.ACCESS_TOKEN; 

  function postToFacebook(message) {
      if (!message) {
          alert('הכנס תוכן לפוסט'); 
          return;
      }
      
      $.ajax({
          url: `https://graph.facebook.com/${pageID}/feed?access_token=${accessToken}`,
          method: 'POST',
          data: {
              message: message
          },
          success: function(response) {
              console.log('הפוסט פורסם בהצלחה!', response);
              alert('הפוסט פורסם בהצלחה!'); 
              $('#postMessage').val(''); 
          },
          error: function(error) {
              console.log('שגיאה בפרסום הפוסט:', error);
              alert('שגיאה בפרסום הפוסט. אנא נסה שוב.'); 
          }
      });
  }
  $('#postButton').click(function() {
      var message = $('#postMessage').val(); 
      postToFacebook(message); 
  });

});
