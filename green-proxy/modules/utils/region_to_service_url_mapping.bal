final map<string> serviceUrlMapping = {
    "us-east-1": "http://localhost:3001",
    "us-west-2": "http://localhost:3002",
    "ap-southeast-1": "http://localhost:3004",
    "ap-south-1": "http://localhost:3006",
    "ap-south-2": "http://localhost:3005"
};

public function getServiceUrl(string region) returns string {
    string? serviceUrl = serviceUrlMapping[region];
    if serviceUrl is string {
        return serviceUrl;
    }
    // Default fallback region if region not found
    return "http://localhost:3001";
}