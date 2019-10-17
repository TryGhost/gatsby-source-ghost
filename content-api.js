const GhostContentAPI = require('@tryghost/content-api');

module.exports.configure = ({apiUrl, contentApiKey, version = `v3`}) => {
    return new GhostContentAPI({
        url: apiUrl,
        key: contentApiKey,
        version: version
    });
};
