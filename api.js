const axios = require('axios');
const qs = require('qs');

const printError = (...args) => console.error('\n', ...args); // eslint-disable-line no-console

module.exports.fetchAllPosts = (options) => {
    if (!options.clientId || !options.clientSecret || !options.apiUrl) {
        printError('Plugin Configuration Missing: gatsby-source-ghost requires your adminUrl, clientId and clientSecret');
        process.exit(1);
    }

    if (options.apiUrl.substring(0, 4) !== 'http') {
        printError('Ghost apiUrl requires a protocol, E.g. https://<yourdomain>.ghost.io');
        process.exit(1);
    }

    if (options.apiUrl.substring(0, 8) !== 'https://') {
        printError('Ghost apiUrl should be served over HTTPS, are you sure you want:', options.apiUrl, '?');
    }

    const baseApiUrl = `${options.apiUrl}/ghost/api/v0.1`;
    const postApiOptions = {
        client_id: options.clientId,
        client_secret: options.clientSecret,
        include: 'authors,tags',
        filter: 'page:[true,false]',
        formats: 'plaintext,html',
        absolute_urls: true,
        limit: 'all'
    };
    const postsApiUrl = `${baseApiUrl}/posts/?${qs.stringify(postApiOptions)}`;

    return axios.get(postsApiUrl)
        .then(res => res.data.posts)
        .catch((err) => {
            printError('Error:', err);
            printError('Unable to fetch data from your Ghost API. Perhaps your credentials or apiUrl are incorrect?');
            process.exit(1);
        });
};
