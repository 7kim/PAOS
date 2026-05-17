# PDF Build Guide

Exact command sequence to turn a Markdown SRS with embedded Mermaid diagrams into a final PDF.

## Prerequisites

- `pandoc` 3.x
- `xelatex` (from texlive-xetex)
- `texlive-fonts-recommended` (for lmodern)
- `mmdc` (npm: `@mermaid-js/mermaid-cli`)
- `chrome-headless-shell` (puppeteer: `npx puppeteer browsers install chrome-headless-shell`)
- Python 3 with `cairosvg`, `pypdf`, `pdf2image`, `Pillow`

## Step 1: Extract Mermaid Blocks

```python
import re
with open('MySRS.md') as f:
    content = f.read()
blocks = re.findall(r'```mermaid\n(.*?)\n```', content, re.DOTALL)
for i, block in enumerate(blocks, 1):
    with open(f'diagrams/fig_{i:02d}.mmd', 'w') as f:
        f.write(block)
```

## Step 2: Render All Diagrams to PNG

```bash
for f in diagrams/fig_*.mmd; do
  out="${f%.mmd}.png"
  mmdc -i "$f" -o "$out" -c mermaid.config.json -p puppeteer.config.json -b white -w 1600
done
```

`mermaid.config.json`:
```json
{
  "theme": "default",
  "themeVariables": { "fontFamily": "Helvetica, Arial, sans-serif", "fontSize": "14px" },
  "flowchart": { "htmlLabels": true, "curve": "basis" },
  "sequence": { "useMaxWidth": true },
  "er": { "useMaxWidth": true }
}
```

`puppeteer.config.json`:
```json
{ "args": ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] }
```

## Step 3: Render Use-Case Diagrams as SVG

Mermaid cannot render use-case diagrams cleanly. Use hand-crafted SVG:

```python
import cairosvg
cairosvg.svg2png(
    url='diagrams/usecase_mvp.svg',
    write_to='diagrams/fig_XX.png',  # same filename position as the Mermaid block it replaces
    output_width=1600
)
```

Copy the resulting PNG over the broken Mermaid render.

## Step 4: Aspect Ratio Check

```python
from PIL import Image
import os
for p in sorted(os.listdir('diagrams')):
    if p.endswith('.png'):
        img = Image.open(f'diagrams/{p}')
        w, h = img.size
        ratio = h/w
        if ratio > 1.5:
            print(f"⚠️ {p}: {w}x{h} h/w={ratio:.2f} — will span pages, rewrite horizontally")
```

Fix any flagged diagram by changing `flowchart TD` or `flowchart TB` to `flowchart LR` and re-rendering.

## Step 5: Replace Mermaid Blocks with Image References

```python
import re
with open('MySRS.md') as f:
    content = f.read()
counter = [0]
def replace(m):
    counter[0] += 1
    n = f"{counter[0]:02d}"
    return f'\n![](diagrams/fig_{n}.png)\n'  # Empty alt-text suppresses duplicate caption
new = re.sub(r'```mermaid\n.*?\n```', replace, content, flags=re.DOTALL)
with open('MySRS.pandoc.md', 'w') as f:
    f.write(new)
```

## Step 6: Build the PDF

```bash
pandoc MySRS.pandoc.md \
  -o MySRS.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V linkcolor=blue \
  -V urlcolor=blue \
  -V toccolor=black \
  --toc
```

### DO NOT use `--number-sections`

If the Markdown source already has `## 3.1 Section Name`, adding `--number-sections` produces `3.1 3.1 Section Name`. Either remove numbers from the source or omit the flag. The source-numbers approach is preferred because it keeps the Markdown human-readable.

### Do not use `numbersections: true` in YAML frontmatter

Same problem. Remove this key from the YAML block if present.

## Step 7: Verify

```python
from pypdf import PdfReader
r = PdfReader('MySRS.pdf')
print(f'Pages: {len(r.pages)}')
print(f'Title: {r.metadata.title}')
```

Spot-check a few pages:
```python
from pdf2image import convert_from_path
for p in [1, 10, 20, 30, 40]:
    imgs = convert_from_path('MySRS.pdf', first_page=p, last_page=p, dpi=80)
    imgs[0].save(f'/tmp/check_p{p}.png')
```

View each to confirm use-case diagrams fit one page, activity diagram fits one page, section numbering is clean.

## Troubleshooting

### `! LaTeX Error: File lmodern.sty not found`

```bash
apt-get install -y lmodern
```

### Chrome not found for mmdc

```bash
npx puppeteer browsers install chrome-headless-shell
```

### Mermaid parse error on `-. TLS 1.2+ .->`

The `+` after a number breaks the lexer. Replace with `-. "TLS" .->` (quoted label).

### Mermaid parse error on ER diagram with `PK_FK`

Remove compound attribute tags. Use just `PK` and describe FK in prose.

### PDF has "Figure 11: Figure 11" duplicate caption

You used `![Figure 11](...)` — pandoc adds its own figure number. Use `![](...)` with empty alt text.

### Section numbering duplicates like "3.3 3.3 Section"

Remove `--number-sections` from the pandoc command AND remove `numbersections: true` from YAML frontmatter.

### `pip` refuses to install packages

Use `pip install X --break-system-packages` in containerized environments.
