final map<string> serviceUrlMapping = {
    "us-east-1": "http://localhost:3001",
    "us-west-2": "http://localhost:3002",
    "eu-west-1": "http://localhost:3003",
    "eu-central-1": "http://localhost:3004",
    "ap-southeast-1": "http://localhost:3005",
    "ap-northeast-1": "http://localhost:3006",
    "ap-south-1": "http://localhost:3007",
    "ca-central-1": "http://localhost:3008",
    "ap-northeast-2": "http://localhost:3009",
    "ap-northeast-3": "http://localhost:3010",
    "ap-northeast-4": "http://localhost:3011",
    "ap-northeast-5": "http://localhost:3012",
    "ap-northeast-6": "http://localhost:3013",
    "ap-northeast-7": "http://localhost:3014",
    "ap-northeast-8": "http://localhost:3015"
};

public function getServiceUrl(string region) returns string {
    string? serviceUrl = serviceUrlMapping[region];
    if serviceUrl is string {
        return serviceUrl;
    }
    // Default fallback region if region not found
    return "http://localhost:3001";
}