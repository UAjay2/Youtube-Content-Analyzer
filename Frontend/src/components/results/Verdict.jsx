import { formatPercent } from "../../utils/format.js";

const METER_SEGMENTS = { Strong: 3, Moderate: 2, Weak: 1 };

function Verdict({ categories }) {
  const dominant = categories?.dominant || "Unknown";
  const known = dominant !== "Unknown";
  const percentages = categories?.percentages || {};
  const confidence = categories?.confidence || { level: "Unknown", margin: 0 };

  const rows = known
    ? Object.entries(percentages).sort((a, b) => b[1] - a[1])
    : [];
  const filled = METER_SEGMENTS[confidence.level] ?? 0;

  const confidenceText =
    confidence.level === "Weak"
      ? `The top two categories are close, only ${confidence.margin} points apart.`
      : `It leads the next category by ${confidence.margin} points.`;

  return (
    <section className="verdict" aria-label="Category">
      <div className="verdict-main">
        <h2 className="verdict-title">
          {known ? dominant : "Category unclear"}
        </h2>

        {known ? (
          <>
            <p className="verdict-note">
              The best match for this video, based on its captions and topics.
            </p>

            <div className="confidence">
              <span
                className="meter"
                role="img"
                aria-label={`${confidence.level} confidence`}
              >
                {[1, 2, 3].map((n) => (
                  <span key={n} className="meter-seg" data-on={n <= filled} />
                ))}
              </span>
              <p>
                <strong>{confidence.level} confidence.</strong> {confidenceText}
              </p>
            </div>
          </>
        ) : (
          <p className="verdict-note">
            None of the keywords we look for showed up. This usually means the
            video has no English captions.
          </p>
        )}
      </div>

      {known && (
        <ul className="cat-bars">
          {rows.map(([name, percentage]) => (
            <li
              key={name}
              style={{ "--bar": `var(--cat-${name.toLowerCase()})` }}
            >
              <div className="cat-bars-head">
                <span>{name}</span>
                <span>{formatPercent(percentage)}%</span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${percentage}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Verdict;
