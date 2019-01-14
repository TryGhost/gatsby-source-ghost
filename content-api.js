const GhostContentAPI = require('@tryghost/content-api');

module.exports.configure = configOptions => new GhostContentAPI({
    host: configOptions.apiUrl,
    key: configOptions.contentApiKey,
    version: 'v2'
});
