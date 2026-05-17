# knowledge/books/

Individual book notes live here. One file per book, named `<slug>.md`.

## Adding a book from PDF

1. Copy PDF to `knowledge/books/pdfs/<slug>.pdf`
2. Tell Claude: `"convert knowledge/books/pdfs/<slug>.pdf to a book note"`
3. Claude will extract text, create `knowledge/books/<slug>.md`, and add an entry to `knowledge/references/books.md`

## File format

Each book file follows this structure:

```markdown
# Title — Author

**Status**: unread | reading | done | reference
**Added**: YYYY-MM-DD

## Summary

One paragraph summary.

## Key Concepts

- Concept 1
- Concept 2

## Notes & Highlights

> Quote or highlight

Notes go here.

## Relevance to PAOS

How this book applies to the project.
```
