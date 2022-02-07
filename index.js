/** Core dependencies */
const http = require('http');


/** Third party dependencies */
const sticky = require('sticky-session');


const {
    socketIntializationWithExpress
} = require('./src/sockets');


/** Asynchronouse Application flow */
(async () => {
    /** Setting off Express Application Handling App */
    const app = require('./src/server');


    /** Application prerequisite startup functions & Config integration */
    const preReq = require('./src/config/preReq');    /** Application Statics */

    const appConfig = require('./src/config');

    await preReq(app, appConfig);

    // app.listen(appConfig.PORT, () => { });
    let server = http.createServer(app) 		// creating http server

    socketIntializationWithExpress(server);

    sticky.listen(server, port);

    server.on('listening', console.log('listening'));
})();