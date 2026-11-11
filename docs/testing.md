# PlacePilot AI — Testing Documentation

## 1. Automated Unit Testing
Core deterministic application logic is decoupled into pure TypeScript modules and tested using Node's built-in test runner (`node:test`, `node:assert/strict`) via `npx --yes tsx --test`.

### Test Files:
1. `src/utils/rulesEngine.test.ts`:
   - `evaluateCondition` handles `equals` operator (state domicile check).
   - `evaluateCondition` handles `less_than_or_equal` operator (income ceiling check).
   - `evaluateCondition` handles `in` operator (education levels).
   - `evaluateSchemeEligibility` returns `ELIGIBLE` when all conditions pass.
   - `evaluateSchemeEligibility` returns `NOT_ELIGIBLE` when income exceeds threshold.
   - `evaluateSchemeEligibility` returns `ADDITIONAL_INFO_REQUIRED` when mandatory fields are missing.

2. `src/utils/formValidator.test.ts`:
   - Catches missing required fields.
   - Flags invalid email and Indian 10-digit telephone numbers.
   - Computes correct completion percentage and marks form valid when all required fields pass.

### Execution Command:
```bash
npx --yes tsx --test src/utils/rulesEngine.test.ts src/utils/formValidator.test.ts
```
**Results:** 9/9 tests pass with 0 failures.

---

## 2. Browser Verification (Playwright CLI)
Tested using headless Chromium via `playwright-cli`:
- **Viewport:** 1440x900 desktop standard.
- **Journeys Tested:**
  1. Landing page first paint and interactive widget.
  2. Scheme Saathi AI Assistant prompt submission with tool calling.
  3. Deterministic Eligibility Rules Engine matrix and Gazette reference citation.
  4. Document Readiness Studio OCR inspection.
  5. Application Form Studio prefill from profile & certificates.
  6. Human Approval Center affirmation locking and checksum generation.
  7. Official Government Portal Redirection modal with verified `.gov.in` domain badge.
- **Console Errors:** 0 errors.
