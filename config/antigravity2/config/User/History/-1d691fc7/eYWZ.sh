#!/bin/bash
set -e

echo "======================================"
echo "  Installing Apps on Ubuntu 26.04"
echo "======================================"

# --- 1. Update apt ---
echo ""
echo ">>> Updating package lists..."
sudo apt-get update -q

# --- 2. qBittorrent ---
echo ""
echo ">>> Installing qBittorrent..."
sudo apt-get install -y qbittorrent

# --- 3. VLC ---
echo ""
echo ">>> Installing VLC..."
sudo apt-get install -y vlc

# --- 4. Spotify (snap) ---
echo ""
echo ">>> Installing Spotify via snap..."
sudo snap install spotify

# --- 5. Obsidian (snap) ---
echo ""
echo ">>> Installing Obsidian via snap..."
sudo snap install obsidian --classic

# --- 6. Ledger Live (AppImage) ---
echo ""
echo ">>> Downloading Ledger Live..."
mkdir -p "$HOME/Applications"
LEDGER_PATH="$HOME/Applications/ledger-live.AppImage"
wget -q --show-progress -O "$LEDGER_PATH" "https://download.live.ledger.com/latest/linux"
chmod +x "$LEDGER_PATH"

# Extract the icon bundled inside the AppImage
echo ">>> Extracting Ledger Live icon..."
mkdir -p "$HOME/.local/share/icons"
ORIG_DIR="$PWD"
cd /tmp
rm -rf squashfs-root
"$LEDGER_PATH" --appimage-extract 2>/dev/null || true
if [ -d /tmp/squashfs-root ]; then
    ICON=$(find /tmp/squashfs-root -name "*.png" -o -name "*.svg" 2>/dev/null | head -1)
    if [ -n "$ICON" ]; then
        EXT="${ICON##*.}"
        cp "$ICON" "$HOME/.local/share/icons/ledger-live.$EXT"
        echo "    Icon saved: $HOME/.local/share/icons/ledger-live.$EXT"
    fi
    rm -rf /tmp/squashfs-root
fi
cd "$ORIG_DIR"

# Create Ledger Live .desktop launcher
echo ">>> Creating Ledger Live desktop launcher..."
mkdir -p "$HOME/.local/share/applications"
cat > "$HOME/.local/share/applications/ledger-live.desktop" << EOF
[Desktop Entry]
Name=Ledger Live
Comment=Ledger crypto asset manager
Exec=$LEDGER_PATH --no-sandbox %U
Icon=$HOME/.local/share/icons/ledger-live
Terminal=false
Type=Application
Categories=Finance;Office;
StartupWMClass=Ledger Live
EOF

update-desktop-database "$HOME/.local/share/applications/" 2>/dev/null || true

# Give snaps a moment to register their .desktop files
echo ""
echo ">>> Waiting for snap desktop entries to register..."
sleep 8

# --- 7. Pin all apps to GNOME dock ---
echo ""
echo ">>> Pinning all apps to the GNOME dock..."
gsettings set org.gnome.shell favorite-apps \
  "['firefox_firefox.desktop',
    'org.gnome.Nautilus.desktop',
    'tradingview.desktop',
    'gemini-desktop_gemini-desktop.desktop',
    'org.gnome.Ptyxis.desktop',
    'code.desktop',
    'antigravity.desktop',
    'org.gnome.tweaks.desktop',
    'org.gnome.Software.desktop',
    'qbittorrent.desktop',
    'vlc.desktop',
    'spotify_spotify.desktop',
    'obsidian_obsidian.desktop',
    'ledger-live.desktop']"

echo ""
echo "======================================"
echo "  DONE! Installed:"
echo "    qBittorrent  (apt)"
echo "    VLC          (apt)"
echo "    Spotify      (snap)"
echo "    Obsidian     (snap)"
echo "    Ledger Live  (AppImage -> ~/Applications/)"
echo ""
echo "  All 5 apps pinned to the dock."
echo "  Log out and back in if dock icons"
echo "  do not appear immediately."
echo "======================================"
