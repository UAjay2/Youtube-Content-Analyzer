import VideoInfo from "./VideoInfo.jsx";
import Verdict from "./Verdict.jsx";
import SentimentPanel from "./SentimentPanel.jsx";
import TopicsPanel from "./TopicsPanel.jsx";
import PhrasesPanel from "./PhrasesPanel.jsx";
import CommentsSection from "./CommentsSection.jsx";
import TranscriptSection from "./TranscriptSection.jsx";

function Results({ data }) {
  const hasTranscript = Boolean((data.transcript || "").trim());

  return (
    <div className="results">
      <VideoInfo data={data} />
      <Verdict categories={data.categories} />

      <div className="duo">
        <div className="stack">
          <SentimentPanel sentiment={data.sentiment} />
          <PhrasesPanel phrases={data.phrase_results} />
        </div>
        <TopicsPanel topics={data.topics} hasTranscript={hasTranscript} />
      </div>

      <CommentsSection results={data.sentiment_results || []} />
      <TranscriptSection transcript={data.transcript} />
    </div>
  );
}

export default Results;
