# Q&A Archive — test-project

---

## Q: Why is WebSocket wrapped in useRef instead of useState?
**A**: useRef avoids re-renders on every message — WebSocket is a side effect, not state that should trigger UI updates.

_Answered: 2026-05-17 14:31:10 UTC by claude_
