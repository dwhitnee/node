//----------------------------------------------------------------------
// A user object.  Trying to figure out "exports"
//----------------------------------------------------------------------

//module.exports = AWS.User;

(function(global) {

   var AWS = require('../aws');

   module.exports = (function()
   {
     "use strict";

     //----------------------------------------
     // construct a User from cookie data
     //----------------------------------------
     function User( userInfo, encryptedCreds, masterKey ) {
       for (var attr in userInfo) {
         this[attr] = userInfo[attr];
       }

       var self = this;
       var decryptCallback = function( err, result ) {
        //  console.log("Got some creds! " + self.creds);
       };

       // this.creds = ring.decrypt( encryptedCreds, decryptCallback );
     }

     //----------------------------------------
     User.prototype = {

       decrypt: function() {  }
     },

     //----------------------------------------
     //  Private functions
     //----------------------------------------

     function _save( ) {
     };

     // factory to create user from auth cookies
     User.fromCookies = function( userInfoCookie, credCookie, masterKey ) {

       if (!credCookie) {
         throw "Not logged in, no credCookie: " + credCookie;
       }

       return new AWS.User(
         JSON.parse( decodeURIComponent( userInfoCookie )),
         decodeURIComponent( credCookie ),
         masterKey );
     };

     return User;
   })();

})(this);



