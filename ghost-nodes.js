const createNodeHelpers = require('gatsby-node-helpers').default;

const {createNodeFactory} = createNodeHelpers({
    typePrefix: 'Ghost'
});

const POST = 'Post';
const PAGE = 'Page';
const TAG = 'Tag';
const AUTHOR = 'Author';
const SETTINGS = 'Settings';
const TIERS = 'Tiers';

const PostNode = createNodeFactory(POST);
const PageNode = createNodeFactory(PAGE);
const TagNode = createNodeFactory(TAG);
const AuthorNode = createNodeFactory(AUTHOR);
const SettingsNode = createNodeFactory(SETTINGS);
const TiersNode = createNodeFactory(TIERS);

module.exports = {
    PostNode,
    PageNode,
    TagNode,
    AuthorNode,
    SettingsNode,
    TiersNode
};
