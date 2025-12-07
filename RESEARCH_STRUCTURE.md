# Modern-Day De Britto - Research Structure

**Project**: AI-Powered Historical Persona Simulation  
**Author**: Alexander Adrian  
**Date**: December 2025  
**License**: Creative Commons Attribution 4.0 International (CC BY 4.0)

---

## 1. Research Objectives

### Primary Objective
Develop an AI system that authentically simulates a historical persona's voice, values, and intellectual character while maintaining ethical transparency.

### Secondary Objectives
1. Implement RAG architecture for character-constrained knowledge retrieval
2. Achieve tone alignment with historical primary sources
3. Adapt system for Indonesian-language pastoral counseling
4. Demonstrate psychological grounding through MBTI and IQ integration

---

## 2. Research Questions

### RQ1: Character Consistency
**How can psychological frameworks (MBTI, IQ estimation) improve AI persona consistency?**

**Hypothesis**: Explicit personality modeling constrains LLM behavior more effectively than prompt engineering alone.

**Methodology**: Compare responses with/without MBTI+IQ in system prompt.

**Metrics**: Character consistency score (manual evaluation), tone alignment

### RQ2: Knowledge Grounding
**Does RAG retrieval improve factual accuracy in historical persona simulation?**

**Hypothesis**: Semantic search over curated biography prevents hallucination.

**Methodology**: Evaluate factual accuracy with/without RAG retrieval.

**Metrics**: Factual error rate, "not in memory" usage frequency

### RQ3: Tone Authenticity
**Can historical letters inform voice calibration for character AI?**

**Hypothesis**: Analyzing primary source tone characteristics (directness, resolve, joy) produces more authentic responses.

**Methodology**: Extract voice features from quotes, add to prompt guidelines, A/B test.

**Metrics**: User satisfaction (pastoral authenticity), expert evaluation

### RQ4: Cultural Adaptation
**What are the requirements for culturally appropriate spiritual counseling AI?**

**Hypothesis**: Gender-neutral language + cultural norms increase acceptability.

**Methodology**: Implement Indonesian gender-neutral pronouns, test with native speakers.

**Metrics**: Cultural appropriateness rating, user acceptance

---

## 3. System Architecture

### 3.1 Data Layer
```
persona.json (1 file)
├── Psychological Profile (MBTI, IQ)
├── Biographical Data (education, history, culture)
├── Values System
└── Historical Quotes (primary sources)

persona_vectors.json (33 items)
├── Core Traits (6 items)
├── History (4 items)
├── Values (5 items)
├── Culture (4 items)
├── Education (4 items)
├── Behavior (3 items)
├── Cognition (1 item)
└── Quotes (6 items)
```

### 3.2 Processing Layer
```
RAG Pipeline:
1. Query Embedding (BGE-small-en-v1.5)
2. Cosine Similarity Search
3. Top-K Retrieval (K=3)
4. Context Injection

Prompt Engineering:
1. Load Character Profile
2. Inject Retrieved Memories
3. Add Tone Guidelines
4. Set Language Requirements
5. Apply Length Constraints
```

### 3.3 Generation Layer
```
LLM: Llama 3 8B Instruct
Platform: Cloudflare Workers AI
Deployment: Global Edge Network
Response Time: <2 seconds average
```

---

## 4. Methodology

### Phase 1: Character Design (Week 1-2)
- [ ] Historical research (biographical sources, letters)
- [x] MBTI typing (INFJ based on documented patterns)
- [x] IQ estimation (138 based on linguistic ability)
- [x] Quote analysis (extract tone characteristics)
- [x] Memory curation (select 33 representative items)

### Phase 2: System Development (Week 2-3)
- [x] Implement RAG retrieval system
- [x] Build prompt engineering pipeline
- [x] Deploy to Cloudflare Workers
- [x] Create interactive chat interface
- [ ] Generate embeddings for all memory items

### Phase 3: Voice Calibration (Week 3-4)
- [x] Analyze historical quotes for voice features
- [x] Add tone guidelines to system prompt
- [x] Iterative testing and refinement
- [x] Length optimization (prevent cutoffs)

### Phase 4: Cultural Adaptation (Week 4)
- [x] Implement Indonesian language requirement
- [x] Add gender-neutral pronoun guidelines
- [x] Test with Indonesian speakers
- [x] Refine pastoral tone

### Phase 5: Evaluation (Week 5)
- [ ] User study (n=20, Indonesian speakers)
- [ ] Expert evaluation (Jesuit scholars)
- [ ] Factual accuracy assessment
- [ ] Cultural appropriateness rating

### Phase 6: Documentation (Week 6)
- [x] Write research paper
- [x] Create OSF.io submission package
- [x] Open source release (MIT + CC BY 4.0)
- [ ] Publish demo

---

## 5. Data Collection

### 5.1 Primary Sources
- **Historical Letters**: 
  - Letter to P. Manuel Rodrigues (July 30, 1686)
  - Letter to P. Luiz Pereira (Madurai mission, May 23)
  - Final letter to Father Francisco Laynes (Feb 3, 1693)

### 5.2 Biographical Sources
- Jesuit Historical Institute archives
- Canonization documents (1947)
- Scholarly biographies

