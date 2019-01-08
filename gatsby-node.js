const GhostAPI = require('./api');
const _ = require('lodash');
const {PostNode, PageNode, TagNode, AuthorNode} = require('./nodes');

const getPostsPerTaxonomie = function getPostsPerTaxonomie(posts, taxonomie) {
    let allTaxonomies = [];

    // Get all possible taxonimies that are being used and
    // create a usable array
    posts.forEach(post => allTaxonomies.push(post[taxonomie]));
    allTaxonomies = _.flatten(allTaxonomies);
    allTaxonomies = _.transform(_.uniqBy(allTaxonomies, item => item.id), (result, item) => {
        (result[item.slug] || (result[item.slug] = 0));
    }, {});

    // Now collect all post slugs per taxonomie
    posts.forEach((post) => {
        post[taxonomie].forEach((item) => {
            allTaxonomies[item.slug] += 1;
        });
    });

    return allTaxonomies;
};

exports.sourceNodes = ({boundActionCreators}, configOptions) => {
    const {createNode} = boundActionCreators;

    return GhostAPI
        .fetchAllPosts(configOptions)
        .then((posts) => {
            const tagPostCount = getPostsPerTaxonomie(posts, 'tags');
            const authorPostCount = getPostsPerTaxonomie(posts, 'authors');

            posts.forEach((post) => {
                if (post.page) {
                    createNode(PageNode(post));
                } else {
                    createNode(PostNode(post));
                }

                if (post.tags) {
                    post.tags.forEach((tag) => {
                        // find the number of posts that have this tag
                        tag.postCount = tagPostCount[tag.slug] || 0;

                        createNode(TagNode(tag));
                    });
                }

                if (post.authors) {
                    post.authors.forEach((author) => {
                        // find the number of posts that include this author
                        author.postCount = authorPostCount[author.slug] || 0;

                        createNode(AuthorNode(author));
                    });
                }
            });
        });
};
