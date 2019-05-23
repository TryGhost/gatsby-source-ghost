const GhostContentAPI = require('@tryghost/content-api');

module.exports.configure = configOptions => new GhostContentAPI({
    url: configOptions.apiUrl,
    key: configOptions.contentApiKey,
    version: 'v2'
});
