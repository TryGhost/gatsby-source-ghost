const GhostAPI = require('./api');
const _ = require('lodash');
const {PostNode, PageNode, TagNode, AuthorNode} = require('./nodes');

const getPostsCountPerTag = function getPostsCountPerTag(posts) {
    let allTags = [];

    // Get all possible tags that are being used
    posts.forEach(post => allTags.push(post.tags));
    allTags = _.flatten(allTags);
    allTags = _.transform(_.uniqBy(allTags, tag => tag.id), (result, tag) => {
        (result[tag.slug] || (result[tag.slug] = []));
    }, []);

    // collect all post slugs per tag
    posts.forEach((post) => {
        post.tags.forEach((tag) => {
            allTags[tag.slug].push(post.slug);
        });
    });

    return allTags;
};

exports.sourceNodes = ({boundActionCreators}, configOptions) => {
    const {createNode} = boundActionCreators;

    return GhostAPI
        .fetchAllPosts(configOptions)
        .then((posts) => {
            const tagPostCount = getPostsCountPerTag(posts);

            posts.forEach((post) => {
                if (post.page) {
                    createNode(PageNode(post));
                } else {
                    createNode(PostNode(post));
                }

                if (post.tags) {
                    post.tags.forEach((tag) => {
                        // find the number of posts that have this tag
                        tag.postCount = tagPostCount[tag.slug].length;

                        createNode(TagNode(tag));
                    });
                }

                if (post.authors) {
                    post.authors.forEach((author) => {
                        createNode(AuthorNode(author));
                    });
                }
            });
        });
};
