import ballerina/http;

// Define the structure of a region payload
type Region record {|
        string name;
        string? zip?;
|};

isolated service / on new http:Listener(3005) {
    private string[] regions = ["ap-southeast-1", "ap-southeast-2", "ap-southeast-3"];

    resource function get health() returns json {
        return {
            "status": "UP",
            "url": "http://localhost:3005"
        };
    }
    // GET all regions with do/on fail error handling
    resource function get region() returns json|http:InternalServerError {
        do {
            lock {
                return <json>{ "regions": "Respose from ap_south_2 service" };
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