const GhostContentAPI = require('@tryghost/content-api');
const Promise = require('bluebird');
const {PostNode, PageNode, TagNode, AuthorNode, SettingsNode} = require('./nodes');

exports.sourceNodes = ({boundActionCreators}, configOptions) => {
    const {createNode} = boundActionCreators;
    const api = new GhostContentAPI({
        host: configOptions.apiUrl,
        key: configOptions.contentApiKey,
        version: 'v2'
    });

    const postAndPageFetchOptions = {
        limit: 'all',
        include: 'tags,authors',
        formats: 'html,plaintext'
    };

    const fetchPosts = api.posts.browse(postAndPageFetchOptions).then((posts) => {
        posts.forEach(post => createNode(PostNode(post)));
    });

    const fetchPages = api.pages.browse(postAndPageFetchOptions).then((pages) => {
        pages.forEach(page => createNode(PageNode(page)));
    });

    const tagAndAuthorFetchOptions = {
        limit: 'all',
        include: 'count.posts'
    };

    const fetchTags = api.tags.browse(tagAndAuthorFetchOptions).then((tags) => {
        tags.forEach((tag) => {
            tag.postCount = tag.count.posts;
            createNode(TagNode(tag));
        });
    });

    const fetchAuthors = api.authors.browse(tagAndAuthorFetchOptions).then((authors) => {
        authors.forEach((author) => {
            author.postCount = author.count.posts;
            createNode(AuthorNode(author));
        });
    });

    const fetchSettings = api.settings.browse().then(setting => createNode(SettingsNode(setting)));

    return Promise.all([fetchPosts, fetchPages, fetchTags, fetchAuthors, fetchSettings]);
};
