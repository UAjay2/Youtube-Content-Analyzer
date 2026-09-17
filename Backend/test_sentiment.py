from sentiment import analyze_sentiment,analyze_comments,calculate_sentiment_sumary

comments = [
    "This video is amazing!",
    "This is the worst video ever.",
    "The video is 10 minutes long.",
    "BRO THIS IS INSANE 🔥🔥",
    "I don't like this video.",
    "This game is AMAZING 🔥🔥",
    "Terrible video.",
    "Nice.",
    "WHAT A MATCH!!! 🔥",
    "I don't like this.",
    "Bro this is crazy 😂"
]

results = analyze_comments(comments)

for result in results:

    print("\nComment:-", result["comment"])
    print("Sentiment", result["sentiment"])
    print("Score",result["score"])

summary = calculate_sentiment_sumary(results)

print("\n----------------")
print("SENTIMENT SUMMARY")
print("----------------")

print("Positive:", summary["positive"], "%")
print("Negative:", summary["negative"], "%")
print("Neutral:", summary["neutral"], "%")
print("Overall:", summary["overall"])