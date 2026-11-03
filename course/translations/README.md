# Course app text

The words shown by the course mini-apps, one folder per language and one file per app:

| File | App |
| --- | --- |
| `ai-or-not.json` | AI or Not quiz (Lesson 1) |
| `recap-quiz-1.json` … `recap-quiz-4.json` | Recap quiz for Lessons 1–4 |
| `worksheet-1.json` … `worksheet-4.json` | Design Your Own AI Classifier worksheet, Lessons 1–4 |
| `player.json` | The START HERE page of the offline packages (`course/player`); lesson, video and document titles come from the names in Google Drive |

Languages: `en`, `fr`, `es`, `pt`, `ar`, `hi`, `sw` (used by both Kenya and Tanzania) and `ur`.
English is the reference; the others are translations of it.

These files were taken from the Urdu bundle of the app zips in Google Drive (the newest
version, the only one with Urdu) on October 28, 2026. They match the text built into each
app's `index.html` exactly. Picture file names for AI or Not are part of the app, not these files.

## Editing

- Change only the text values. Keep every key, the order of list items, and `{placeholder}`
  tokens such as `{n}` and `{total}` exactly as they are.
- Quiz answers (`correctAnswer`) must match one of that question's `options` word for word.
  In `ai-or-not.json` they stay `ai` or `not_ai` in every language.
- After editing, run the check from the repository root:

  ```
  python -I scripts/check_translations.py
  ```

  It compares every language with English and stops with an error if a key, list length,
  placeholder or answer doesn't match.
