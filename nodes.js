const createNodeHelpers = require('gatsby-node-helpers').default;

const {
    createNodeFactory
} = createNodeHelpers({
    typePrefix: 'Ghost'
});

const POST = 'Post';
const PAGE = 'Page';
const TAG = 'Tag';
const AUTHOR = 'Author';

module.exports.PostNode = createNodeFactory(POST);
module.exports.PageNode = createNodeFactory(PAGE);
module.exports.TagNode = createNodeFactory(TAG);
module.exports.AuthorNode = createNodeFactory(AUTHOR);
