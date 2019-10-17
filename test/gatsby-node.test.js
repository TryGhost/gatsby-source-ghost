const testUtils = require('./utils');
const ContentAPI = require('../content-api');
const gatsbyNode = require('../gatsby-node');
const ghostSchema = require('../ghost-schema');

describe('Basic Functionality', function () {
    beforeEach(function () {
        return sinon.replace(ContentAPI, 'configure', testUtils.MockContentAPI);
    });

    afterEach(function () {
        return sinon.restore();
    });

    it('Gatsby Node is able to create fake and real nodes', function (done) {
        const createNode = sinon.stub();
        const deleteNode = sinon.stub();
        const emitter = {
            on: sinon.stub().callsArg(1),
            off: sinon.stub()
        };

        gatsbyNode
            .sourceNodes({actions: {createNode, deleteNode}, emitter}, {})
            .then(() => {
                createNode.callCount.should.eql(12);
                deleteNode.callCount.should.eql(5);

                const getFirstArg = call => createNode.getCall(call).args[0];

                // Check Fake Nodes against schema
                getFirstArg(0).should.be.a.ValidGatsbyNode('GhostPost', ghostSchema.post);
                getFirstArg(1).should.be.a.ValidGatsbyNode('GhostPage', ghostSchema.page);
                getFirstArg(2).should.be.a.ValidGatsbyNode('GhostTag', ghostSchema.tag);
                getFirstArg(3).should.be.a.ValidGatsbyNode('GhostAuthor', ghostSchema.author);
                getFirstArg(4).should.be.a.ValidGatsbyNode('GhostSettings', ghostSchema.settings);

                // Check Real Nodes are created
                getFirstArg(5).should.be.a.ValidGatsbyNode('GhostPost');
                getFirstArg(6).should.be.a.ValidGatsbyNode('GhostPage');
                getFirstArg(7).should.be.a.ValidGatsbyNode('GhostTag');
                getFirstArg(8).should.be.a.ValidGatsbyNode('GhostTag');
                getFirstArg(9).should.be.a.ValidGatsbyNode('GhostAuthor');
                getFirstArg(10).should.be.a.ValidGatsbyNode('GhostAuthor');
                getFirstArg(11).should.be.a.ValidGatsbyNode('GhostSettings');

                done();
            })
            .catch(done);
    });
});
