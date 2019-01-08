const GhostContentAPI = require('@tryghost/content-api');
const _ = require('lodash');
const Promise = require('bluebird');
const {PostNode, PageNode, TagNode, AuthorNode} = require('./nodes');

const getPostCount = function getPostCount(posts, taxonomy) {
    let allTaxonomies = [];

    // Get all possible taxonomies that are being used and
    // create a usable array
    posts.forEach(post => allTaxonomies.push(post[taxonomy] || []));
    allTaxonomies = _.flatten(allTaxonomies);
    allTaxonomies = _.transform(_.uniqBy(allTaxonomies, item => item.id), (result, item) => {
        (result[item.slug] || (result[item.slug] = 0));
    }, {});

    // Now collect all post slugs per taxonomy
    posts.forEach((post) => {
        if (post[taxonomy] && post[taxonomy].length) {
            post[taxonomy].forEach((item) => {
                allTaxonomies[item.slug] += 1;
            });
        }
    });

    return allTaxonomies;
};

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
        return posts;
    });

    const fetchPages = api.pages.browse(fetchOptions).then((pages) => {
        pages.forEach((page) => {
            createNode(PageNode(page));
        });
        return pages;
    });

    return Promise.all([fetchPosts, fetchPages]).then(([posts, pages]) => {
        const allPostsAndPages = [...posts, ...pages];
        const tagPostCount = getPostCount(allPostsAndPages, 'tags');
        const authorPostCount = getPostCount(allPostsAndPages, 'authors');

        const createTagNode = (tag) => {
            // find the number of posts that have this tag
            tag.postCount = tagPostCount[tag.slug] || 0;
            createNode(TagNode(tag));
        };

        const createAuthorNode = (author) => {
            // find the number of posts that include this author
            author.postCount = authorPostCount[author.slug] || 0;
            createNode(AuthorNode(author));
        };

        allPostsAndPages.forEach((postOrPage) => {
            (postOrPage.tags || []).forEach(createTagNode);
            (postOrPage.authors || []).forEach(createAuthorNode);
        });
    });
};
