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
const browseTiers = sinon.stub().resolves([
    {
        slug: 'gold-tier',
        name: 'Gold Tier',
        active: true,
        type: 'paid',
        welcome_page_url: '/welcome-to-gold',
        created_at: '2022-03-15T18:15:36.000Z',
        updated_at: '2022-03-15T18:16:00.000Z',
        stripe_prices: 'p_029309820394',
        monthly_price: 5,
        yearly_price: 50,
        benefits: ['Get a newsletter', 'Access all posts'],
        visibility: 'public'
    }
]);
const MockContentAPI = function () {
    return {
        posts: {browse: browsePosts},
        pages: {browse: browsePages},
        tags: {browse: browseTags},
        authors: {browse: browseAuthors},
        settings: {browse: browseSettings},
        tiers: {browse: browseTiers}
    };
};

module.exports = MockContentAPI;
