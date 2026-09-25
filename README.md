# Thailand Real-Time Incident & Situation Intelligence Platform

Production-Grade Real-Time Crowdsourced Geospatial Incident Reporting and Public Transit Disruption Monitoring System for Thailand.

---

## 1. System Overview

Thailand Real-Time Incident & Situation Intelligence Platform is a mission-critical geospatial web system designed to ingest, process, verify, and visualize real-time situational events across Thailand. The platform aggregates multi-source intelligence—including citizen crowdsourced reports, meteorological sensor telemetry, and expressway traffic data—into a unified geospatial operating picture.

### Key Capabilities

* Geospatial Event Streaming: Real-time event ingestion and low-latency delivery to client viewports via Server-Sent Events (SSE).
* Multi-Modal Incident Tracking: Tailored domain models for urban flash floods, traffic bottlenecks, traffic accidents, infrastructure closures, mass transit disruptions, and emergencies.
* Dual Verification Consensus: Continuous confidence scoring incorporating community upvoting/downvoting, distance decay, and agency corroboration.
* Automated Meteorological Ingestion: Real-time telemetry integration with Thailand Meteorological Department (TMD) radar stations and rain monitoring networks.
* Mass Transit Telemetry Layer: Route network and live disruption status tracking for BTS Green Lines, MRT Blue/Purple/Yellow/Pink Lines, Airport Rail Link, and SRT Red Lines.
* Strict Separation of Concerns: Next.js App Router server runtime, headless Prisma ORM with connection pooling, and PostGIS-compatible PostgreSQL data store.

---

## 2. High-Level System Architecture

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT TIER                                        |
|  Next.js 16 (React 19) SPA | Leaflet GIS Engine | Web Push API | SSE Consumer Client  |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            | HTTPS / EventStream
                                            v
+---------------------------------------------------------------------------------------+
|                                  APPLICATION TIER                                     |
|                                                                                       |
|  +--------------------+   +-----------------------+   +----------------------------+  |
|  |   API Gateway      |   | Real-Time Event Bus   |   |   Background Ingestion     |  |
|  | - Rate Limiter     |   | - SSE Broadcaster     |   | - TMD Meteorological Radar |  |
|  | - Zod Validator    |   | - Pub/Sub Hub         |   | - EXAT / DOH Highway Feeds |  |
|  | - Spatial Filter   |   | - Reconnect Handler   |   | - Transit Schedule Poller  |  |
|  +---------+----------+   +-----------+-----------+   +-------------+--------------+  |
|            |                          |                             |                 |
|            +--------------------------+-----------------------------+                 |
|                                       v                                               |
|                    +-------------------------------------+                            |
|                    |     Domain & Consensus Engine       |                            |
|                    | - Duplicate Detection (350m radius) |                            |
|                    | - Community Trust Scoring           |                            |
|                    | - Auto-Expiry & Resolution State    |                            |
|                    +------------------+------------------+                            |
+---------------------------------------|-----------------------------------------------+
                                        v
