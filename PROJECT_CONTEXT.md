# PROJECT_CONTEXT.md
# Dental Denial Appeal Letter Generator — AI Agent MVP
# #ZeroToOne 100-Day Challenge
# Last Updated: April 2026

---

## What This Project Does

A web app that takes a dental insurance denial reason as input and uses an AI agent to generate a professional, payer-specific appeal letter in under 30 seconds. No patient data is stored. The output is a downloadable .docx or .pdf letter ready to submit to the insurance company.

---

## Tech Stack

### AI Layer
- **Gemini API (Free Tier)** — Google AI Studio, model: `gemini-2.5-flash` (free tier, no credit card)
- No LangChain at MVP stage — manual prompt chaining in Python to keep it simple
- Pydantic for structured output validation

### Backend
- **FastAPI** (Python) — lightweight REST API
- **Supabase** — database + auth (free tier)
- No Redis at MVP — add later when needed

### Frontend
- **Next.js 14** (React) — web app framework
- **Tailwind CSS** — styling
- **shadcn/ui** — UI components

### Document Generation
- **python-docx** — generate .docx appeal letters

### Hosting
- **Vercel** — frontend (free tier)
- **Railway** — backend FastAPI (free tier)

---

## Project Structure

```
dental-appeal-generator/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── agent/
│   │   ├── classifier.py    # Step 1: classify denial type
│   │   ├── rule_engine.py   # Step 2: match payer rules
│   │   └── letter_gen.py    # Step 3: generate appeal letter
│   ├── models/
│   │   └── schemas.py       # Pydantic input/output models
│   ├── services/
│   │   └── gemini.py        # Gemini API wrapper
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main input page
│   │   ├── result/page.tsx  # Letter display + download
│   │   └── layout.tsx
│   ├── components/
│   │   ├── DenialForm.tsx   # Paste denial input form
│   │   └── LetterPreview.tsx
│   └── package.json
├── PROJECT_CONTEXT.md       # This file — Copilot reads this
└── README.md
```

---

## The AI Agent — 3-Step Flow

### Step 1: Classify the Denial
Input: raw denial reason text
Output: structured JSON
```json
{
  "denial_category": "frequency_limitation | bundling | medical_necessity | missing_documentation | coordination_of_benefits",
  "cdt_code": "D4341",
  "payer_name": "Delta Dental",
  "confidence": "high | medium | low"
}
```

### Step 2: Match Payer Rule
- Load payer-specific rules from `payer_rules.json`
- If payer known → use specific appeal strategy
- If payer unknown → use generic best-practice strategy

### Step 3: Generate Appeal Letter
- Feed classification + payer rule into Gemini
- Return complete, formatted letter text
- Replace patient placeholders before download

---

## Payer Rules Knowledge Base (payer_rules.json)

Covers top 10 US dental payers:
- Delta Dental
- Cigna Dental
- MetLife Dental
- Aetna Dental
- Guardian Dental
- United Concordia
- Humana Dental
- Ameritas
- Principal Financial
- Sun Life

Each payer entry includes:
- Common denial codes they use
- Frequency limitations by CDT code
- Appeal language that works
- Required documentation per denial type

---

## Functional Requirements (MVP)

| ID | Requirement |
|----|-------------|
| FR-01 | User pastes denial reason into text field |
| FR-02 | User optionally enters payer name and CDT code |
| FR-03 | System classifies denial into 1 of 5 categories |
| FR-04 | System generates complete appeal letter < 30 seconds |
| FR-05 | Letter is editable in browser before download |
| FR-06 | Letter downloadable as .docx |
| FR-07 | No PHI (patient names, DOBs, IDs) stored anywhere |
| FR-08 | Free tier: 5 letters/month. Paid: unlimited |

---

## Non-Functional Requirements (MVP)

| ID | Requirement |
|----|-------------|
| NFR-01 | Letter generated in under 30 seconds |
| NFR-02 | No PHI stored — input field has disclaimer |
| NFR-03 | HTTPS only |
| NFR-04 | Mobile-responsive UI |
| NFR-05 | Clear error messages in plain English |

---

## HIPAA Boundary (Critical)

**The app does NOT store or process Protected Health Information.**

Users are explicitly told on the input screen:
> "Do not enter patient names, dates of birth, insurance IDs, or any identifying information. Use placeholders like [PATIENT NAME] instead. Fill these in after downloading."

This keeps the MVP outside HIPAA scope entirely.

---

## Current Phase

**Phase 1 (Days 1–14): Core AI Agent — Backend Only**

Goal: Working FastAPI endpoint that:
1. Accepts denial text via POST request
2. Sends it through the 3-step agent (classify → rule match → generate)
3. Returns structured appeal letter content as JSON
4. No frontend yet — test with Postman or curl

Success criteria: Paste any real denial reason → get a usable appeal letter back in under 30 seconds.

---

## Environment Variables

```
GEMINI_API_KEY=your_key_from_aistudio.google.com
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

---

## Key Constraints for Copilot

- Use `gemini-2.5-flash` as the model string (free tier)
- Use `google-generativeai` Python SDK (pip install google-generativeai)
- Keep each agent step as a separate function — do not merge into one giant prompt
- Always validate AI output with Pydantic before returning to frontend
- Never log or store the raw denial text input beyond the current request
- Appeal letters must include these placeholders: [PATIENT NAME], [DATE OF SERVICE], [CLAIM NUMBER], [PAYER ADDRESS]
