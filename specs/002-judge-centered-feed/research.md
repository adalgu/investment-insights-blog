# Research: 발제 중심 홈 피드 재정렬

## Decision 1: Grouping key (`match_id`)

- **Decision**: Use `match_id` (string) in frontmatter to link judge/black/white posts.
- **Rationale**: A dedicated key avoids ambiguity when multiple posts share dates or tags, and it is easy to set in the content pipeline.
- **Alternatives considered**:
  - `debate_id`/`judge_key`: similar semantics but less consistent with existing naming.
  - Derive grouping from date: unreliable when multiple posts are published on the same day.

## Decision 2: Judge identification (`judge: true`)

- **Decision**: Mark judge posts with `judge: true` in frontmatter.
- **Rationale**: Keeps judge posts neutral (no `side`), avoids overloading `winner`, and is explicit for templates.
- **Alternatives considered**:
  - `side: "Judge"`: would require new side styling and may conflict with existing side logic.
  - Use `winner: "true"`: conflates judge identity with outcome highlighting.

## Decision 3: Side selection & missing posts

- **Decision**: For a given `match_id`, select the most recent Black/White post by date; if missing, render a placeholder card.
- **Rationale**: Ensures a stable, predictable layout while allowing partial content delivery.
- **Alternatives considered**:
  - Hide missing sides entirely: makes the layout jump and weakens the debate framing.
  - Render all Black/White posts: clutters the feed and breaks the 3-card grouping.

## Decision 4: Scope of layout changes

- **Decision**: Apply grouped layout only to the home feed; keep tags/categories/archives lists unchanged.
- **Rationale**: Minimizes regression risk and preserves standard list browsing.
- **Alternatives considered**:
  - Apply to all list views: increases complexity and may confuse taxonomy browsing.
