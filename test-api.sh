#!/bin/bash

# Modern-Day De Britto API Test Suite
# Production URL: https://persona-agent.tarroto.workers.dev

PROD_URL="https://persona-agent.tarroto.workers.dev"
LOCAL_URL="http://localhost:8787"

# Use production by default, or local if specified
URL=${1:-$PROD_URL}

echo "🧪 Testing Modern-Day De Britto API"
echo "📍 URL: $URL"
echo "=================================="
echo ""

# Test 1: Health Check
echo "✅ Test 1: Health Check"
echo "curl $URL"
curl -s "$URL" | jq .
echo ""
echo ""

# Test 2: Simple Chat
echo "✅ Test 2: Simple Chat - Siapa Anda?"
echo "curl -X POST $URL -H 'Content-Type: application/json' -d '{\"mode\":\"chat\",\"message\":\"Siapa Anda?\"}'"
curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Siapa Anda?"}' | jq .
echo ""
echo ""

# Test 3: Self-Awareness Test
echo "✅ Test 3: Self-Awareness - Apakah Anda manusia asli?"
echo "curl -X POST $URL -H 'Content-Type: application/json' -d '{\"mode\":\"chat\",\"message\":\"Apakah Anda manusia asli atau AI?\"}'"
curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Apakah Anda manusia asli atau AI?"}' | jq .
echo ""
echo ""

# Test 4: Historical Question
echo "✅ Test 4: Historical Question - Misi di India"
echo "curl -X POST $URL -H 'Content-Type: application/json' -d '{\"mode\":\"chat\",\"message\":\"Ceritakan tentang misi Anda di India\"}'"
curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Ceritakan tentang misi Anda di India"}' | jq .
echo ""
echo ""

# Test 5: Values Question
echo "✅ Test 5: Values - Nilai-nilai penting"
echo "curl -X POST $URL -H 'Content-Type: application/json' -d '{\"mode\":\"chat\",\"message\":\"Apa nilai-nilai yang paling penting bagi Anda?\"}'"
curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Apa nilai-nilai yang paling penting bagi Anda?"}' | jq .
echo ""
echo ""

# Test 6: Choice Mode - Ethical Dilemma
echo "✅ Test 6: Choice Mode - Ethical Dilemma"
echo "curl -X POST $URL -H 'Content-Type: application/json' -d '{\"mode\":\"choice\",\"message\":\"Anda ditawari untuk hidup nyaman jika meninggalkan iman, atau menghadapi penganiayaan jika tetap setia. Apa yang akan Anda lakukan?\",\"options\":[\"Menerima tawaran dan hidup nyaman\",\"Tetap setia meski menghadapi penganiayaan\",\"Mencari jalan tengah\"]}'"
curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{
    "mode":"choice",
    "message":"Anda ditawari untuk hidup nyaman jika meninggalkan iman, atau menghadapi penganiayaan jika tetap setia. Apa yang akan Anda lakukan?",
    "options":[
      "Menerima tawaran dan hidup nyaman",
      "Tetap setia meski menghadapi penganiayaan",
      "Mencari jalan tengah"
    ]
  }' | jq .
echo ""
echo ""

# Test 7: Out of Memory Test
echo "✅ Test 7: Out of Memory - Pertanyaan di luar memori"
echo "curl -X POST $URL -H 'Content-Type: application/json' -d '{\"mode\":\"chat\",\"message\":\"Siapa presiden Indonesia tahun 2025?\"}'"
curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Siapa presiden Indonesia tahun 2025?"}' | jq .
echo ""
echo ""

echo "=================================="
echo "✅ All tests completed!"
echo ""
echo "Usage:"
echo "  ./test-api.sh              # Test production"
echo "  ./test-api.sh $LOCAL_URL   # Test local dev"
