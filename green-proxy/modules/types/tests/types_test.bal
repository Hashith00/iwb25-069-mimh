import ballerina/test;

// Simple test that verifies the module compiles
@test:Config {}
function testTypesModule() {
    test:assertTrue(true, "Types module compiled successfully");
}