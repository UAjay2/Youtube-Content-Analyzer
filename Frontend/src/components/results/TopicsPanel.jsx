import { formatPercent } from "../../utils/format.js";

function TopicsPanel({ topics, hasTranscript }) {
  const topicList = topics || [];

  return (
    <section className="panel" aria-labelledby="topics-title">
      <h2 className="panel-title" id="topics-title">
        Main topics
      </h2>

      {topicList.length > 0 ? (
        <>
          <p className="panel-lede">
            Each topic is a group of words that appear together in the captions.
            The percentage is how much of the video it covers.
          </p>

          <ul className="topics">
            {topicList.map((topic) => (
              <li className="topic" key={topic.topic_id}>
                <div className="topic-head">
                  <h3>Topic {topic.topic_id + 1}</h3>
                  <span>{formatPercent(topic.probability)}%</span>
                </div>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{ width: `${topic.probability}%` }}
                  />
                </div>
                <ul className="chips">
                  {topic.words.map((word) => (
                    <li className="chip" key={word}>
                      {word}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="empty">
          {hasTranscript
            ? "We couldn't find topics in this video's captions."
            : "Topics come from English captions, and this video doesn't have any."}
        </p>
      )}
    </section>
  );
}

export default TopicsPanel;
