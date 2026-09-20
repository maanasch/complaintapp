# Aaple BMC (prototype)

Low/mid-fidelity prototype of a citizen complaint-filing app that acts as a new input
channel into BMC's existing complaint redressal backend. Frontend only, no persistence.

**Flows**

- Home → category shortcuts, open reports, around-you summary
- Report → My reports / File a report / Check a complaint number
- File a report → **Say it** (scripted assistant, mic + quick replies) or **Type it**
  (Photo → What → Where → Review → Complaint number)
- Around Me → nearby issues with before/after

**Languages:** English, Hindi, Marathi — toggle on every screen (persisted in localStorage).

**Stack:** React + Vite, React Router, Anek Latin / Anek Devanagari. Mascot and logo are vector stand-ins in `src/brand.jsx`. Deploys to Vercel as-is.

```bash
npm install
npm run dev
```
