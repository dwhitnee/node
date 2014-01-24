//----------------------------------------------------------------------
//  Root level object for, mmm, stuff.
//----------------------------------------------------------------------

(function(global){

   var AWS = { foo: 6 };

   module.exports = AWS;

   // AWS.User = require('./aws/user');

   // This is NOT the same as module.exports = AWS;
   // return AWS;

})(this);
