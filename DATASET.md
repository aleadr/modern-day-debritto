# Dataset: Modern-Day De Britto Historical Persona Knowledge Base

**Project**: AI-Powered Historical Persona Simulation  
**Author**: aleadr  
**Date**: December 2025  
**License**: Creative Commons Attribution 4.0 International (CC BY 4.0)  
**DOI**: [To be assigned by OSF.io]

---

## Dataset Overview

This dataset contains curated biographical and psychological data about St. John (João) de Britto (1647-1693), a Portuguese Jesuit missionary martyred in India, designed for AI persona simulation research.

**Purpose**: Enable RAG-enhanced character AI systems to generate historically-grounded, personality-consistent responses.

---

## Dataset Components

### 1. Character Profile (`persona.json`)
**Size**: 4.6 KB  
**Format**: JSON  
**License**: CC BY 4.0

**Contents**:
- **Psychological Profile**: MBTI type (INFJ), estimated IQ (138)
- **Biographical Data**: Birth, education, mission work, martyrdom
- **Values System**: Self-sacrifice, obedience, cultural adaptation, integrity
- **Cultural Context**: Portuguese/Tamil, Jesuit/Hindu intersection
- **Education**: Jesuit theological/philosophical training, languages
- **Historical Quotes**: 3 authentic Portuguese quotes from prison letters (1686-1693)

**Structure**:
```json
{
  "name": "St. John (João) de Britto",
  "mbti": "INFJ",
  "iq": 138,
  "short_profile": "...",
  "core_traits": [...],
  "values": [...],
  "culture": {...},
  "education": {...},
  "history": [...],
  "quotes": [...]
}
```

### 2. Memory Items Database (`persona_vectors.json`)
**Size**: 8.1 KB  
**Format**: JSON  
**License**: CC BY 4.0  
**Count**: 33 curated memory items

**Categories**:
- **Core Traits** (6 items): Personality characteristics
- **History** (4 items): Life events and timeline
- **Values** (5 items): Personal convictions
- **Culture** (4 items): Cultural context and norms
- **Education** (4 items): Intellectual formation
- **Behavior** (3 items): Documented patterns
- **Cognition** (1 item): Intellectual capacity
- **Quotes** (6 items): Historical sayings

**Structure**:
```json
{
  "id": "unique_identifier",
  "text": "Natural language description of biographical fact",
  "type": "core_trait|history|value|culture|education|behavior|cognition|quote",
  "embedding": []  // 384-dimensional vector (BGE-small-en-v1.5)
}
```

**Note**: Current version has empty embedding arrays. Full version with embeddings available upon request or via embedding generation script.

---

## Data Collection Methodology

### Primary Sources
1. **Historical Letters**:
   - Letter to P. Manuel Rodrigues (July 30, 1686) - Prison correspondence
   - Letter to P. Luiz Pereira (Madurai mission, May 23) - Mission report
   - Final letter to Father Francisco Laynes (February 3, 1693) - Eve of execution

2. **Biographical Archives**:
   - Jesuit Historical Institute, Lisbon
   - Canonization documents (1947)
   - Scholarly biographies and mission records

### Curation Process
1. **Historical Research**: Review of primary and secondary sources
2. **Fact Extraction**: Identification of verifiable biographical data
3. **Categorization**: Classification into personality/biographical dimensions
4. **MBTI Typing**: Behavioral pattern analysis → INFJ classification
5. **IQ Estimation**: Linguistic ability + educational achievement → 138 estimate
6. **Quote Selection**: Authentic Portuguese phrases from letters
7. **Memory Item Creation**: 33 representative items across all dimensions

### Data Quality Assurance
- **Verifiability**: All items traceable to historical sources
- **Completeness**: Coverage across personality dimensions
- **Diversity**: Multiple types (traits, history, values, culture, etc.)
- **Authenticity**: Quotes preserved in original Portuguese

---

## Dataset Statistics

| Category | Count | Percentage |
|----------|-------|------------|
| Core Traits | 6 | 18.2% |
| History | 4 | 12.1% |
| Values | 5 | 15.2% |
| Culture | 4 | 12.1% |
| Education | 4 | 12.1% |
| Behavior | 3 | 9.1% |
| Cognition | 1 | 3.0% |
| Quotes | 6 | 18.2% |
| **Total** | **33** | **100%** |

### Language Distribution
- **Portuguese quotes**: 3 (historical authenticity)
- **English descriptions**: 30 (accessibility)
- **Total coverage**: Personality, biography, values, culture

### Temporal Coverage
- **Birth**: 1647
- **Jesuit Entry**: ~1662 (15 years old, typical age)
- **Mission Period**: ~1673-1693 (20 years)
- **Martyrdom**: February 4, 1693
- **Time Span**: 46-year life, 20-year mission

---

## Use Cases

