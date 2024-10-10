$(document).ready(function() {
  
    var pageID = '605112776347746';
    var accessToken = 'EAAGgmZAiYiEoBOyeor5V6MlPkZBDX9NylpOT5fKPktnZCiyQOOjaK4GGSbZBO3RnbPwvp1iDghmnSbS0GcMZAlGSRGFvZC2js6eeEaY9sTycjdklRMv4ZCczcwGfCmLj25uEGblfYs6fhqNZA2VRXWn7TTa1v0idWBMd3zwsrHMMAhH2fYmSwOqtaObE2eO7Kh9o41j3n3kXVKQ0Xf44KODNv2ZB3';
  
    // ---  פונקציה לשליחת פוסט  ---
    function postToFacebook(message) {
      $.ajax({
        url: `https://graph.facebook.com/${pageID}/feed?access_token=${accessToken}`,
        method: 'POST',
        data: {
          message: message
        },
        success: function(response) {
          console.log('הפוסט פורסם בהצלחה!', response);
          // כאן אפשר להוסיף קוד שמציג הודעה למשתמש שהפוסט פורסם
        },
        error: function(error) {
          console.log('שגיאה בפרסום הפוסט:', error);
          // כאן אפשר להוסיף קוד שמציג הודעה למשתמש על השגיאה
        }
      });
    }
  
    // ---  קוד להפעלת הפונקציה  ---
  
    // דוגמה: שליחת פוסט כשלוחצים על כפתור
    $('#postButton').click(function() {
      var message = $('#postMessage').val(); // קבלת הטקסט משדה קלט
      postToFacebook(message);
    });


// HTML :
    // <h3>פרסם פוסט חדש</h3> 
    // <div class="input-group mb-3">
    //   <input type="text" id="postMessage" class="form-control" placeholder="הקלד את הפוסט שלך כאן">
    //   <button class="btn btn-primary" type="button" id="postButton">פרסם</button>
    // </div>