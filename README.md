# Modern-Day De Britto

**By [aleadr](https://www.linkedin.com/in/aleadr/)** | [📚 DOI](https://doi.org/10.17605/OSF.IO/UK7N9)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An AI-powered persona agent that simulates conversations with **St. John (João) de Britto**, a 17th-century Portuguese Jesuit missionary and martyr. Built on Cloudflare Workers AI with RAG (Retrieval-Augmented Generation).

## 🌐 Live Demo

**Production URL**: [https://persona-agent.tarroto.workers.dev](https://persona-agent.tarroto.workers.dev)

Try it now:
```bash
curl https://persona-agent.tarroto.workers.dev
```

## 🎯 Features

- **Two Interaction Modes**:
  - **Chat Mode**: Natural language conversations
  - **Choice Mode**: Decision-making based on persona's values and traits
- **Indonesian Language**: All responses are in Bahasa Indonesia
- **RAG-Enhanced Responses**: Contextually relevant biographical information
- **Psychologically Grounded**: INFJ personality model, historical accuracy
- **Edge Computing**: Fast global responses via Cloudflare Workers
- **Cross-Origin Support**: CORS-enabled for browser/API access

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Cloudflare account
- Wrangler CLI installed globally: `npm install -g wrangler`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd modern-day-debritto

# Install dependencies
npm install

# Authenticate with Cloudflare
wrangler login
```

## 💬 Interactive Chat

For a better chat experience, use the interactive chat script:

```bash
# Ask a question in Indonesian
./chat.sh "Siapa Anda?"

# Get spiritual guidance
./chat.sh "Doa saya terasa hampa, apa nasihat Anda?"

# Learn about his mission
./chat.sh "Ceritakan tentang pengalaman Anda di India"

# Test against local dev server
LOCAL=1 ./chat.sh "Test question"
```

The chat script provides:
- 🎨 Colored, formatted output
- 📏 Automatic text wrapping
- ✨ Proper newline handling
- 🔄 Error handling
- 🌐 Production/local switching

## 🙏 Ethical Use

**This public API is provided free for research and educational purposes.**

**Rate Limits**:
- Public API: **20 requests per minute per IP**
- Purpose: Prevent abuse and keep service free for everyone

**For Heavy Usage**:
- ✅ **Deploy your own instance** (code is open source, MIT License)
- ✅ **Run locally** with `npm run dev`
- ✅ **Free Cloudflare tier** supports ~10,000 requests/day

**Please**:
- Respect rate limits (allows legitimate research use)
- Report abuse via [GitHub Issues](https://github.com/aleadr/modern-day-debritto/issues)
- Consider local deployment for automation/testing

This helps keep the service available for academic research and demonstrations.

## ⚠️ First-Time Setup: Generate Embeddings

**IMPORTANT**: Before the persona agent will work properly, you need to generate embeddings for all memory items.

### Option 1: Run Embedding Generator Locally

```bash
cd scripts
wrangler dev
```

Then in another terminal, trigger the generation:

```bash
curl -X POST http://localhost:8787 > persona_vectors_updated.json
```

This will create a new file with populated embeddings. Copy the contents to replace `src/persona_vectors.json`.

### Option 2: Deploy Embedding Generator (One-Time)

```bash
cd scripts
wrangler deploy
```

Visit the deployed URL and send a POST request to download the updated JSON:

```bash
curl -X POST https://embedding-generator.your-subdomain.workers.dev > persona_vectors_updated.json
```

Then replace the contents of `src/persona_vectors.json` with the generated file.

## 🏃 Running the Main Agent

### Development

```bash
npm run dev
```

This starts a local development server at `http://localhost:8787`.

### Deployment

```bash
npm run deploy
```

## 📡 API Usage

### Health Check

```bash
curl https://persona-agent.tarroto.workers.dev
```

**Response**:
```json
{
  "status": "healthy",
  "persona": "St. John (João) de Britto",
  "modes": ["chat", "choice"],
  "version": "0.1.0"
}
```

### Chat Mode

```bash
curl -X POST https://persona-agent.tarroto.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "chat",
    "message": "Ceritakan tentang misi Anda di India"
  }'
```

**Response**:
```json
{
  "type": "chat",
  "answer": "Misi saya di Madurai adalah panggilan suci untuk melayani Tuhan dan membawa pesan kasih-Nya kepada masyarakat Tamil. Saya telah belajar bahasa mereka, mengenakan pakaian lokal mereka, dan hidup seperti mereka agar dapat membangun kepercayaan dan membagikan Injil dengan cara yang mereka pahami..."
}
```

### Choice Mode

```bash
curl -X POST https://persona-agent.tarroto.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "choice",
    "message": "Anda ditawari kenyamanan dan keselamatan jika meninggalkan iman, atau menghadapi kematian syahid jika menolak.",
    "options": [
      "Menerima tawaran dan hidup nyaman",
      "Menolak dan menghadapi kematian syahid",
      "Bernegosiasi untuk kompromi"
    ]
  }'
```

**Response**:
```json
{
  "type": "choice",
  "choice": "B",
  "reason": "Sebagai orang yang telah mendedikasikan hidup saya untuk Kristus, saya tidak dapat mengkhianati iman saya demi kenyamanan duniawi. Condennado à morte por Christo - terhukum mati karena Kristus."
}
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Test production API
./test-api.sh

# Test local development
./test-api.sh http://localhost:8787
```

The test suite includes:
- ✅ Health check
- ✅ Simple chat (identity questions)
- ✅ Self-awareness test
- ✅ Historical knowledge
- ✅ Values/beliefs questions
- ✅ Choice mode (ethical dilemmas)
- ✅ Out-of-memory handling

## 🏗️ Project Structure

```
modern-day-debritto/
├── src/
│   ├── index.ts              # Main worker (API handler)
│   ├── llm.ts                # LLM interface (Llama 3 + BGE embedding)
│   ├── rag.ts                # RAG retrieval logic
│   ├── persona.json          # Detailed persona profile
│   └── persona_vectors.json  # Memory database (33 items)
├── scripts/
│   ├── generate-embeddings.ts # One-time embedding generator
│   └── wrangler.toml         # Config for embedding worker
├── package.json
├── tsconfig.json
└── wrangler.toml             # Main worker config
```

## 🧠 How It Works

1. **User sends query** (chat or choice mode)
2. **RAG retrieval**: Query is embedded and top 3 relevant memories are retrieved via cosine similarity
3. **Prompt construction**: System prompt includes persona profile + retrieved memories
4. **LLM generation**: Llama 3 8B generates response as St. John de Britto
5. **Response parsing**: JSON extracted for choice mode, raw text for chat mode
6. **CORS-enabled response** returned to client

## 📊 Persona Details

- **Name**: St. John (João) de Britto
- **MBTI**: INFJ (Introverted, Intuitive, Feeling, Judging)
- **IQ**: 138 (estimated verbal IQ)
- **Era**: 17th-century Jesuit missionary
- **Region**: Madurai, Tamil Nadu, India
- **Known For**: 
  - Inculturation (adopting local Tamil customs/dress)
  - Converting thousands through cultural empathy
  - Martyrdom at Oriyur (1693)
  - Canonized 1947

## 🔧 Technology Stack

- **Runtime**: Cloudflare Workers (V8 isolates)
- **Language**: TypeScript
- **LLM**: Llama 3 8B Instruct (`@cf/meta/llama-3-8b-instruct`)
- **Embedding Model**: BGE-small (`@cf/baai/bge-small-en-v1.5`)
- **AI Provider**: Cloudflare Workers AI
- **Deployment**: Wrangler CLI

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Add conversation history tracking
- Multi-persona support
- Fine-tuned LLM on historical letters
- Advanced memory retrieval strategies

## 👨‍💻 Author

**Alexander Adrian (aleadr)**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/aleadr/)

---

## 🎄 Author's Note

This project was created as a **Christmas present to _Civitas Academica_, Alumni, Teachers, Staffs, Perkumpulan Alumni Kolese De Britto, and Kolese De Britto Yogyakarta** — a small gift of technology in service of faith and reflection.

> _Selalu tetap bersatu, dengan semua kawanmu!_ - Mars De Britto

---

## 📜 License

MIT License - see the [LICENSE](LICENSE) file for details.

This project is licensed under the MIT License, which means you are free to use, modify, and distribute this software, even for commercial purposes, as long as you include the original copyright notice.

## 📖 Citation

If you use this project in your research or work, please cite:

```
aleadr. (2025). Modern-Day De Britto: AI-Powered Historical Persona Simulation. 
Open Science Framework. https://doi.org/10.17605/OSF.IO/UK7N9
```

**BibTeX**:
```bibtex
@misc{aleadr2025debritto,
  author = {aleadr},
  title = {Modern-Day De Britto: AI-Powered Historical Persona Simulation},
  year = {2025},
  publisher = {Open Science Framework},
  doi = {10.17605/OSF.IO/UK7N9},
  url = {https://osf.io/uk7n9/}
}
```

## 🙏 Acknowledgments

- Historical data sourced from Jesuit archives
- Quotes from authentic prison letters (1686-1693)
- MBTI analysis based on documented behavior patterns
- Powered by Cloudflare Workers AI
