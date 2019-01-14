/**
 * Custom Should Assertions
 *
 * Add any custom assertions to this file.
 */

should.Assertion.add('ValidGatsbyNode', function (type, schema) {
    this.params = {operator: 'to be a valid Gatsby Node'};

    // All Gatsby Nodes look like this...
    this.obj.should.be.an.Object().with.properties(['id', 'parent', 'children', 'internal']);
    this.obj.internal.should.be.an.Object().with.properties(['type', 'contentDigest']);

    // Assert our type
    this.obj.internal.type.should.eql(type);

    if (schema) {
        Object.keys(schema).forEach((key) => {
            // Gatsby overwrites the ID
            if (key === 'id') {
                return;
            }
            this.obj.should.have.property(key, schema[key]);
        });
    }
});
