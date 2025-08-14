import ballerina/http;

service /eu_central_1 on new http:Listener(3004) {
    resource function get health() returns json {
        return {
            "status": "UP",
            "url": "http://localhost:3004"
        };
    }

    resource function get region() returns json|http:InternalServerError {
        do {
            string[] regions = ["eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-west-4", "eu-west-5", "eu-west-6", "eu-west-7", "eu-west-8", "eu-west-9", "eu-west-10"];
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

