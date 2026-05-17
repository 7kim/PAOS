# Elicitation Workflow

The project brief is always incomplete. This reference describes how to interview the user to fill the gaps before writing a single line of the SRS.

## The Three Tiers of Questions

**Critical** — cannot be inferred or defaulted. Must be answered by the user.
**Important** — sensible defaults exist. Offer the default, get sign-off.
**Nice-to-have** — enriches the SRS but not required.

Never start writing before every Critical question is answered.

---

## Critical Questions (Always Ask)

### C1. Authentication model

- Is there a user identity? If so, what providers? (Apple, Google, email+password, SSO, none)
- Does authentication require a backend? If the user says "no backend" but wants email+password, explain why that is architecturally inconsistent — password verification requires server-side storage.
- Pedagogical note: users often confuse "Firebase" with "OAuth." OAuth (Sign in with Apple, Google Sign-In) works natively without any backend. Firebase is one of many convenience wrappers. If the user believes OAuth requires Firebase, correct this misconception with an analogy (see skill root).

### C2. Backend vs local-only

- Is there a company-operated backend server? If yes, what does it store? If no, confirm the user understands the implications (no cross-device sync, no team features, no delivery tracking).
- What is the persistence layer on the device? (SwiftData, Core Data, SQLite, Room, Realm, IndexedDB, etc.)

### C3. Third-party integrations

- LLM provider (OpenAI, Anthropic, Google Gemini, local Ollama, etc.)?
- Where does the API key live? (Device keychain, backend proxy, bundled in binary — the last is almost never acceptable)
- Are there other third-party services? (analytics, crash reporting, payment, maps, etc.)

### C4. Platform and tech stack

- Which platforms? (iOS, Android, web, desktop, cross-platform)
- Which language/framework? (Swift/SwiftUI, Kotlin/Compose, React/Next, Flutter, etc.)
- Target OS versions / browser support?

### C5. Scope boundary

- Which features are MVP? Which are Scalable?
- If the user cannot articulate this, walk through each feature and ask "MVP or later?"

---

## Important Questions (Offer Defaults)

### I1. User roles

- Default: single role. Offer: agent/admin split, manager dashboard, RBAC.
- Every added role increases ERD and use-case complexity by ~30%. Don't add roles unless the user explicitly needs them.

### I2. Core entities

- Default: one root entity (e.g., Lead, Task, Project) plus supporting entities (Note, Tag, Attachment).
- Ask: "Does X have one Y or many Ys?" for each relationship.
- Document cardinality explicitly in the ERD.

### I3. Status / state machine

- Default: three states (`new`, `in-progress`, `done` or equivalent).
- Offer: custom pipeline stages as a Scalable feature.
- Always model the state transitions as a state-machine diagram.

### I4. Data portability

- Default: CSV export/import.
- Offer: iCloud sync (iOS), Google Drive backup, proprietary cloud.
- If the user chose "local-only," CSV export is the cross-device migration story. Document this explicitly.

### I5. Notifications and reminders

- Default: none in MVP.
- Offer: local notifications, push notifications (requires backend), in-app banners.

### I6. Email/messaging dispatch (if the project has an outbound-message feature)

- URL scheme (mailto:, whatsapp://) — no backend, user confirms in external app
- Native compose sheet (MFMailComposeViewController on iOS)
- API-based send (Gmail API, Twilio, SendGrid) — most power, most setup
- Pre-fill subject only, or subject + body? (Pre-filling body requires URL length awareness — cap AI-generated content at ~300 words)

---

## Nice-to-have Questions

- Design system / color palette preferences
- Brand name / domain availability check
- Analytics opt-in/opt-out policy
- Accessibility targets (WCAG level, Dynamic Type on iOS)
- Internationalization / localization
- Launch timeline and budget
- Who are the stakeholders?

---

## Interview Style

### Elicit, don't lecture

The user is the domain expert for their project. Your job is to surface what they already implicitly know.

### One question per turn when the answer depends on a prior answer

Asking "what's your auth model, your persistence layer, and your LLM provider?" in a single turn yields worse answers than three sequential questions.

### Use the ask_user_input tool

Multiple-choice questions are easier for users than free-form prompts. Offer 2–4 options per question. Use multi-select when the answer is a set of features, not a choice.

### Reflect back before writing

After elicitation, restate the full decision set to the user as a master checklist and get explicit "yes, proceed" before writing the SRS.

### Detect and correct misconceptions

When a user's answer implies a technical misunderstanding, pause and explain. Example: if they say "email+password without a backend," walk through why that's inconsistent and offer the two ways to resolve it (add a backend OR drop email+password for OAuth only).

### Document your rationale

Every non-obvious choice goes in §8.2.1 Design Rationales of the final document. Keep a running list during elicitation.

---

## Exit Criteria for Elicitation

You may begin writing the SRS only when:

- [ ] Every Critical question has an explicit answer from the user
- [ ] Every Important question has a default chosen (with user sign-off on the defaults)
- [ ] The user has seen and approved the master checklist
- [ ] Any misconceptions have been corrected and re-confirmed
- [ ] The MVP / Scalable scope split is crisp

If any of these are missing, continue elicitation. Do not proceed to writing.
