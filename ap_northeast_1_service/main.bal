import ballerina/http;

service /ap_northeast_1 on new http:Listener(3006) {
    resource function get health() returns json {
        return {
            "status": "UP",
            "url": "http://localhost:3006"
        };
    }

    resource function get region() returns json|http:InternalServerError {
        do {
            string[] regions = ["ap-northeast-1", "ap-northeast-2", "ap-northeast-3"];
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