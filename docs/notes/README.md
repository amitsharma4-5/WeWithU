# WeWithU / ApnaCoach — Project Review Notes (Phases 4–6)

Study and review material for the backend half of this repository: how a request travels
from React to Express to MongoDB, how the four data models are shaped, and how the six
product features are wired end to end.

| File | What it is |
| --- | --- |
| `WeWithU-Project-Review-Notes.pdf` | **Main deliverable.** 38 A4 pages, print-ready, with a clickable outline and accurate page numbers. |
| `WeWithU-Project-Review-Notes.md` | Editable Markdown source of the same content (diagram placeholders are marked as captions). |
| `assets/cover.png` | Cover illustration used by the PDF. |

## Reading order

1. **Part I — Reading map.** Project snapshot, repository map, the six-step request model.
2. **Part II — Request lifecycle (Tasks 15–19).** Bootstrap, route files, `isAuth`, the
   current-user trace, HTTP status codes.
3. **Part III — Database and models (Tasks 20–23).** `connectDb`, all four schemas,
   create/read/update lifecycles, validation layers.
4. **Part IV — Core features (Tasks 24–29).** Interview flow, AI prompts, resume flows,
   the five-module placement drive, history/reports, static vs API-driven pages.
5. **Part V — Review pack.** Findings register, flow gallery, answer keys, viva questions,
   revision plan, demo script, glossary, one-page cheat sheet.

## How the notes are marked up

| Mark | Meaning |
| --- | --- |
| `code` | Inline code, file name or literal value |
| **NOTE** (blue) | Context that is not obvious from the code alone |
| **FINDING** (amber) | A real issue in this codebase, with file and severity in Part V |
| **SAY THIS IN REVIEW** (green) | A sentence to say out loud, almost word for word |
| **WATCH OUT** (red) | A common mistake or a risk that costs marks |

## Every claim is source-checked

The notes were written against the code in this repository, not against the phase text.
Where the two disagree, the difference is stated explicitly — most visibly the product name
(the material says *ApnaCoach*, the code is branded *WeWithU*) and the default port
(`process.env.PORT || 6000` in `server/index.js` versus `8000` in `.env.example` and in the
frontend default).

The highest-impact findings, all documented with file references and a suggested fix:

1. `savePlacementTest` updates a drive by id without checking `test.userId` (IDOR).
2. `getInterviewReport` returns any interview by id, also without an ownership check.
3. `createOrder` trusts client-supplied `amount` and `credits` (price tampering).
4. `isAuth` returns `400`/`500` where `401` is the conventional status.
5. The backend default port does not match the frontend default.

## Editing

The Markdown file is the source of truth for wording. The PDF was generated from it with a
custom layout engine (styled headings, callouts, tables, code blocks and ten diagrams);
re-running that generator after edits is a separate build step, so for small wording changes
prefer editing the Markdown and re-exporting with any Markdown-to-PDF tool that supports
tables and code blocks.
