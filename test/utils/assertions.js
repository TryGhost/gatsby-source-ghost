/**
 * Custom Should Assertions
 *
 * Add any custom assertions to this file.
 */

should.Assertion.add('ValidGatsbyNode', function (type) {
    this.params = {operator: 'to be a valid Gatsby Node'};

    // All Gatsby Nodes look like this...
    this.obj.should.be.an.Object().with.properties(['id', 'parent', 'children', 'internal']);
    this.obj.internal.should.be.an.Object().with.properties(['type', 'contentDigest']);

    // Assert our type
    this.obj.internal.type.should.eql(type);
});