+---------------------------------------------------------------------------------------+
|                                  PERSISTENCE TIER                                     |
|                                                                                       |
|  +---------------------------------------+   +-------------------------------------+  |
|  |          Prisma ORM Client            |   |         Connection Pooler           |  |
|  | - Connection Management               |-->| - Neon PgBouncer Pooler             |  |
|  | - Schema Migrations & Types           |   | - SSL/TLS Transport Security        |  |
|  +---------------------------------------+   +------------------+------------------+  |
|                                                                 v                     |
|                                              +-------------------------------------+  |
|                                              |      Neon Serverless PostgreSQL     |  |
|                                              | - Relational Schema                 |  |
|                                              | - Spatial & Compound Indexes        |  |
|                                              | - JSONB Domain Metadata             |  |
|                                              | - Immutable Audit Logging           |  |
|                                              +-------------------------------------+  |
+---------------------------------------------------------------------------------------+
```

---

## 3. Core Architectural Subsystems

### 3.1 Real-Time Broadcast Architecture (Server-Sent Events)

The platform utilizes a reactive, uni-directional streaming pipeline over Server-Sent Events (SSE) via `/api/realtime`.

* Event Pipeline: Client browsers establish a persistent HTTP streaming connection with `text/event-stream`. The server runtime assigns client listeners to an in-memory Pub/Sub dispatcher (`RealtimeBroadcaster`).
* Broadcast Triggers: Mutating operations (`POST /api/incidents`, `/api/incidents/:id/confirm`, `/api/sync`) emit strongly typed event envelopes (`incident.created`, `incident.updated`, `incident.confirmed`, `incident.disputed`, `incident.resolved`).
* Connection Resilience: Connections maintain keep-alive heartbeats every 25 seconds. Client engines employ exponential backoff reconnection strategies with optimistic state reconciliation upon reconnection.

### 3.2 Geospatial Engine and Coordinate System

* Spatial Reference: Coordinates are standardized on WGS 84 (EPSG:4326).
* Client Viewport Decoupling: Map tile rendering operates inside an isolated CSS stacking context (`isolation: isolate; z-index: 0`) preventing map pane leakage over upper interface layers.
* Distance and Proximity Engine: Point-to-point and point-to-user proximity evaluations use the Haversine great-circle formula:
  $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
  where $R = 6,371\text{ km}$.
* Dynamic Layer Switcher: Real-time toggling between OpenStreetMap Standard Street Vector, High-Resolution Satellite Hybrid Imagery, and CartoDB Dark Matter telemetry overlays.

### 3.3 Duplicate Detection & Conflict Heuristics

To prevent fragmented reports for the same physical occurrence:
* Proximity Radius: Reports matching identical category types within a 350-meter threshold ($r \le 350\text{ m}$) trigger automated duplicate warnings.
* Time-Window Clustering: Incidents reported within 60 minutes of each other inside the spatial cluster are flagged for administrative consolidation or linked as corroborating timeline events.

### 3.4 Community Consensus & Verification Model

Data accuracy is calculated through a multi-factor confidence engine:
* Confidence Levels: `LOW` (Single unverified report), `MEDIUM` (Multiple community confirmations), `COMMUNITY_VERIFIED` (Confirmation threshold $\ge 5$, dispute ratio $< 5\%$), and `OFFICIAL_VERIFIED` (Confirmed by verified agency or meteorological station).
* Trust Metrics: User upvotes (`confirmCount`) and disputes (`disputeCount`) determine visibility priority and badge assignment.
* Lifecycle Progression: Incidents transition automatically through state machines:
  $$\text{ACTIVE} \longrightarrow \text{MONITORING} \longrightarrow \text{RESOLVED} \mid \text{EXPIRED}$$

---

## 4. Database Schema & Data Models

The persistence layer is defined via Prisma ORM targeting PostgreSQL.

```
+--------------------+       +-----------------------+       +---------------------+
|       users        |       |       incidents       |       |   incident_images   |
+--------------------+       +-----------------------+       +---------------------+
| id (UUID, PK)      |<---+  | id (VARCHAR, PK)      |<---+  | id (UUID, PK)       |
| username (UNIQUE)  |    |  | type (ENUM)           |    |--| incidentId (FK)     |
| email (UNIQUE)     |    +--| createdById (FK)      |    |  | url (TEXT)          |
| role (ENUM)        |       | title (VARCHAR)       |    |  | caption (TEXT)      |
| reputation (INT)   |       | description (TEXT)    |    |  +---------------------+
| isBanned (BOOLEAN) |       | latitude (FLOAT8)     |    |
+--------------------+       | longitude (FLOAT8)    |    |  +---------------------+
                             | locationName (VARCHAR)|    |  |  incident_updates   |
                             | severity (ENUM)       |    |  +---------------------+
                             | status (ENUM)         |    |--| id (UUID, PK)       |
                             | source (ENUM)         |    |  | incidentId (FK)     |
                             | confidence (ENUM)     |    |  | action (VARCHAR)    |
                             | confirmCount (INT)    |    |  | description (TEXT)  |
                             | disputeCount (INT)    |    |  +---------------------+
                             | metadata (JSONB)      |    |
                             | createdAt (TIMESTAMPTZ|    |  +---------------------+
                             | updatedAt (TIMESTAMPTZ|    |  |    confirmations    |
                             +-----------------------+    |  +---------------------+
                                                          +--| id (UUID, PK)       |
                                                          |  | incidentId (FK)     |
                                                          |  | isStillActive (BOOL)|
                                                          |  +---------------------+
                                                          |
                                                          |  +---------------------+
                                                          |  |      comments       |
                                                          |  +---------------------+
                                                          +--| id (UUID, PK)       |
                                                             | incidentId (FK)     |
                                                             | message (TEXT)      |
                                                             +---------------------+
```

### Indexed Access Paths

* `incidents(latitude, longitude)` — Spatial range filtering and bounding box lookups.
* `incidents(type, status)` — Fast filtering by category and lifecycle state.
* `incidents(createdAt DESC)` — Reverse chronological feed pagination.
* `confirmations(incidentId, userId)` — Idempotent verification enforcement.

---

## 5. API Reference

All requests accept and return standard `application/json` payloads unless otherwise specified.

### 5.1 Incident Ingestion and Querying

#### List Incidents
```http
GET /api/incidents
```
Query Parameters:
* `type` (optional): Comma-separated list (`FLOOD`, `TRAFFIC`, `ACCIDENT`, `ROAD_CLOSED`, `TRANSIT`, `EMERGENCY`, `GENERAL`).
* `severity` (optional): `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
* `status` (optional): `ACTIVE`, `MONITORING`, `RESOLVED`, `EXPIRED`.
* `q` (optional): Text search matching title, location, or district.
* `lat`, `lng`, `radius` (optional): Geospatial radius search in kilometers.

#### Create Incident Report
```http
POST /api/incidents
Content-Type: application/json
```
```json
{
  "type": "FLOOD",
  "title": "Flash flooding on Ratchadaphisek Road",
  "description": "30-40cm standing water across left two lanes fronting Criminal Court.",
  "latitude": 13.8185,
  "longitude": 100.5750,
  "locationName": "Ratchadaphisek Road in front of Criminal Court",
  "district": "Chatuchak",
  "province": "Bangkok",
  "severity": "MEDIUM",
  "floodDetails": {
    "waterLevelCm": 35,
    "waterLevelCategory": "30-50cm",
    "smallCarPassable": false,
    "largeTruckPassable": true,
    "roadBlocked": false
  }
}
```

### 5.2 Verification and Consensus

* `POST /api/incidents/:id/confirm` — Increment incident confirmation count.
* `POST /api/incidents/:id/dispute` — Record community dispute or expiration notice.
* `GET /api/incidents/:id/comments` — Retrieve community field notes and updates.
* `POST /api/incidents/:id/comments` — Append field note with optional official authority badge.

### 5.3 Infrastructure and Transit Telemetry

* `GET /api/transport` — Current operational status of BTS, MRT, ARL, and SRT rail lines including delay intervals and affected stations.
* `GET /api/dashboard` — Aggregated situation metrics, severity breakdowns, and hotspot analytics.
* `GET /api/sync` — Trigger upstream synchronization with meteorological radar and highway accident networks.
* `GET /api/realtime` — Persistent SSE event stream for live client synchronization.

---

## 6. Security Model and Hardening

1. Zero Secrets in Version Control: Production secrets and connection credentials are strictly excluded via `.gitignore` and enforced using automated scanner rules.
2. Parameterized Database Queries: All data access executes via Prisma ORM with parameterized SQL, eliminating SQL injection vectors.
3. Schema Validation: All user-submitted payloads are validated at the API boundary using Zod schemas with type-safe coercion and bounds checking.
4. Leaflet Viewport Sandboxing: Map canvases are isolated with strict z-index constraints, preventing click-jacking or UI overlay attacks.
5. Immutable Audit Trails: Administrative overrides (`RESOLVE`, `DELETE`, `HIDE`, `BAN`) are logged into immutable `audit_logs` records.

---

## 7. Deployment and Operations

### Local Development Setup

1. Clone repository:
   ```bash
   git clone https://github.com/satetapongsa/alert.git
   cd alert
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Populate `.env` with your secure connection string:
   ```env
   DATABASE_URL="postgresql://username:password@host-pooler.region.neon.tech/neondb?sslmode=require"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

4. Push database schema to PostgreSQL:
   ```bash
   npx prisma db push
   ```

5. Execute seed pipeline:
   ```bash
   node prisma/seed.mjs
   node scripts/sync-online-data.mjs
   ```

6. Start development server:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000`.

### Production Build and Run

```bash
npm run build
npm run start
```

---

## 8. License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
