const axios = require('axios');
const qs = require('qs');

const printError = (...args) => console.error('\n', ...args); // eslint-disable-line no-console

module.exports.fetchAllPosts = (options) => {
    if (!options.clientId || !options.clientSecret || !options.adminUrl) {
        printError('Plugin Configuration Missing: gatsby-source-ghost requires your adminUrl, clientId and clientSecret');
        process.exit(1);
    }

    const baseApiUrl = `https://${options.adminUrl}/ghost/api/v0.1`;
    const postApiOptions = {
        client_id: options.clientId,
        client_secret: options.clientSecret,
        include: 'authors,tags',
        filter: 'page:[true,false]',
        formats: 'plaintext,html',
        limit: 'all'
    };
    const postsApiUrl = `${baseApiUrl}/posts/?${qs.stringify(postApiOptions)}`;

    return axios.get(postsApiUrl)
        .then(res => res.data.posts)
        .catch((err) => {
            printError('Error:', err);
            printError('Unable to fetch data from your Ghost API. Perhaps your credentials or adminUrl are incorrect?');
            process.exit(1);
        });
};
