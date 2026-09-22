from nltk.sentiment import SentimentIntensityAnalyzer
import re
from text_processing import strip_html
import nltk
nltk.download('vader_lexicon')

sia = SentimentIntensityAnalyzer()


def preprocess_sentiment(text):
    text = strip_html(text)
    text = re.sub(r"http\S+|www\S+","",text)
    text = re.sub(r"\s+"," ",text).strip()

    return text

def analyze_sentiment(text):
    text = preprocess_sentiment(text)

    scores = sia.polarity_scores(text)

    compound = scores["compound"]

    if compound >= 0.5:
        sentiment ="Positive"

    elif compound <=-0.5:
        sentiment = "Negative"

    else :
        sentiment = "Neutral"

    return {
        "sentiment":sentiment,
        "compound":compound,
        "positive": scores["pos"],
        "negative": scores["neg"],
        "neutral": scores["neu"]
    }

def analyze_comments(comments):
    results = []

    for comment in comments:
        result = analyze_sentiment(comment)

        results.append({
            "comment":comment,
            "sentiment": result["sentiment"],
            "compound":result["compound"],
            "positive": result["positive"],
            "negative": result["negative"],
            "neutral": result["neutral"]
        })

    return results

def calculate_sentiment_sumary(results):
    summary = {
        "Positive":0,
        "Negative":0,
        "Neutral":0
    }

    for result in results:
        sentiment = result["sentiment"]

        if sentiment in summary:
            summary[sentiment] += 1

    total = len(results)

    if total == 0:
        return {
            "counts": summary,
            "percentages": {
                "Positive": 0,
                "Negative": 0,
                "Neutral": 0
            }
        }

    percentages = {}

    for sentiment,count in summary.items():
        percentages[sentiment] = round((count/total) * 100,2)

    return {
        "counts":summary,
        "percentages":percentages
    }
    """total = len(results)

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
    }"""