import ballerina/http;

// Define the structure of a region payload
type Region record {|
    string name;
|};



isolated service /eu_central_1 on new http:Listener(3004) {

    // In-memory region list
    private string[] regions = [
        "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3",
        "eu-west-4", "eu-west-5", "eu-west-6", "eu-west-7",
        "eu-west-8", "eu-west-9", "eu-west-10"
    ];


    resource function get health() returns json {
        return {
            "status": "UP",
            "url": "http://localhost:3004"
        };
    }

    // GET all regions with do/on fail error handling
    resource function get region() returns json|http:InternalServerError {
        do {
            lock {
                return { "regions": <json>self.regions.cloneReadOnly() };
            }
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get regions",
                    "message": err.message()
                }
            };
        }
    }

    // POST: Add a new region
    resource function post region(@http:Payload Region payload) returns json|http:InternalServerError|http:BadRequest {
        do {
            lock {
                if self.regions.indexOf(payload.name) != -1 {
                    return <http:BadRequest>{
                        body: { "error": "Region already exists" }
                    };
                }
                self.regions.push(payload.name);
                return { "message": "Region added successfully", "region": payload.name };
            }
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to add region",
                    "message": err.message()
                }
            };
        }
    }

    // PUT: Update a region by index
    resource function put region/[int index](@http:Payload Region payload) returns json|http:InternalServerError|http:BadRequest {
        do {
            lock {
                if index < 0 || index >= self.regions.length() {
                    return <http:BadRequest>{
                        body: { "error": "Invalid index" }
                    };
                }
                if self.regions.indexOf(payload.name) != -1 && self.regions[index] != payload.name {
                    return <http:BadRequest>{
                        body: { "error": "Another region with the same name already exists" }
                    };
                }
                string oldName = self.regions[index];
                self.regions[index] = payload.name;
                return { "message": "Region updated successfully", "old": oldName, "new": payload.name };
            }
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to update region",
                    "message": err.message()
                }
            };
        }
    }

    // DELETE: Remove a region by index
    resource function delete region/[int index]() returns json|http:InternalServerError|http:BadRequest {
        do {
            lock {
                if index < 0 || index >= self.regions.length() {
                    return <http:BadRequest>{
                        body: { "error": "Invalid index" }
                    };
                }
                string removed = self.regions[index];
                self.regions = [...self.regions.slice(0, index), ...self.regions.slice(index + 1)];
                return { "message": "Region deleted successfully", "removed": removed };
            }
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to delete region",
                    "message": err.message()
                }
            };
        }
    }
}

