from nltk.sentiment import SentimentIntensityAnalyzer

sia = SentimentIntensityAnalyzer()

def analyze_sentiment(text):
    scores = sia.polarity_scores(text)

    compound = scores["compound"]

    if compound >= 0.05:
        sentiment ="Positive"

    elif compound <=-0.05:
        sentiment = "Negative"

    else :
        sentiment = "Neutral"

    return {
        "sentiment":sentiment,
        "score":scores
    }

def analyze_comments(comments):
    results = []

    for comment in comments:
        result = analyze_sentiment(comment)

        results.append({
            "comment":comment,
            "sentiment": result["sentiment"],
            "score": result["score"]
        })

    return results

def calculate_sentiment_sumary(results):
    total = len(results)

    if total == 0:
        return {
            "positive":0,
            "negative":0,
            "neutral":0,
            "overall": "Neutral"
        }

    positive = 0
    negative = 0
    neutral = 0

    for result in results:

        if result["sentiment"] == "positive":
            positive +=1

        elif result["sentiment"] == "negative":
            negative +=1

        else:
            neutral +=1

    positive_percent = round((positive/ total)*100,2)
    negative_percent = round((negative/ total)*100,2)
    neutral_percent = round((neutral/ total)*100,2)

    if positive >= negative and positive >= neutral:
        overall = "positive"

    elif negative >= positive and negative >= neutral:
        overall = "negative"

    else:
        overall = "neutral"

    return {
        "positive": positive_percent,
        "negative": negative_percent,
        "neutral": neutral_percent,
        "overall":overall
    }