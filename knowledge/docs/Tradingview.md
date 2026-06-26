---
title: "Tradingview — Scalping Bot v2"
description: "Enterprise trading operations dashboard for a self-hosted Binance Futures scalping bot — FastAPI UDF server, React frontend"
tags:
  - paos
  - architecture
  - reference
related:
  - "[[repos]]"
  - "[[_agent-conventions]]"
  - "[[session-protocol]]"
status: active
---

# Tradingview — Scalping Bot v2

**Path**: `~/Documents/Dev/Tradingview/`
**Status**: Active
**Last updated**: 2026-05-17

## Purpose

Enterprise trading operations dashboard for a self-hosted Binance Futures scalping bot.
Zero external data reporting — all OHLCV served locally via FastAPI UDF server. See [[repos]] for related project entries.

## Stack

| Layer | Technology |
|-------|-----------|
| Bot runtime | Python (bot.py, backtester.py) |
| Backend | FastAPI (api_server.py) — REST + UDF server |
| Frontend | React 18 + Vite + lightweight-charts (Advanced Charts) |
| State | Zustand + React Query |
| Charts | TradingView charting-library-tutorial pattern |
| Data | Binance Futures API (live) + mock data engine (dev) |

## Architecture Decisions

- **UDF server pattern**: FastAPI serves OHLCV data in TradingView UDF format — no external datafeed
- **Mock-first**: Dashboard works with mock data, real bot optional
- **Self-hosted charting**: lightweight-charts (open source), not the proprietary library
- **Bot + API separation**: `bot.py` (execution) and `api_server.py` (dashboard) are separate processes
- **Single requirements.txt**: no Poetry/pipenv — keep it simple for dev

## Code Conventions

- Python: snake_case, no type annotations on internals, FastAPI route handlers return dicts
- Frontend: camelCase, 2-space, ESM, Vite, React 18 (no RSC)
- Config: `bot_config.json` for bot parameters, env vars via `.env`
- Logging: `bot_output.log` and `trades.log` for audit trail, `trades.json` for state

## Documentation

- `README.md` — quick start
- `SRS.md` v2.1 — full architecture spec with reference repos
- `SETUP.md` — environment setup
- `CLAUDE.md` — agent instructions

## Key Files

| File | Purpose |
|------|---------|
| `bot.py` | Main trading bot — entry, signals, execution |
| `api_server.py` | FastAPI backend — REST + UDF server |
| `backtester.py` | Backtesting engine |
| `bot_config.json` | Bot parameters (symbols, leverage, sizing) |
| `dashboard/` | React + Vite frontend |
| `trades.json` | Live trade state |

## Lessons Learned

- TradingView charting-library-tutorial is the authoritative reference — follow its patterns
- WebSocket for live price feeds, SSE for bot status updates
- Keep bot.py stateless where possible — write to trades.json, don't hold state in memory
