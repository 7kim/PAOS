#!/usr/bin/env python3
"""Send PAOS screenshots to Telegram via bot API."""
import os
import sys
import re
import requests

def get_bot_token():
    """Extract bot token from .env file."""
    env_paths = [
        "/home/dev/AI_Workflow/hermes/.env",
        "/home/dev/AI_Workflow/config/secrets/.env",
        os.path.expanduser("~/.hermes/.env"),
    ]
    for path in env_paths:
        if not os.path.exists(path):
            continue
        try:
            with open(path) as f:
                content = f.read()
            match = re.search(r'TELEGRAM_BOT_TOKEN\s*=\s*(.+)', content)
            if match:
                token = match.group(1).strip()
                # Skip commented lines
                if not token.startswith('#') and ':' in token:
                    return token
        except:
            continue
    return None

def send_photo(token, chat_id, photo_path, caption):
    """Send a photo via Telegram Bot API."""
    url = f"https://api.telegram.org/bot{token}/sendPhoto"
    with open(photo_path, 'rb') as f:
        files = {'photo': f}
        data = {'chat_id': chat_id, 'caption': caption, 'parse_mode': 'Markdown'}
        response = requests.post(url, files=files, data=data, timeout=30)
        if response.status_code == 200:
            return True
        else:
            print(f"Error sending {photo_path}: {response.status_code} - {response.text}", file=sys.stderr)
            return False

def main():
    token = get_bot_token()
    if not token:
        print("ERROR: Could not find TELEGRAM_BOT_TOKEN", file=sys.stderr)
        sys.exit(1)

    chat_id = "1378786589"  # Hakim's chat ID

    screenshots = [
        ("/home/dev/AI_Workflow/screenshots/audit-ledger.png", "🧾 Audit Ledger — every action attributed to a known agent identity. Append-only, immutable, searchable."),
        ("/home/dev/AI_Workflow/screenshots/pipelines.png", "🔄 Pipelines — visual DAG with per-node PID, progress, output preview. Kahn's cascade with retry/skip."),
        ("/home/dev/AI_Workflow/screenshots/git-view.png", "🔍 Git View — per-agent commit history with diff viewer. Every change auto-committed with agent identity."),
        ("/home/dev/AI_Workflow/screenshots/handoff.png", "🤝 Handoff — current state, active task, what was done / not done. Rewritten each session, max 60 lines."),
    ]

    success_count = 0
    for photo_path, caption in screenshots:
        if not os.path.exists(photo_path):
            print(f"ERROR: File not found: {photo_path}", file=sys.stderr)
            continue
        if send_photo(token, chat_id, photo_path, caption):
            print(f"✓ Sent: {photo_path}")
            success_count += 1
        else:
            print(f"✗ Failed: {photo_path}", file=sys.stderr)

    print(f"\n{success_count}/{len(screenshots)} screenshots sent successfully.")

if __name__ == "__main__":
    main()