### 5.3 Dataset Structure
```json
{
  "id": "memory_item_id",
  "text": "Natural language description",
  "type": "core_trait|history|value|culture|education|behavior|quote",
  "embedding": [384-dimensional vector]
}
```

**Total**: 33 curated memory items  
**Coverage**: Personality (11), Biography (8), Values (5), Culture (4), Quotes (6)

---

## 6. Evaluation Metrics

### 6.1 Quantitative Metrics
1. **Response Completeness**: % of responses with proper conclusion (target: 100%)
2. **Character Consistency**: Inter-response similarity score (target: >0.85)
3. **Factual Accuracy**: % of statements grounded in memory (target: >95%)
4. **Response Time**: Average latency (target: <3 seconds)
5. **Gender-Neutral Compliance**: % using "saudara" (target: 100%)

### 6.2 Qualitative Metrics
1. **Pastoral Authenticity**: Expert rating (1-5 scale)
2. **Tone Alignment**: Match to historical quotes (manual evaluation)
3. **Cultural Appropriateness**: Indonesian speaker rating
4. **User Satisfaction**: Helpfulness and relevance of guidance

### 6.3 Evaluation Tools
- Manual annotation (2 independent evaluators)
- A/B testing (with/without features)
- User surveys (Likert scale 1-5)
- Expert interviews (Jesuit scholars, historians)

---

## 7. Expected Outcomes

### 7.1 Technical Contributions
1. ✅ RAG-enhanced persona simulation architecture
2. ✅ Psychological grounding framework (MBTI + IQ + Education)
3. ✅ Voice calibration methodology from historical sources
4. ⏳ Curated biographical dataset (33 items, embeddings pending)

### 7.2 Domain Contributions
1. ✅ Indonesian-language spiritual counseling AI
2. ✅ Jesuit mission history educational tool
3. ✅ Culturally appropriate gender-neutral AI design

### 7.3 Ethical Contributions
1. ✅ Self-aware character AI (acknowledges simulation nature)
2. ✅ Knowledge boundary transparency ("not in memory")
3. ✅ No fabrication policy (strictly grounded responses)

---

## 8. Experimental Design

### Experiment 1: MBTI+IQ Impact
**IV**: System prompt (with/without MBTI+IQ)  
**DV**: Character consistency score  
**Method**: 20 queries, 2 conditions, 2 evaluators  
**Status**: ⏳ Pending

### Experiment 2: RAG Effectiveness
**IV**: Retrieval (with/without RAG)  
**DV**: Factual accuracy rate  
**Method**: 30 queries, answer verification  
**Status**: ⏳ Pending (embeddings required)

### Experiment 3: Tone Calibration
**IV**: Tone guidelines (with/without historical analysis)  
**DV**: Pastoral authenticity rating  
**Method**: Expert evaluation, 5-point scale  
**Status**: ⏳ Pending

### Experiment 4: Cultural Acceptance
**IV**: Gender-neutral requirement (yes/no)  
**DV**: Cultural appropriateness rating  
**Method**: Indonesian speaker survey (n=20)  
**Status**: ⏳ Pending

---

## 9. Timeline

| Week | Phase | Status |
|------|-------|--------|
| 1-2  | Character Design | ✅ Complete |
| 2-3  | System Development | ✅ Complete |
| 3-4  | Voice Calibration | ✅ Complete |
| 4    | Cultural Adaptation | ✅ Complete |
| 5    | Evaluation | ⏳ In Progress |
| 6    | Documentation | ⏳ In Progress |

---

## 10. Team & Resources

### Team
- **Lead Developer/Researcher**: aleadr
- **Domain Experts**: TBD (Jesuit scholars)
- **Evaluators**: TBD (Indonesian speakers, historians)

### Resources
- Cloudflare Workers AI (compute)
- Historical archives (Jesuit Institute)
- Open-source LLMs (Llama 3 8B)

---

## 11. Risks & Mitigation

### Risk 1: Cultural Misrepresentation
**Mitigation**: Native speaker review, expert consultation

### Risk 2: Historical Inaccuracy
**Mitigation**: Strict knowledge grounding, "not in memory" fallback

### Risk 3: Technical Limitations (LLM hallucination)
**Mitigation**: RAG retrieval, factual constraints, self-awareness

### Risk 4: User Misuse (treating as real person)
**Mitigation**: Explicit simulation acknowledgment, transparency

---

## 12. Deliverables

### Technical
- [ ] ✅ Production-deployed API (https://persona-agent.tarroto.workers.dev)
- [ ] ✅ Open-source codebase (MIT License)
- [ ] ⏳ Embedded knowledge base (33 items with vectors)

### Research
- [ ] ✅ Research paper (PAPER.md)
- [ ] ⏳ User study results
- [ ] ⏳ Expert evaluation report

### Documentation
- [ ] ✅ README.md (technical documentation)
- [ ] ✅ API_REFERENCE.md (usage guide)
- [ ] ✅ OSF_REGISTRATION.md (IP protection)

---

## License

This research structure is licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

**© 2025 aleadr. All rights reserved.**
