const FEATURES = [
  {
    title: "Category",
    text: "See whether a video is about technology, sports, gaming or entertainment, and how sure the match is.",
  },
  {
    title: "Comment mood",
    text: "Find out how many commenters are positive, negative or neutral about the video.",
  },
  {
    title: "Main topics",
    text: "Get the groups of words that come up together in the captions, and the phrases we recognized.",
  },
  {
    title: "Comments and captions",
    text: "Read the most positive and most negative comments, filter all comments by mood, and open the full transcript.",
  },
];

function Features() {
  return (
    <section id="features" className="container landing">
      <h2 className="landing-title">What you get</h2>

      <ul className="features-grid">
        {FEATURES.map((feature) => (
          <li className="feature" key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </li>
        ))}
      </ul>

      <p className="note">
        Category and topics come from English captions. If a video has none, you
        still get the comment mood.
      </p>
    </section>
  );
}

export default Features;
