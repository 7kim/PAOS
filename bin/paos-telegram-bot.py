"""
PAOS Telegram Pipeline Bot

Companion to the Hermes Telegram gateway that adds inline keyboards
for pipeline management. Runs alongside Hermes — handles pipeline
commands with buttons, Hermes handles everything else.

Usage:
  python3 bin/paos-telegram-bot.py

Requires:
  - TELEGRAM_BOT_TOKEN in env or config/secrets/.env
  - PAOS dashboard running on localhost:3333
"""

import os
import sys
import json
import urllib.request
import urllib.error
import urllib.parse
import logging
import asyncio
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("paos-bot")

# ── Config ──────────────────────────────────────────────────────────────

HOME = os.environ.get("HOME", "/home/dev")
ENV_PATH = os.path.join(HOME, "AI_Workflow", "config", "secrets", ".env")

# Load token from .env
BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
if not BOT_TOKEN:
    try:
        with open(ENV_PATH) as f:
            for line in f:
                line = line.strip()
                if line.startswith("TELEGRAM_BOT_TOKEN="):
                    BOT_TOKEN = line.split("=", 1)[1].strip().strip('"').strip("'")
    except FileNotFoundError:
        pass

if not BOT_TOKEN:
    log.error("TELEGRAM_BOT_TOKEN not found. Set it in config/secrets/.env or env.")
    sys.exit(1)

DASHBOARD_URL = os.environ.get("DASHBOARD_URL", "http://localhost:3333")
API_TOKEN = os.environ.get("API_TOKEN", "")

# Import telegram libraries
try:
    from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
    from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters
except ImportError:
    log.error("python-telegram-bot not installed. Run: pip install python-telegram-bot")
    sys.exit(1)

# ── API Helper ──────────────────────────────────────────────────────────

def api_get(path: str) -> dict:
    """Call PAOS dashboard API."""
    url = f"{DASHBOARD_URL}/api/{path}"
    headers = {}
    if API_TOKEN:
        headers["Authorization"] = f"Bearer {API_TOKEN}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        log.warning(f"API error: {e}")
        return {"error": str(e)}

# ── Keyboard Builders ───────────────────────────────────────────────────

def main_keyboard():
    """Main pipeline management keyboard."""
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("📋 List Pipelines", callback_data="pipe_list")],
        [InlineKeyboardButton("🔍 Check Status", callback_data="pipe_status"),
         InlineKeyboardButton("➕ New Pipeline", callback_data="pipe_new")],
        [InlineKeyboardButton("📅 Schedule", callback_data="pipe_schedule"),
         InlineKeyboardButton("🔎 Search Docs", callback_data="pipe_search")],
        [InlineKeyboardButton("❌ Close", callback_data="pipe_close")],
    ])

def back_keyboard():
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("◀ Back to Menu", callback_data="pipe_main")]
    ])

# ── Handlers ────────────────────────────────────────────────────────────

async def start(update: Update, context):
    """Handle /start command."""
    await update.message.reply_text(
        "🤖 *PAOS Pipeline Bot*\n\n"
        "Manage pipelines from Telegram.\n\n"
        "Use the buttons below or type /pipeline to open the menu.",
        parse_mode="Markdown",
        reply_markup=main_keyboard(),
    )

async def pipeline_command(update: Update, context):
    """Handle /pipeline command."""
    await update.message.reply_text(
        "📋 *PAOS Pipeline Menu*",
        parse_mode="Markdown",
        reply_markup=main_keyboard(),
    )

