# Prompt: Design a 2-minute hackathon pitch deck for "LiftMeUp"

You are a presentation designer. Create a **10-slide, 16:9 deck** for a **2-minute pitch to hackathon judges**. Use only the facts below. Do not invent statistics, customers or quotes. Keep text on slides short: judges read a slide in about 5 seconds. Put one idea on each slide, and prefer big numbers, cards, tables and simple diagrams over bullet lists.

## Audience and goal
- Audience: hackathon judges (mixed technical and business).
- Goal: show a real problem, a working solution, smart use of public data, and a credible build.
- Tone: confident, plain English, no jargon without explanation.

## Design direction
- Mood: an elevator control panel crossed with a traffic light. Dark teal-black backgrounds alternating with warm light-grey slides, and one amber accent (like an elevator floor indicator lamp).
- Palette: ink `#0E1B1A`, card `#162826`, light `#F2F3EF`, text `#14211F`, amber `#F2B04A`, teal `#0C6B63`. Status colors: red `#E8665D` (Delinquent), amber `#F2B04A` (Warning), green `#5FCB84` (Compliant).
- Fonts: Bricolage Grotesque (headings, bold) and Figtree (body). Fall back to a clean sans-serif.
- Always pair status colors with a word (Delinquent / Warning / Compliant), never color alone.
- Recurring motif: a small floor-indicator panel (amber number and up-arrow on near-black) and red/amber/green pills.
- Keep text at 24pt or larger, titles at 60pt or larger, and contrast high. Leave generous margins. Use no stock photos of people. Simple flat icons or diagrams only.
- Make the data-flow slide a left-to-right 5-step diagram with numbered cards.

## Slide-by-slide content

### 1. Cover
- Eyebrow: "NYC Open Data hackathon pitch"
- Title: **LiftMeUp**
- Subtitle: "One ranked list of every elevator filing a New York property manager is responsible for."
- Three pills: Delinquent (red), Warning (amber), Compliant (green)
- Visual: floor-indicator panel showing "12" with an up-arrow

### 2. Explained like you're five
- Title: **A traffic light for elevators**
- Four cards:
  1. Buildings have elevators — "A property manager looks after lots of them."
  2. Each one must be checked — "Every year, with a bigger check every five years. The city must be told."
  3. Forget, and you pay — "Thousands of dollars per elevator, and more every month it stays late."
  4. LiftMeUp is the traffic light — "Red is late, yellow is soon, green is fine. Fix red first." (highlight this card)
- Bottom line: "Type in a building's address. LiftMeUp asks the city's public records what elevators are there, then tells you which are late."

### 3. The problem
- Title: "Property managers risk thousands in fines because no single system tracks recurring elevator deadlines across buildings."
- Three big-number cards:
  - **84,000+** registered elevators and escalators under NYC's Department of Buildings
  - **$3,000** fine per elevator for a missed annual (CAT1) filing, plus $150 a month late
  - **$5,000** fine per elevator for a missed five-year (CAT5) filing, plus $250 a month late
- Footnote: "Source: LiftMeUp product requirements, citing the NYC DOB Elevator Report. Fine amounts not yet checked against the primary NYC rule text."

### 4. The solution
- Title: **Type an address. Get a ranked ledger.**
- Four cards:
  - Auto-fill from the city: the address becomes a building ID, then its elevators and last filing dates load from NYC Open Data.
  - Live due dates: annual checks are due one year after the last filing, five-year checks after five. Edit a date and the ranking updates.
  - Money at risk: an open-violation badge on each elevator and an unpaid fine total for each building.
  - AI briefing: one click writes a short summary of what is late, what is next and what it may cost.

### 5. The ledger (example screen)
- Title: **Red first, then yellow, then green**
- Table (illustrative rows, label them as examples):

| Building | Device | Type | Due | Status |
|---|---|---|---|---|
| Tower A | EL-3 | Annual | 2026-03-01 | Delinquent, past due |
| Harbor Plaza | EL-1 | 5-year | 2026-11-20 | Warning, due soon |
| Midtown Lofts | EL-2 | Annual | 2027-06-15 | Compliant |

- Footnote: "Example rows for illustration. Sorted by status, then earliest due date. Warning means due within 30 days."

