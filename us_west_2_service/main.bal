import ballerina/http;

service /us_west_2 on new http:Listener(3002) {
    resource function get health() returns json {
        return {
            "status": "UP",
            "url": "http://localhost:3002"
        };
    }

    resource function get region() returns json|http:InternalServerError {
        do {
            string[] regions = ["us-west-2", "us-west-3", "us-west-4"];
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