const GhostAPI = require('./api');
const PostNode = require('./nodes').PostNode;
const PageNode = require('./nodes').PageNode;
const TagNode = require('./nodes').TagNode;
const AuthorNode = require('./nodes').AuthorNode;

exports.sourceNodes = async ({ boundActionCreators, createNodeId }, configOptions) => {
    const { createNode } = boundActionCreators;

    let posts = await GhostAPI.fetchAllPosts(configOptions);
    let tags = {};
    let authors = {};

    posts.forEach(post => {
        if (post.page) {
            createNode(PageNode(post));
        } else {
            createNode(PostNode(post));
        }

        if (post.tags) {
            post.tags.forEach(tag => {
                createNode(TagNode(tag));
            });
        }

        if (post.authors) {
            post.authors.forEach(author => {
                createNode(AuthorNode(author));
            });
        }
    });
};
