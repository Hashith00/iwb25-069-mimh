import ballerina/test;

// Simple test that verifies the module compiles  
@test:Config {}
function testUtilsModule() {
    test:assertTrue(true, "Utils module compiled successfully");
}