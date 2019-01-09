// Switch these lines once there are useful utils
// const testUtils = require('./utils');
require('./utils');
const proxyquire = require('proxyquire');
const sandbox = sinon.createSandbox();

describe('Basic Functionality ', function () {
    afterEach(() => {
        sandbox.restore();
    });

    it('Gatsby Node does roughly the right thing', function (done) {
        const createNode = sandbox.stub();

        // Pass in some fake data
        const browsePosts = sinon.stub().resolves([
            {slug: 'welcome-to-ghost', tags: [
                {slug: 'getting-started', id: '1'},
                {slug: 'hash-feature-img', id: '2'}
            ], authors: [
                {name: 'Ghost Writer', id: '1'},
                {name: 'Ghost Author', id: '2'}
            ]}
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
                navigation: [{label: 'Home', url: '/'}]
            }
        );
        const GhostContentApiStub = function () {
            return {
                posts: {browse: browsePosts},
                pages: {browse: browsePages},
                tags: {browse: browseTags},
                authors: {browse: browseAuthors},
                settings: {browse: browseSettings}
            };
        };

        const gatsbyNode = proxyquire('../gatsby-node', {'@tryghost/content-api': GhostContentApiStub});

        gatsbyNode
            .sourceNodes({boundActionCreators: {createNode}}, {})
            .then(() => {
                createNode.callCount.should.eql(7);

                const getArg = call => createNode.getCall(call).args[0];

                // Check that we get the right type of node created
                getArg(0).internal.should.have.property('type', 'GhostPost');
                getArg(1).internal.should.have.property('type', 'GhostPage');
                getArg(2).internal.should.have.property('type', 'GhostTag');
                getArg(3).internal.should.have.property('type', 'GhostTag');
                getArg(4).internal.should.have.property('type', 'GhostAuthor');
                getArg(5).internal.should.have.property('type', 'GhostAuthor');
                getArg(6).internal.should.have.property('type', 'GhostSettings');

                done();
            })
            .catch(done);
    });
});
