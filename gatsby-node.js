const GhostContentAPI = require('@tryghost/content-api');
const _ = require('lodash');
const Promise = require('bluebird');
const {PostNode, PageNode, TagNode, AuthorNode} = require('./nodes');

exports.sourceNodes = ({boundActionCreators}, configOptions) => {
    const {createNode} = boundActionCreators;
    const api = new GhostContentAPI({
        host: configOptions.apiUrl,
        key: configOptions.contentApiKey,
        version: 'v2'
    });
    const fetchOptions = {
        limit: 'all',
        include: 'tags,authors',
        formats: 'html,plaintext'
    };

    const fetchPosts = api.posts.browse(fetchOptions).then((posts) => {
        posts.forEach((post) => {
            createNode(PostNode(post));
        });
    });

    const fetchPages = api.pages.browse(fetchOptions).then((pages) => {
        pages.forEach((page) => {
            createNode(PageNode(page));
        });
    });

    const fetchTags = api.tags.browse({
        limit: 'all',
        include: 'count.posts'
    }).then((tags) => {
        tags.forEach((tag) => {
            let postCount = tag.count.posts;
            tag.postCount = postCount;
            delete tag.count;
            createNode(TagNode(tag));
        });
    });

    const fetchAuthors = api.authors.browse({
        limit: 'all',
        include: 'count.posts'
    }).then((authors) => {
        authors.forEach((author) => {
            let postCount = author.count.posts;
            author.postCount = postCount;
            delete author.count;
            createNode(AuthorNode(author));
        });
    });

    return Promise.all([fetchPosts, fetchPages, fetchTags, fetchAuthors]);
};
