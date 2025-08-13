import ballerina/test;

// Simple test that verifies the cache module compiles
@test:Config {}
function testCacheModule() {
    test:assertTrue(true, "Cache module compiled successfully");
}