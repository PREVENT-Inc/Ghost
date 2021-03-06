const debug = require('ghost-ignition').debug('web:api:default:app');
const express = require('express');
const urlUtils = require('../../services/url/utils');
const errorHandler = require('../shared/middlewares/error-handler');
const membersService = require('../../services/members');

const labs = require('../../services/labs');

module.exports = function setupApiApp() {
    debug('Parent API setup start');
    const apiApp = express();

    // Mount different API versions
    apiApp.use(urlUtils.getVersionPath({version: 'v0.1'}), require('./v0.1/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'v2', type: 'content'}), require('./v2/content/app')());
    apiApp.use(urlUtils.getVersionPath({version: 'v2', type: 'admin'}), require('./v2/admin/app')());
    if (labs.isSet('members')) {
        apiApp.use(urlUtils.getVersionPath({version: 'v2', type: 'members'}), membersService.api.apiRouter);
    }

    // Error handling for requests to non-existent API versions
    apiApp.use(errorHandler.resourceNotFound);
    apiApp.use(errorHandler.handleJSONResponse);

    debug('Parent API setup end');
    return apiApp;
};