function groupPhrases(list) {
  const groups = new Map();

  for (const item of list || []) {
    const existing = groups.get(item.phrase);
    if (existing) {
      existing.count += 1;
    } else {
      groups.set(item.phrase, {
        phrase: item.phrase,
        category: item.category,
        count: 1,
      });
    }
  }

  return [...groups.values()].sort((a, b) => b.count - a.count);
}

function PhrasesPanel({ phrases }) {
  const groups = groupPhrases(phrases);

  return (
    <section className="panel" aria-labelledby="phrases-title">
      <h2 className="panel-title" id="phrases-title">
        Phrases we recognized
      </h2>

      {groups.length > 0 ? (
        <>
          <p className="panel-lede">
            Two-word phrases from the captions that point to a category. The
            number is how often each appeared.
          </p>

          <ul className="chips">
            {groups.map((item) => (
              <li
                className="chip"
                key={item.phrase}
                style={{
                  "--bar": `var(--cat-${String(item.category).toLowerCase()})`,
                }}
                title={item.category}
              >
                <span className="chip-dot" aria-hidden="true" />
                {item.phrase}
                <span className="chip-count">&times;{item.count}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="empty">
          None of the phrases we look for, like &quot;machine learning&quot; or
          &quot;world cup&quot;, appeared.
        </p>
      )}
    </section>
  );
}

export default PhrasesPanel;
