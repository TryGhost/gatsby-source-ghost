const testUtils = require('./utils');
const ContentAPI = require('../content-api');
const gatsbyNode = require('../gatsby-node');

describe('Basic Functionality', function () {
    beforeEach(function () {
        return sinon.replace(ContentAPI, 'configure', testUtils.MockContentAPI);
    });

    afterEach(function () {
        return sinon.restore();
    });

    it('Gatsby Node is able to create real nodes', function (done) {
        const createNode = sinon.stub();

        gatsbyNode
            .sourceNodes({actions: {createNode}}, {})
            .then(() => {
                createNode.callCount.should.eql(7);

                const getFirstArg = call => createNode.getCall(call).args[0];

                // Check Real Nodes are created
                getFirstArg(0).should.be.a.ValidGatsbyNode('GhostPost');
                getFirstArg(1).should.be.a.ValidGatsbyNode('GhostPage');
                getFirstArg(2).should.be.a.ValidGatsbyNode('GhostTag');
                getFirstArg(3).should.be.a.ValidGatsbyNode('GhostTag');
                getFirstArg(4).should.be.a.ValidGatsbyNode('GhostAuthor');
                getFirstArg(5).should.be.a.ValidGatsbyNode('GhostAuthor');
                getFirstArg(6).should.be.a.ValidGatsbyNode('GhostSettings');

                done();
            })
            .catch(done);
    });
});
