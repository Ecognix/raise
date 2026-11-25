# RAISE — Road Asset Intelligence and Safety Engine
### AI-Powered Road Monitoring & Maintenance Platform (Guwahati, Kamrup Metro, Assam)

**RAISE** is a government-grade digital dashboard designed for public works and municipal road departments (Assam PWD & Guwahati Municipal Corporation). It ingests automated computer vision surveillance findings, calculates societal lifeline priority rankings, monitors drainage flood vulnerabilities, and manages maintenance lifecycles across 25 key Guwahati road corridors.

---

## 🚀 Quick Start

Ensure you have **Node.js** (v18+) installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev
```

Open your browser at `http://localhost:5173/` (or the URL printed by Vite).

---

## 🏛️ System Architecture & Pages

| Page | Description | Key Features |
|---|---|---|
| **1. Overview** | Executive summary & triage | 6 KPI cards, Defects by Type bar chart, 6-Month Detection vs Repair trend line chart, Geospatial defect density mini-map preview. |
| **2. Road Condition Map** | Full-screen GIS Leaflet Map | OpenStreetMap tiles, colour-coded road polylines (Green: Good, Amber: Moderate, Red: Severe), custom defect pins, side drawer with camera inspection captures, and interactive **Verify Defect** button. Layer toggles for Defects, Roads, Flood-Risk Zones, and Drains. |
| **3. Lifeline Priority** | Consequence-of-Failure Ranking | Dynamic priority score (0–100) combining physical damage with hospital/emergency access, population dependent, and detour penalties. Includes **interactive weight sliders** that recalculate rankings live and visual stacked breakdown bars per road. |
| **4. Road Digital Passport** | Single-Asset Deep Dive | Searchable identity card for all 25 roads (length, contractor, year, ownership), inspection and repair timeline with expenditure ledger, and automatic **Recurring Failure Warnings** for chronic failure stretches (&gt;2 repairs). |
| **5. Drainage & Flood Risk** | Hydraulic & Monsoon Intelligence | Guwahati monthly precipitation bar chart with a 120mm flash-flood alert threshold, 15 drains/culverts condition register (Bharalu river, Deepor Beel, Mora Bharalu), and community cut-off impact analysis. |
| **6. Maintenance & Repairs** | 5-Stage Governance Kanban | Columns: *Detected &rarr; Verified &rarr; Assigned &rarr; Repaired &rarr; Verified after repair*. Features cost estimates (*Preliminary: requires engineer review*), before/after photo evidence modals, and **Reappeared** defect badges. |

---

## 🛡️ Trust & Statutory Rules Implemented

- **Data Provenance:** Every finding is strictly labelled as either **`AI-generated`** or **`Field-verified`**.
- **Financial Rule:** All repair cost estimates are explicitly tagged: *"Preliminary: requires engineer review"*.
- **Statutory Notice:** Persistent institutional footer note: *"AI findings support, and do not replace, engineering verification."*
- **Lifeline Core Principle:** *"A moderately damaged road that is the only access to a hospital can outrank a severely damaged road with alternatives."*

---

## 🔌 How to Replace Mock Data with a Real Backend / API

All datasets and data models are decoupled into `src/data/` and typed in `src/types.ts`:

```
src/
├── types.ts                # TypeScript interfaces (RoadSegment, Defect, DrainCulvert, Kanban)
├── data/
│   ├── roadsData.ts        # 25 Guwahati road segments with coordinates & attributes
│   ├── defectsData.ts      # 60 defects with GPS, severity, AI/field status
│   ├── drainsData.ts       # 15 drains & culverts with silt % & waterbodies
│   ├── rainfallData.ts     # Monthly rainfall & historical defect trends
│   ├── repairsData.ts      # Kanban workflow tasks with before/after photos
│   └── index.ts            # Formulas & exports
└── context/
    └── DataContext.tsx     # Central state provider (ready for REST / GraphQL hooks)
```

### Steps to connect your backend API:

1. **Replace Initial State in `src/context/DataContext.tsx`**:
   Currently, `DataContext.tsx` initializes state from `roadsData.ts`, `defectsData.ts`, etc. Swap the static initialization with `fetch` / `axios` or React Query:

   ```tsx
   // Example API integration in src/context/DataContext.tsx:
   useEffect(() => {
     async function loadRoads() {
       const res = await fetch('/api/v1/roads?district=KamrupMetro');
       const data = await res.json();
       setRoads(data);
     }
     loadRoads();
   }, []);
   ```

2. **Hook Up Mutation Handlers**:
   - `verifyDefect(defectId, engineerName)` &rarr; `POST /api/v1/defects/:id/verify`
   - `moveKanbanCard(cardId, newStatus)` &rarr; `PATCH /api/v1/maintenance/:id/status`
   - `updateDefectStatus(defectId, status)` &rarr; `PATCH /api/v1/defects/:id`

3. **Backend Endpoints Expected**:
   - `GET /api/v1/roads` &rarr; Array of `RoadSegment`
   - `GET /api/v1/defects` &rarr; Array of `Defect`
   - `GET /api/v1/drains` &rarr; Array of `DrainCulvert`
   - `GET /api/v1/maintenance/kanban` &rarr; Array of `MaintenanceKanbanCard`
   - `GET /api/v1/hydrology/rainfall` &rarr; Array of `RainfallRecord`
