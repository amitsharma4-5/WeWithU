# WeWithU / ApnaCoach — Project Review Notes (Phases 4–6)

Study and review material for the backend half of this repository: how a request travels
from React to Express to MongoDB, how the four data models are shaped, and how the six
product features are wired end to end.

| File | What it is |
| --- | --- |
| `WeWithU-Project-Review-Notes-Complete.pdf` | **Single-file edition.** Everything below in one 42-page PDF: the 38-page notes, then the 4-page card. Prints as one job, shares as one attachment. |
| `WeWithU-Project-Review-Notes.pdf` | **Main deliverable.** 38 A4 pages, print-ready, with a clickable outline and accurate page numbers. |
| `WeWithU-Review-Day-Card.pdf` | **4-page companion** for the day itself: coverage map, backend card, data card, feature card with all fifteen answer keys. |
| `WeWithU-Project-Review-Notes.md` | Editable Markdown source of the main notes (diagram placeholders are marked as captions). |
| `assets/cover.png` | Cover illustration used by the main PDF. |

Start with the main PDF once. On review day, print only `WeWithU-Review-Day-Card.pdf` — it fits on
four pages and repeats the highest-value facts in a scannable form.

## The single-file edition

`WeWithU-Project-Review-Notes-Complete.pdf` is the notes and the card bound together, with nothing
re-typeset:

| | Pages | Page labels | Why |
| --- | --- | --- | --- |
| Notes | 1–38 (PDF pages 1–38) | `1`–`38` | Keeps every "see page 17" reference printed in the card correct. |
| Card | 1–4 (PDF pages 39–42) | `C1`–`C4` | The card keeps its own printed `01 / 04`–`04 / 04` footer. |

It opens with the bookmark panel showing seven sections (Cover, Parts I–V, Review-day card) and
every task and Part V sub-section nested underneath. Page 2 carries a small green note pointing at
the card and linking to page C1, because the original contents page predates it.

Print double-sided: 42 pages is 21 sheets. For the review day itself, print only the card (pages
39–42, or the separate four-page file).

## The four card pages

| Page | Contents |
| --- | --- |
| 1 · Coverage map | Every sub-point of Tasks 15–29 and the PDF page that explains it, plus where the phase text and the code disagree, so you can prove nothing was dropped. |
| 2 · Backend card | Bootstrap order, middleware contributions, the eight mounts, `isAuth` statements, status-code table, six-step tracing method. |
| 3 · Data card | Connection code, the four schemas with the rules to quote, create/read/update calls, Mongoose method table, validation layers, gaps to name. |
| 4 · Feature card | Interview and placement request sequences, the `askAi` contract, all fifteen practice answer keys, static vs API-driven pages, demo script, closing line. |

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
