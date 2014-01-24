(function(global){

   var express = require('express'),
          http = require('http'),
         https = require('https'),
          path = require('path'),
            fs = require('fs'),
          app,
          routes,
          conf = {
              port: 4000,
              sport: 4001,
              static_files: 'webapp'
          },
   startServer;

   startServer = function(){
     app = express();
     routes = require('./routes/test')(app);
     app.configure(
       function() {
         app.set('port', conf.port );
         app.use( express.cookieParser() );
         app.use( express.favicon() );
         app.use( express.logger('dev') );
         app.use( express.bodyParser() );
         app.use( express.methodOverride() );
         app.use( app.router);
         app.use( express.static( 
                    path.join( __dirname, conf.static_files )));
       });

     app.configure('development', function(){
                     app.use( express.errorHandler() );
                   });

     // https
     // var certs = {
     //   key: fs.readFileSync('cert/key.pem'),
     //   cert: fs.readFileSync('cert/cert.pem')
     // };

     https.createServer(app).listen(
       conf.port,
       function() {
         console.log("Node server listening on port " + conf.port );
       }
     );

   };

   try {
     startServer();
   }
   catch (ex) {
     console.log("D'oh!: " + ex );
   }

})(this);
