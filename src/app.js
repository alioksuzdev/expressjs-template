const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const v1routes = require('./v1/routes');

const routeUtils = require('./v1/utils/routeUtils');

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const mountedV1Routes = routeUtils.mountRoutes(v1routes);

app.use('/api/v1', mountedV1Routes);

module.exports = app;
