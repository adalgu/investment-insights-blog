# Data Model: 발제 중심 홈 피드 재정렬

## Judge Post

Represents the neutral briefing/assessment post that anchors a debate group.

- **title**: string
- **date**: datetime (sort key for feed)
- **judge**: boolean (`true` for judge posts)
- **match_id**: string (links to Black/White posts)
- **description**: string (optional)
- **tags/categories**: arrays (optional)
- **cover**: object (optional)

## Side Post (Black/White)

Represents a single side's argument under a judge post.

- **title**: string
- **date**: datetime
- **side**: enum (`Black`, `White`)
- **match_id**: string (links to judge post)
- **winner**: string/boolean (optional highlight)
- **description**: string (optional)
- **tags/categories**: arrays (optional)
- **cover**: object (optional)

## Relationships

- `Judge Post (match_id)` ↔ `Side Post (match_id)` (1 → 0..1 per side)
- Side posts are grouped under the judge post in the home feed.