async def button_handler(update: Update, context):
    """Handle inline keyboard button presses."""
    query = update.callback_query
    await query.answer()
    data = query.data

    if data == "pipe_main":
        await query.edit_message_text(
            "📋 *PAOS Pipeline Menu*",
            parse_mode="Markdown",
            reply_markup=main_keyboard(),
        )

    elif data == "pipe_close":
        await query.edit_message_text("✅ Menu closed. Send /pipeline to reopen.")

    elif data == "pipe_list":
        result = api_get("pipelines?limit=5")
        pipes = result.get("pipelines", [])
        if "error" in result:
            text = f"❌ Error: {result['error']}"
        elif not pipes:
            text = "📭 No pipelines found."
        else:
            lines = ["📋 *Recent Pipelines:*\n"]
            for p in pipes[:5]:
                status_emoji = {
                    "completed": "✅", "running": "🔄", "pending": "⏳",
                    "failed": "❌", "submitted": "📝",
                }.get(p.get("status", ""), "❓")
                pid = p.get("id", "?")
                prompt = (p.get("prompt") or "?")[:60]
                lines.append(f"{status_emoji} `{pid}` — {prompt}")
            lines.append(f"\n_Total: {len(pipes)} shown_")
            text = "\n".join(lines)
        await query.edit_message_text(text, parse_mode="Markdown", reply_markup=back_keyboard())

    elif data == "pipe_status":
        result = api_get("pipelines?limit=5")
        pipes = result.get("pipelines", [])
        if "error" in result:
            text = f"❌ Error: {result['error']}"
        elif not pipes:
            text = "📭 No pipelines to check."
        else:
            lines = ["🔍 *Pipeline Statuses:*\n"]
            for p in pipes[:5]:
                pid = p.get("id", "?")
                status = p.get("status", "?")
                progress = f"{p.get('completedTasks', 0)}/{p.get('totalTasks', 0)}"
                lines.append(f"• `{pid}` — *{status}* ({progress})")
            lines.append("\n_Tap a specific pipeline ID to see details_")
            text = "\n".join(lines)
        await query.edit_message_text(text, parse_mode="Markdown", reply_markup=back_keyboard())

    elif data == "pipe_new":
        await query.edit_message_text(
            "➕ *New Pipeline*\n\n"
            "Send me a message with your pipeline prompt.\n"
            "Example: `Build a REST API for user management`\n\n"
            "I'll create a pipeline from it.",
            parse_mode="Markdown",
            reply_markup=back_keyboard(),
        )
        context.user_data["awaiting_prompt"] = True

    elif data == "pipe_schedule":
        await query.edit_message_text(
            "📅 *Schedule a Pipeline*\n\n"
            "Send: `prompt | schedule`\n\n"
            "Schedule options: `every-30m`, `every-1h`, `daily`, `weekly`, or a cron expression.\n\n"
            "Example: `Check disk space | daily`",
            parse_mode="Markdown",
            reply_markup=back_keyboard(),
        )
        context.user_data["awaiting_schedule"] = True

    elif data == "pipe_search":
        await query.edit_message_text(
            "🔎 *Search Knowledge*\n\n"
            "Send a search query and I'll search PAOS documentation.",
            parse_mode="Markdown",
            reply_markup=back_keyboard(),
        )
        context.user_data["awaiting_search"] = True

async def message_handler(update: Update, context):
    """Handle text messages (for pipeline creation, scheduling, search)."""
    text = update.message.text.strip()
    user_data = context.user_data

    if user_data.get("awaiting_prompt"):
        user_data["awaiting_prompt"] = False
        # Create pipeline
        body = json.dumps({"project": "PAOS", "prompt": text, "planMd": "", "tasksMd": ""}).encode()
        try:
            req = urllib.request.Request(
                f"{DASHBOARD_URL}/api/pipelines",
                data=body,
                headers={"Content-Type": "application/json"},
            )
            if API_TOKEN:
                req.add_header("Authorization", f"Bearer {API_TOKEN}")
            with urllib.request.urlopen(req, timeout=15) as r:
                result = json.loads(r.read())
            pid = result.get("id", "?")
            await update.message.reply_text(
                f"✅ *Pipeline Created!*\n\nID: `{pid}`\nPrompt: {text[:80]}",
                parse_mode="Markdown",
                reply_markup=main_keyboard(),
            )
        except Exception as e:
            await update.message.reply_text(f"❌ Failed: {e}", reply_markup=main_keyboard())

    elif user_data.get("awaiting_schedule"):
        user_data["awaiting_schedule"] = False
        parts = text.split("|", 1)
        prompt = parts[0].strip()
        schedule = parts[1].strip() if len(parts) > 1 else "daily"
        body = json.dumps({"prompt": prompt, "schedule": schedule}).encode()
        try:
            req = urllib.request.Request(
                f"{DASHBOARD_URL}/api/pipelines/schedule",
                data=body,
                headers={"Content-Type": "application/json"},
            )
            if API_TOKEN:
                req.add_header("Authorization", f"Bearer {API_TOKEN}")
            with urllib.request.urlopen(req, timeout=15) as r:
                result = json.loads(r.read())
            await update.message.reply_text(
                f"✅ *Scheduled!*\n\nJob: `{result.get('jobId', '?')}`\nSchedule: `{result.get('schedule', '?')}`",
                parse_mode="Markdown",
                reply_markup=main_keyboard(),
            )
        except Exception as e:
            await update.message.reply_text(f"❌ Failed: {e}", reply_markup=main_keyboard())

    elif user_data.get("awaiting_search"):
        user_data["awaiting_search"] = False
        result = api_get(f"search?q={urllib.parse.quote(text)}&topK=3")
        results = result.get("results", [])
        if "error" in result:
            await update.message.reply_text(f"❌ Error: {result['error']}", reply_markup=main_keyboard())
        elif not results:
            await update.message.reply_text("📭 No results found.", reply_markup=main_keyboard())
        else:
            lines = [f"🔎 *Results for:* {text}\n"]
            for r in results:
                lines.append(f"• *{r.get('title', '?')}* ({r.get('score', 0)}%)")
                lines.append(f"  `{r.get('path', '?')}`")
                lines.append(f"  {r.get('snippet', '')[:100]}\n")
            await update.message.reply_text(
                "\n".join(lines), parse_mode="Markdown", reply_markup=main_keyboard()
            )

# ── Main ────────────────────────────────────────────────────────────────

def main():
    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("pipeline", pipeline_command))
    app.add_handler(CallbackQueryHandler(button_handler))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))

    log.info("PAOS Telegram bot started. Press Ctrl+C to stop.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