### Research Applications
1. **AI Persona Simulation**: RAG-enhanced character consistency
2. **Historical NLP**: Period-accurate language modeling
3. **Psychological AI**: MBTI-grounded personality systems
4. **Cultural AI**: Cross-cultural adaptation studies (Portuguese-Tamil-Indonesian)

### Educational Applications
1. **Jesuit History**: Interactive learning about mission work
2. **Inculturation Studies**: Cultural adaptation strategies
3. **Comparative Religion**: Catholic-Hindu dialogue in 17th century

### Technical Applications
1. **RAG Benchmarking**: Test retrieval systems with biographical data
2. **Prompt Engineering**: Character-constrained generation
3. **Multilingual NLP**: Portuguese-English-Indonesian translation

---

## Dataset Limitations

1. **Embedding Vectors**: Current version has empty arrays (requires generation)
2. **Historical Gaps**: Some periods have limited documentation
3. **Language**: Primarily English descriptions (Portuguese quotes preserved)
4. **Scope**: 33 items (could be expanded to 100+ with deeper archival research)
5. **Subjectivity**: MBTI typing and IQ estimation based on behavioral inference

---

## Citation

If you use this dataset, please cite:

```
aleadr. (2025). Modern-Day De Britto Historical Persona Knowledge Base 
[Dataset]. Open Science Framework. https://osf.io/uk7n9/
```

**BibTeX**:
```bibtex
@dataset{aleadr2025debritto,
  author = {aleadr},
  title = {Modern-Day De Britto Historical Persona Knowledge Base},
  year = {2025},
  publisher = {Open Science Framework},
  doi = {10.17605/OSF.IO/UK7N9},
  url = {https://osf.io/uk7n9/}
}
```

---

## Ethical Considerations

### Representation
- **Historical Accuracy**: All biographical claims traceable to sources
- **Cultural Sensitivity**: Respectful treatment of Jesuit and Tamil cultural contexts
- **Religious Respect**: Accurate portrayal of Catholic missionary work

### Privacy
- **No Personal Data**: Subject is historical figure (died 1693)
- **Public Domain**: All source materials are historical records

### Transparency
- **Methodology**: Full curation process documented
- **Limitations**: Historical gaps and estimation methods disclosed
- **Licensing**: Open access under CC BY 4.0

---

## Data Format Specifications

### `persona.json` Schema
```typescript
interface Persona {
  name: string;
  mbti: "INFJ";
  iq: number;
  short_profile: string;
  core_traits: string[];
  values: string[];
  culture: {
    country: string;
    ethnicity: string;
    religion: string;
    subculture: string[];
    norms: string[];
  };
  education: {
    highest_level: string;
    field: string;
    strengths: string[];
    weaknesses: string[];
    key_experiences: string[];
  };
  history: string[];
  quotes: Quote[];
}

interface Quote {
  id: string;
  text: string;
  context: string;
  tags: string[];
}
```

### `persona_vectors.json` Schema
```typescript
interface MemoryItem {
  id: string;
  text: string;
  type: "core_trait" | "history" | "value" | "culture" | 
        "education" | "behavior" | "cognition" | "quote";
  embedding: number[];  // 384-dim for BGE-small-en-v1.5
}
```

---

## Access & Usage

### Download
- **Repository**: https://github.com/aleadr/modern-day-debritto
- **OSF.io**: https://osf.io/uk7n9/
- **Files**: `persona.json`, `persona_vectors.json`

### Embedding Generation
Use provided script (`scripts/generate-embeddings.ts`) to populate embeddings:
```bash
cd scripts
wrangler dev
curl -X POST http://localhost:8787 > persona_vectors_updated.json
```

### Integration Examples
See `README.md` and `API_REFERENCE.md` in repository.

---

## Updates & Versioning

**Version**: 1.0 (December 2025)

**Changelog**:
- v1.0 (2025-12-07): Initial release
  - 33 curated memory items
  - MBTI + IQ + education integration
  - Historical quotes from primary sources
  - Empty embedding arrays (to be populated)

**Future Versions**:
- v1.1: Populated embeddings (384-dim BGE vectors)
- v2.0: Expanded to 100+ memory items
- v2.1: Fine-tuned embeddings on historical corpus

---

## License

**Creative Commons Attribution 4.0 International (CC BY 4.0)**

You are free to:
- ✓ **Share**: Copy and redistribute in any format
- ✓ **Adapt**: Remix, transform, build upon the material
- ✓ **Commercial**: Use for commercial purposes

Under these terms:
- **Attribution**: Must credit "aleadr" (Alexander Adrian) and link to license
- **No Additional Restrictions**: Cannot apply legal/technical measures that restrict others

Full license: https://creativecommons.org/licenses/by/4.0/

---

## Contact

**Author**: Alexander Adrian  
**LinkedIn**: https://www.linkedin.com/in/aleadr/  
**Repository**: https://github.com/aleadr/modern-day-debritto  
**Issues**: https://github.com/aleadr/modern-day-debritto/issues

---

**© 2025 aleadr. Licensed under CC BY 4.0.**
