/**
 * A fake version of the Content API
 * @TODO: consider extending this and moving it to the Content API lib
 */

const browsePosts = sinon.stub().resolves([
    {
        slug: 'welcome-to-ghost',
        /* Adding this line simulates https://github.com/TryGhost/gatsby-source-ghost/issues/17 */
        codeinjection_foot: '<style></style>',
        tags: [
            {slug: 'getting-started', id: '1'},
            {slug: 'hash-feature-img', id: '2'}
        ],
        authors: [
            {name: 'Ghost Writer', id: '1'},
            {name: 'Ghost Author', id: '2'}
        ]
    }
]);
const browsePages = sinon.stub().resolves([
    {slug: 'about'}
]);
const browseTags = sinon.stub().resolves([
    {slug: 'getting-started', id: '1', count: {posts: 1}},
    {slug: 'hash-feature-img', id: '2', count: {posts: 1}}
]);
const browseAuthors = sinon.stub().resolves([
    {name: 'Ghost Writer', id: '1', count: {posts: 1}},
    {name: 'Ghost Author', id: '2', count: {posts: 1}}
]);
const browseSettings = sinon.stub().resolves(
    {
        title: 'Ghost & Gatsby',
        description: 'Thoughts, stories and ideas.',
        navigation: [{label: 'Home', url: '/'}],
        codeinjection_head: '<style></style>',
        codeinjection_foot: '<style><style>'
    }
);
const MockContentAPI = function () {
    return {
        posts: {browse: browsePosts},
        pages: {browse: browsePages},
        tags: {browse: browseTags},
        authors: {browse: browseAuthors},
        settings: {browse: browseSettings}
    };
};

module.exports = MockContentAPI;
