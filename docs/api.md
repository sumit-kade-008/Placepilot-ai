# PlacePilot AI — REST API Documentation

Base URL: `http://localhost:3000/api`

## Endpoints

### 1. `GET /api/schemes`
Returns a list of government schemes with optional query filters.
- **Query Parameters:**
  - `category` (string, optional)
  - `level` ('Central' | 'State', optional)
  - `state` (string, optional)
  - `isScholarship` ('true' | 'false', optional)
  - `search` (string, optional)
- **Response:**
  ```json
  {
    "count": 22,
    "schemes": [...]
  }
  ```

### 2. `GET /api/schemes/:id`
Retrieves full details, deterministic eligibility rule, and form template for a scheme.
- **Response:**
  ```json
  {
    "scheme": { ... },
    "rule": { ... },
    "template": { ... }
  }
  ```

### 3. `POST /api/eligibility/check`
Executes the deterministic rules engine on a scheme using the citizen's profile.
- **Request Body:**
  ```json
  {
    "schemeId": "MAHA_OBC_SCHOLARSHIP",
    "profile": {
      "state": "Maharashtra",
      "annualFamilyIncome": 150000,
      "category": "OBC",
      "educationLevel": "Undergraduate"
    }
  }
  ```
- **Response:**
  ```json
  {
    "schemeId": "MAHA_OBC_SCHOLARSHIP",
    "outcome": "ELIGIBLE",
    "summary": "All 4 published eligibility criteria are satisfied by citizen profile.",
    "conditionResults": [...],
    "missingFields": [],
    "recommendedAction": "Proceed to prepare document checklist...",
    "evaluatedAt": "2026-11-10T13:58:43.000Z"
  }
  ```

### 4. `POST /api/gemini/chat`
Invokes the Scheme Saathi AI Orchestrator with tool calling support.
- **Request Body:**
  ```json
  {
    "message": "I am a college student from Maharashtra. My family's annual income is approximately ₹1,50,000. Find scholarships that I may qualify for.",
    "profile": { ... },
    "language": "en"
  }
  ```
- **Response:**
  ```json
  {
    "reply": "Greetings! Based on your profile...",
    "toolExecutions": [
      { "toolName": "search_scholarships", "args": { "state": "Maharashtra" }, "status": "success" },
      { "toolName": "check_eligibility", "status": "success" }
    ],
    "actionSuggestions": [...]
  }
  ```

### 5. `POST /api/documents/extract`
Simulates OCR document field extraction for certificates.
- **Request Body:**
  ```json
  {
    "documentType": "Income Certificate issued by Tehsildar",
    "fileName": "income_cert.pdf"
  }
  ```

### 6. `POST /api/approvals/record`
Records human approval event with audit checksum.
- **Request Body:**
  ```json
  {
    "applicationId": "app-draft-01",
    "schemeId": "MAHA_OBC_SCHOLARSHIP",
    "citizenEmail": "citizen.demo@placepilot.local",
    "signatureStatement": "Citizen confirmed accuracy..."
  }
  ```
