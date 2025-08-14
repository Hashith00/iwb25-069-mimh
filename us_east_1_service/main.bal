import ballerina/http;

service /us_east_1 on new http:Listener(3001) {
    resource function get health() returns json {
        return {
            "status": "UP",
            "url": "http://localhost:3001"
        };
    }

    resource function get region() returns json|http:InternalServerError {
        do {
            string[] regions = ["us-east-1", "us-east-2", "us-east-3"];
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
