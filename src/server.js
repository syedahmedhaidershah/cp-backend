/** Third party dependencies. */

const express = require('express');

const logger = require('morgan');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const compress = require('compression');

const methodOverride = require('method-override');

const cors = require('cors');


/** Local configuration exports & modules */
const routes = require('./routes');

const { API_BASE } = require('./config');


/** Local static objects */
const config = require('./config');


const app = express();


if (config.NODE_ENV === 'development') {
  app.use(logger('dev'));
}


// parse body params and attache them to req.body
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());


// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount all routes on /api path
app.use(API_BASE, routes);

module.exports = app;