### 6. How NYC Open Data is used (diagram)
- Title: **Address in, ranked risk out**
- Five numbered cards, left to right:
  1. **GeoSearch v2** (NYC Planning): turns the typed address into a building ID (BIN). Asks the user to pick when two buildings match.
  2. **Elevator Safety Compliance** (dataset `e5aq-a4j2`): returns the building's devices and their latest annual and five-year filing dates.
  3. **Safety Violations** (dataset `855j-jady`): flags each elevator with an active violation. One batched call for the whole ledger.
  4. **ECB Violations** (dataset `6bgk-3dad`): adds up the unpaid fine balance for every building. One batched call.
  5. **Claude Haiku 4.5** (Anthropic API): turns the ledger and fine totals into a short written briefing, on click.
- Footer line: "Plain HTTPS requests from the Django backend. No API key needed, and the browser never calls NYC directly."

### 7. Data breakdown (table)
- Title: **Four sources, each joined on one key**

| Source | Join key | Level | Gives us | Powers |
|---|---|---|---|---|
| GeoSearch v2 | Address text | Building | Building ID, label, borough | Address lookup and picker |
| e5aq-a4j2 | bin | Device | Device number, status, filing dates | Auto-filled elevators and due dates |
| 855j-jady | device_number | Device | Active or resolved status | Open-violation badge |
| 6bgk-3dad | bin | Building | balance_due on summonses | Unpaid fines per building |

- Callout: "Fines are per building because the fine feed has no device ID. The violation flag is per elevator. This split is a documented product decision."

### 8. Tech stack (6 cards)
- Frontend — React 19, TypeScript, Vite: ledger, timeline, detail drawer and the AI briefing panel.
- Backend — Django 6, Django REST Framework: due-date engine and the clients for the NYC endpoints.
- Database — PostgreSQL: stores only the buildings and elevators a manager enters. Status is computed, never stored.
- AI — Claude Haiku 4.5: writes the briefing from ledger rows and fine totals. (highlight)
- Quality — pytest, Vitest, Playwright: test-first, a 90% coverage gate and accessibility checks.
- Delivery — GitHub Actions, Render: CI on every change, then deployed as two services and a database.

### 9. Who it helps
- Title: **Beneficiaries and potential clients**
- Left, "Who benefits":
  - Property managers: fewer missed filings, one view of every building
  - Building owners: read-only visibility into compliance
  - Tenants and the public: fewer lapses in elevator safety paperwork
- Right, "Who could buy it":
  - Commercial property management firms
  - REITs and owners of NYC office towers
  - Co-op and condo boards
  - Hospitals, universities and hotels
  - Elevator inspection contractors
  - Insurers and lenders
- Footnote: "Managers and owners come from the product requirements. The wider client list is the team's extension."

### 10. Close (statement slide, amber background, dark text)
- Small label: LiftMeUp
- Statement: "The data was always public. We turned it into a ranked to-do list that saves money."
- Small line: "Built on NYC Open Data, Django, React and Claude."

## Output requirements
- Deliver editable slides (Google Slides or PowerPoint format) if you can, otherwise a slide-by-slide layout description with exact text.
- Add a short speaker-notes line per slide (one sentence each), but keep the on-slide text exactly as written above.
- Target pace: about 12 seconds per slide, so the whole deck runs in 2 minutes.
- Keep all facts, numbers and dataset IDs exactly as written.

## Reference: project facts (for accuracy only, do not add extra slides)
- Repo: github.com/vim719/LiftMeUp. Python/Django 6 + DRF backend, React 19 + TypeScript + Vite frontend, PostgreSQL, deployed on Render.
- Status rules: annual (CAT1) due 1 year after last filing; five-year (CAT5) due 5 years after; Warning = due within 30 days; Delinquent = past due. Computed on every read, not stored.
- Address lookup returns ambiguous matches (for example "200 Water St" exists in two boroughs) as a picker, never silently the first result.
- Only active devices are imported. A device with both filing dates becomes two ledger rows.
- Manual entry always works for devices missing from the public dataset.
- The AI briefing runs only on click, uses Claude Haiku 4.5 at low temperature, and fails gracefully if unavailable.
