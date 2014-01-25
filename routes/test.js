//----------------------------------------------------------------------
// Just playin'
//
// Getting stuff from cookies
//----------------------------------------------------------------------

(function(global){

   var testFoo = function(req, res) {

     if( req.method == 'POST' && req.is('application/json') ) {

       var queryData = '';
       // http://stackoverflow.com/questions/4295782/node-js-extracting-post-data/12022746#12022746

       function postOnData( data ) {
         queryData += data;
         if(queryData.length > 1e6) {
           queryData = '';
           res.send( 413 );   // Request entity too large
           req.connection.destroy();
         }
       };
       
       var key = req.params[0];

       function postOnEnd() {
         applyQuery( JSON.parse(queryData) );
       };

       if ( req.method == 'POST' && req.is('application/json') ) {
         req.on('data', postOnData );
         req.on('end', postOnEnd );
       } 


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

