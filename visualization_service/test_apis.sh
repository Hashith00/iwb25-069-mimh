#!/bin/bash

echo "Testing Phase 1 Dashboard APIs"
echo "================================"

BASE_URL="http://localhost:8082/api"

# Function to test an endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    echo "$name"
    echo "URL: $url"
    
    response=$(curl -s -w "\n%{http_code}" "$url")
    http_code=$(echo "$response" | tail -n 1)
    json_response=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        echo "✅ SUCCESS (HTTP $http_code)"
        echo "Response: $json_response"
    else
        echo "❌ FAILED (HTTP $http_code)"
        echo "Response: $json_response"
    fi
    echo "----------------------------------------"
}

# Test Phase 1 endpoints
echo "🚀 PHASE 1 - Core Dashboard APIs"
echo "================================"
test_endpoint "1. Dashboard Metrics" "$BASE_URL/dashboard/metrics"
test_endpoint "2. Regions" "$BASE_URL/regions"
test_endpoint "3. System Status" "$BASE_URL/system/status"
test_endpoint "4. Optimal Regions (default IP)" "$BASE_URL/optimal-regions"
test_endpoint "5. Optimal Regions (Sri Lanka IP)" "$BASE_URL/optimal-regions?ip=123.231.120.186"
test_endpoint "6. Optimal Regions (US IP)" "$BASE_URL/optimal-regions?ip=192.168.1.100"

echo ""
echo "🌟 PHASE 2 - Enhanced Features APIs"
echo "==================================="
test_endpoint "7. Carbon Intensity Global" "$BASE_URL/carbon-intensity/global"
test_endpoint "8. Cache Stats" "$BASE_URL/cache/stats"
test_endpoint "9. Environmental Impact" "$BASE_URL/environmental/impact"

echo ""
echo "📋 ORIGINAL ENDPOINTS"
echo "===================="
test_endpoint "10. API Info" "$BASE_URL/info"
test_endpoint "11. Health Check" "$BASE_URL/health"

echo "Testing complete!"
echo ""
echo "If you want pretty JSON formatting, install jq:"
echo "  brew install jq  # on macOS"
echo "  sudo apt install jq  # on Ubuntu"
echo ""
echo "Then you can test individual endpoints like:"
echo "  curl -s $BASE_URL/dashboard/metrics | jq '.'"