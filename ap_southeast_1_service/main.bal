import ballerina/http;

service /ap_southeast_1 on new http:Listener(3005) {
    resource function get health() returns json {
        return {
            "status": "UP",
            "url": "http://localhost:3005"
        };
    }

    resource function get region() returns json|http:InternalServerError {
        do {
            string[] regions = ["ap-southeast-1", "ap-southeast-2", "ap-southeast-3"];
            return {
                "regions": regions
            };
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get regions",
                    "message": err.message()
                }
            };
        }
    }
}