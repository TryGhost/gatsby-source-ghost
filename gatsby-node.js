/****
 * gatsby-node.js
 *
 * Generate Gatsby nodes based on a custom schema derived from the Ghost V3 API spec.
 *
 * This source plugin will source and generate Posts, Pages, Tags, Authors and Settings.
 *
 * https://ghost.org/docs/api/v3/
 */

const Promise = require('bluebird');
const ContentAPI = require('./content-api');
const {
    PostNode,
    PageNode,
    TagNode,
    AuthorNode,
    SettingsNode
} = require('./ghost-nodes');
const _ = require(`lodash`);
const cheerio = require(`cheerio`);

/**
 * Import all custom ghost types.
 */
const ghostTypes = require('./ghost-schema');

/**
 * Extract specific tags from html and return them in a new object.
 *
 * Only style tags are extracted at present.
 */
const parseCodeinjection = (html) => {
    let $ = null;

    /**
     * Attempt to load the HTML into cheerio. Do not escape the HTML.
     */
    try {
        $ = cheerio.load(html, {decodeEntities: false});
    } catch (e) {
        return {};
    }

    /**
     * Extract all style tags from the markup.
     */
    const $parsedStyles = $(`style`);
    const codeInjObj = {};

    /**
     * For each extracted tag, add or append the tag's HTML to the new object.
     */
    $parsedStyles.each((i, style) => {
        if (i === 0) {
            codeInjObj.styles = $(style).html();
        } else {
            codeInjObj.styles += $(style).html();
        }
    });

    return codeInjObj;
};

/**
 * Extracts specific tags from the code injection header and footer and
 * transforms posts to include extracted tags as a new key and value in the post object.
 *
 * Only the `codeinjection_styles` key is added at present.
 */
const transformCodeinjection = (posts) => {
    posts.map((post) => {
        const allCodeinjections = [
            post.codeinjection_head,
            post.codeinjection_foot
        ].join('');

        if (!allCodeinjections) {
            return post;
        }

        const headInjection = parseCodeinjection(allCodeinjections);

        if (_.isEmpty(post.codeinjection_styles)) {
            post.codeinjection_styles = headInjection.styles;
        } else {
            post.codeinjection_styles += headInjection.styles;
        }

        return post;
    });

    return posts;
};

/**
 * Create Live Ghost Nodes
 * Uses the Ghost Content API to fetch all posts, pages, tags, authors and settings
 * Creates nodes for each record, so that they are all available to Gatsby
 */
exports.sourceNodes = ({actions}, configOptions) => {
    const {createNode} = actions;

    const api = ContentAPI.configure(configOptions);

    const ignoreNotFoundElseRethrow = (err) => {
        if (err && err.response && err.response.status !== 404) {
            throw err;
        }
    };

    const postAndPageFetchOptions = {
        limit: 'all',
        include: 'tags,authors',
        formats: 'html,plaintext'
    };

    const fetchPosts = api.posts
        .browse(postAndPageFetchOptions)
        .then((posts) => {
            posts = transformCodeinjection(posts);
            posts.forEach(post => createNode(PostNode(post)));
        }).catch(ignoreNotFoundElseRethrow);

    const fetchPages = api.pages
        .browse(postAndPageFetchOptions)
        .then((pages) => {
            pages.forEach(page => createNode(PageNode(page)));
        }).catch(ignoreNotFoundElseRethrow);

    const tagAndAuthorFetchOptions = {
        limit: 'all',
        include: 'count.posts'
    };

    const fetchTags = api.tags
        .browse(tagAndAuthorFetchOptions)
        .then((tags) => {
            tags.forEach((tag) => {
                tag.postCount = tag.count.posts;
                createNode(TagNode(tag));
            });
        }).catch(ignoreNotFoundElseRethrow);

    const fetchAuthors = api.authors
        .browse(tagAndAuthorFetchOptions)
        .then((authors) => {
            authors.forEach((author) => {
                author.postCount = author.count.posts;
                createNode(AuthorNode(author));
            });
        }).catch(ignoreNotFoundElseRethrow);

    const fetchSettings = api.settings.browse().then((setting) => {
        /**
         * Assert the presence of any code injections, from both the use and ghost.
         */
        const codeinjectionHead =
            setting.codeinjection_head || setting.ghost_head;
        const codeinjectionFoot =
            setting.codeinjection_foot || setting.ghost_foot;
        const allCodeinjections = codeinjectionHead
            ? codeinjectionHead.concat(codeinjectionFoot)
            : codeinjectionFoot
                ? codeinjectionFoot
                : null;

        /**
         * If there are any code injections, extract style tags from the markup and
         * transform the setting object to include the `codeinjection_styles` key with the value of those style tags.
         */
        if (allCodeinjections) {
            const parsedCodeinjections = parseCodeinjection(allCodeinjections);

            if (_.isEmpty(setting.codeinjection_styles)) {
                setting.codeinjection_styles = parsedCodeinjections.styles;
            } else {
                setting.codeinjection_styles += parsedCodeinjections.styles;
            }
        }

        /**
         * Ensure always non-null by setting `codeinjection_styles` to
         * an empty string instead of null.
         */
        setting.codeinjection_styles = _.isNil(setting.codeinjection_styles)
            ? ''
            : setting.codeinjection_styles;

        // The settings object doesn't have an id, prevent Gatsby from getting 'undefined'
        setting.id = 1;
        createNode(SettingsNode(setting));
    }).catch(ignoreNotFoundElseRethrow);

    return Promise.all([
        fetchPosts,
        fetchPages,
        fetchTags,
        fetchAuthors,
        fetchSettings
    ]);
};

/**
 * Creates custom types based on the Ghost V3 API.
 *
 * This creates a fully custom schema, removing the need for dummy content or fake nodes.
 */
exports.createSchemaCustomization = ({actions}) => {
    const {createTypes} = actions;
    createTypes(ghostTypes);
};
