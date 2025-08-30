final map<string[]> countryRegions = {
    "United States": [
    "us-east-1",
    "us-west-2",
    "eu-west-1"
  ],
   "Canada": [
    "us-east-1",
    "us-west-2",
    "eu-west-1"
  ],
  "Sri Lanka": [
    "ap-south-1",
    "ap-south-2",
    "ap-southeast-1"
  ],
   "New Zealand": [
    "ap-southeast-2",
    "ap-southeast-1",
    "ap-northeast-1"
  ],
    "India": [
      "ap-south-1",
      "ap-south-2",
      "ap-southeast-1"
    ]
};

public function getRegions(string country) returns string[] {
    string[]? regions = countryRegions[country];
    if regions is string[] {
        return regions;
    }
    // Default fallback regions if country not found
    return ["us-east-1", "eu-west-1", "ap-southeast-1"];
}