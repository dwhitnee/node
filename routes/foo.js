(function(global){

    var nodeAWS = require('aws-sdk'),
        AWSOM = require('../lib/awsom'),
        serviceRPC,
        translations = AWSOM.config.serviceNameTranslations,
        translateServiceName;

    translateServiceName = function( servicename ){
        var n = servicename.toLowerCase();
        if( translations.hasOwnProperty(n) ){
            return translations[n];
        }
        return servicename;
    };
 
    //nodeAWS.config.loadFromPath('./credentials.json');
    nodeAWS.config.update(AWSOM.config.credentials.primary);
    
    serviceRPC = function serviceRPC(req, res){
        var applyQuery,
            postOnData,
            postOnEnd,
            queryData;

        applyQuery = function serviceRPC_applyQuery( queryObj ){
            var serviceName = req.params.service,
                service,
                services = {},
                serviceCB,
                method = req.params.method,
                regionParam = req.params.region,
                translatedServiceName = translateServiceName(serviceName).toLowerCase(),
                regionClone = ( AWSOM.config.regions.hasOwnProperty('services') && AWSOM.config.regions.services.hasOwnProperty(translatedServiceName) ) 
                                ? AWSOM.config.regions.services[translatedServiceName].join('|').split('|') 
                                : AWSOM.config.regionsDefault.join('|').split('|'),
                respObj = {},
                i, // iterator
                l; //length

            if( regionParam && regionClone.indexOf(regionParam) > -1 ){
                regionClone = [regionParam];
            }
            
            serviceCB = function serviceRPC_applyQuery_serviceCB(err, data){
                var region = this.request.httpRequest.region,
                    regionIndex = regionClone.indexOf(region);
                if (err) {
                    respObj[region] = {
                        error:err
                    };
                } else {
                    if( data.hasOwnProperty('Body') && data.Body instanceof Buffer ){
                        data.Body = data.Body.toString('base64');
                    }
                    respObj[region] = data;
                }
                regionClone.splice( regionIndex, 1 );
                if( regionClone.length === 0){
                    res.type('application/json');
                    res.send( JSON.stringify( respObj, null, '\t' ) );
                    services = null;
                }
            };

            for (i=0,l=regionClone.length;i<l;i++){
                services[ regionClone[i] ] = new nodeAWS[serviceName]({
                    region: regionClone[i]
                });
                services[ regionClone[i] ].client[method]( queryObj, serviceCB );
            }
        };

        if( req.method == 'POST' && req.is('application/json') ) {
            queryData = '';
            /**
             * http://stackoverflow.com/questions/4295782/node-js-extracting-post-data/12022746#12022746
             */
            postOnData = function serviceRPC_postOnData( data ){
                queryData += data;
                if(queryData.length > 1e6) {
                    queryData = '';
                    res.send(413); // Request entity too large
                    req.connection.destroy();
                }
            };
            postOnEnd = function serviceRPC_postOnEnd(){
                applyQuery( JSON.parse(queryData) );
            };
            req.on( 'data', postOnData );
            req.on( 'end', postOnEnd );
        }else{
            // TODO: apply restrictions to non POST requests.
            applyQuery( req.query );
        }
    };

    module.exports = function serviceRPC_module_exports(app){
        app.all('/AWS/:service/:method/:region?', serviceRPC);
    };

})(this);
