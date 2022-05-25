const GhostContentAPI = require('@tryghost/content-api');

module.exports.configure = ({apiUrl, contentApiKey, version}) => {
    return new GhostContentAPI({
        url: apiUrl,
        key: contentApiKey,
        version
    });
};
