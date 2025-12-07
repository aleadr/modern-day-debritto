# Quick API Reference

## 🌐 Production Endpoint
```
https://persona-agent.tarroto.workers.dev
```

## 💬 Interactive Chat (Recommended)

**Best way to chat:**
```bash
./chat.sh "Your question in Indonesian"
```

**Examples:**
```bash
./chat.sh "Siapa Anda?"
./chat.sh "Ceritakan tentang misi Anda"
./chat.sh "Apa nasihat Anda untuk saya?"
```

---

## 🔍 Raw API Calls

### Health Check
```bash
curl https://persona-agent.tarroto.workers.dev
```

## 💬 Chat (Simple)
```bash
curl -X POST https://persona-agent.tarroto.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Siapa Anda?"}'
```

## 💬 Chat (Detailed)
```bash
curl -X POST https://persona-agent.tarroto.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Ceritakan tentang misi Anda di India"}'
```

## 🎯 Choice Mode
```bash
curl -X POST https://persona-agent.tarroto.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "mode":"choice",
    "message":"Anda harus memilih antara kenyamanan pribadi atau tugas misi. Apa yang Anda pilih?",
    "options":[
      "Memilih kenyamanan pribadi",
      "Melanjutkan tugas misi meski sulit",
      "Mencari keseimbangan"
    ]
  }'
```

## 🧪 Run Full Test Suite
```bash
./test-api.sh
```

## 📝 Response Formats

### Chat Response
```json
{
  "type": "chat",
  "answer": "Response in Bahasa Indonesia..."
}
```

### Choice Response
```json
{
  "type": "choice",
  "choice": "B",
  "reason": "Explanation in Bahasa Indonesia..."
}
```

### Error Response
```json
{
  "type": "error",
  "error": "AI service unavailable",
  "message": "Error details..."
}
```

## 🌟 Key Features
- ✅ All responses in **Bahasa Indonesia**
- ✅ Self-aware character (acknowledges being a simulation)
- ✅ Based on historical St. John de Britto
- ✅ MBTI: INFJ personality model
- ✅ RAG-enhanced with 33 memory items
