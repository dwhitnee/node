//----------------------------------------------------------------------
// Just playin'
//
// Getting stuff from cookies
//----------------------------------------------------------------------

(function(global){

   var testFoo = function(req, res){

     var key = req.params[0];

     try {
       var out = [];

       out.push("No cookies?  Go to login", "");

       var qs = require('querystring');
       var cookies = qs.parse( req.headers['cookie'], '; ' );


       var AWS = require('../lib/aws');
       console.log("Boo! " + JSON.stringify( AWS ));

       AWS.User = require('../lib/aws/user');

       res.send( out.join("<br/>") );
     }
     catch(e) {
       console.log( ['ERROR',e] );
     }
   };

   module.exports = function( app ) {
     app.all('/foo/test', testFoo);
   };

})(this);

