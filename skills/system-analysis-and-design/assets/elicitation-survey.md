# Project Intake Survey

Fill out every section. This survey is the single source of truth for the SRS. Answers marked **CRITICAL** must be explicit — do not default.

---

## Section A — Project Identity

**A1. Project name:**

**A2. One-sentence description (the "elevator pitch"):**

**A3. Target users (one or more user classes):**

**A4. The core job-to-be-done (what does this solve that no existing tool solves?):**

**A5. Working domain name (optional):**

---

## Section B — Platform & Tech Stack [CRITICAL]

**B1. Target platform(s):** ☐ iOS ☐ Android ☐ Web ☐ Desktop ☐ Cross-platform (specify framework)

**B2. Programming language + UI framework:**

**B3. Target OS versions / browser support:**

**B4. IDE / build system:**

**B5. Persistence technology:** ☐ SwiftData ☐ Core Data ☐ Room ☐ SQLite ☐ Realm ☐ IndexedDB ☐ Other:

---

## Section C — Authentication [CRITICAL]

**C1. Is there a user identity in this system?** ☐ Yes ☐ No

**C2. If yes, which providers?** ☐ Sign in with Apple ☐ Google Sign-In ☐ Facebook ☐ Microsoft ☐ Email+password ☐ Passkeys ☐ Other:

**C3. Is there a backend for auth?** ☐ No (OAuth SDKs handle it locally) ☐ Yes — managed (Firebase, Auth0, Clerk, Supabase) ☐ Yes — custom

**C4. User role model:** ☐ Single role ☐ Admin + User ☐ Manager + Agent ☐ Custom RBAC

**C5. Session lifetime and logout behavior:**

---

## Section D — Data & Persistence [CRITICAL]

**D1. Is data stored:** ☐ Only on user's device ☐ Only in cloud ☐ Hybrid (specify split)

**D2. At-rest encryption:** ☐ Platform default (e.g. FileProtectionType.complete) ☐ Custom (describe)

**D3. Cross-device sync?** ☐ None (MVP) ☐ iCloud (CloudKit) ☐ Google Drive ☐ Custom backend ☐ Other

**D4. Data portability:** ☐ CSV export/import ☐ JSON export ☐ Native backup ☐ None

**D5. Is there any shared / multi-user data?** ☐ No ☐ Yes (describe in Section J)

---

## Section E — Core Entities [CRITICAL]

List every entity in the system. For each, note the type (primary / child / relationship).

| Entity | Type | Purpose | Key Fields |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

For each pair of related entities, specify cardinality:

| Entity A | Relationship | Entity B |
|---|---|---|
| A | one-to-many | B |

---

## Section F — Core User Flows [CRITICAL]

List the 3–7 primary user flows. For each, describe the steps in 5–10 bullets.

### Flow 1: [Name]
1. 
2. 
3. 

### Flow 2: [Name]
1. 

### Flow 3: [Name]
1. 

---

## Section G — Third-Party Integrations [CRITICAL]

| Service | Purpose | API Access Method | Credential Storage |
|---|---|---|---|
| | | | |

**G1. If using an LLM/AI:**
- Provider (OpenAI / Anthropic / Gemini / Ollama / etc.):
- Model:
- Where does the API key live? ☐ Device keychain ☐ Backend proxy ☐ User-provided (BYOK)
- What data is sent to the LLM? (Be specific — minimize!)

**G2. Payment / subscriptions?** ☐ None ☐ In-app purchase (App Store / Play) ☐ Stripe ☐ Other

**G3. Analytics / crash reporting?** ☐ None ☐ Apple / Google built-in ☐ Firebase ☐ Sentry ☐ Mixpanel ☐ Other

---

## Section H — Output / Dispatch (if applicable)

Does the system send emails, messages, notifications, or generate files?

**H1. Email?** ☐ None ☐ URL scheme (mailto:) ☐ Native compose sheet ☐ API-based (Gmail API, SendGrid, etc.)
**H2. Other messaging?** ☐ SMS ☐ WhatsApp ☐ Slack ☐ Other
**H3. Notifications?** ☐ None ☐ Local ☐ Push ☐ Both
**H4. File generation?** ☐ None ☐ PDF ☐ CSV ☐ Excel ☐ Other

---

## Section I — Status / Lifecycle Model

If entities in the system have a lifecycle:

**I1. Primary entity name:**
**I2. States:**  (e.g. New → Active → Closed)
**I3. Transitions:**  (who can move it, when)

---

## Section J — Collaboration & Multi-User (SCALABLE)

Even if the MVP is single-user, note here what the scalable release should support:

**J1. Team workspaces?** ☐ No ☐ Yes
**J2. Invitation flow:**
**J3. Shared resources:** ☐ Templates ☐ Pipelines ☐ Contacts ☐ Other
**J4. Roles:**

---

## Section K — Non-Functional Targets [IMPORTANT]

**K1. Performance:**
- Primary action latency target (e.g. OCR ≤ 2s):
- Memory ceiling:
- CPU ceiling:
- Binary size ceiling:
- Storage ceiling:
- Network round-trip ceiling:

**K2. Security / Privacy:**
- At-rest encryption: (see D2)
- TLS version floor:
- Token handling: ☐ SDKs only ☐ Custom (explain)
- PII logging policy:
- GDPR / CCPA compliance explicitly required? ☐ Yes ☐ No

**K3. Usability:**
- Accessibility target (WCAG / Dynamic Type / platform audit):
- Max number of taps/clicks in the primary flow:
- Localization: ☐ English only ☐ Other languages (list)

**K4. Reliability:**
- MTBF target:
- Degradation strategy when third-party services fail:

---

## Section L — Scope Boundary [CRITICAL]

For each feature area, mark `MVP` or `Scalable`:

| Feature Area | MVP | Scalable |
|---|---|---|
| Authentication | ☐ | ☐ |
| Core capture | ☐ | ☐ |
| Core management (CRUD) | ☐ | ☐ |
| Search / filter | ☐ | ☐ |
| AI / intelligence | ☐ | ☐ |
| Dispatch / output | ☐ | ☐ |
| Settings / preferences | ☐ | ☐ |
| Data portability (CSV) | ☐ | ☐ |
| Dashboard / analytics | ☐ | ☐ |
| Cross-device sync | ☐ | ☐ |
| Team / multi-user | ☐ | ☐ |
| Notifications / reminders | ☐ | ☐ |
| Advanced analytics | ☐ | ☐ |
| [Add project-specific] | ☐ | ☐ |

---

## Section M — Project Timeline & Resources

**M1. Start date:**
**M2. Target MVP completion:**
**M3. Target scalable release:**
**M4. Team size and roles:**
**M5. Budget or constraint notes:**

---

## Section N — Risks You Already Know About

List every risk you are already aware of, with mitigation.

| Risk | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation |
|---|---|---|---|
| | | | |
| | | | |

---

## Section O — Existing Assets

**O1. Do you have screenshots, wireframes, or mockups?** (Attach or link)
**O2. Do you have a brand identity / logo?**
**O3. Do you have existing code to reference?**
**O4. Are there competitor products you are explicitly modeling on or against?**

---

## Section P — Open Questions for the AI Agent

List any design questions where you want the agent to recommend an approach rather than commit to one:

1. 
2. 
3. 

---

## Sign-off

By filling out this survey truthfully, you give the AI agent enough context to produce a tailored SRS. The more specific and honest the answers, the more defensible the resulting document.

**Name:**
**Date:**
**Signature (initials):**
