from flask import Flask, jsonify,request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import re
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi
from sentiment import analyze_sentiment,analyze_comments,calculate_sentiment_sumary
from topic_model import create_documents,build_lda,calculate_topic_probability,get_topic_words,get_preprocessed_words,preprocessing_text
from category_classifier import (classify_topics,calculate_category_percentages,
                                 get_dominant_category,calculate_category_confidence,
                                 detect_phrases,combine_scores,classify_phrases,classify_transcript)


load_dotenv()

API_KEY = os.getenv("YouTube-API-Key")

MAX_COMMENTS = 500


REQUEST_TIMEOUT = 15

app = Flask(__name__)

CORS(app)

YOUTUBE_HOSTS ={
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "music.youtube.com",
}

VIDEO_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{11}$")

def get_youtube_video_id(url):
    try:
        url = (url or "").strip()

        if not url:
            return None

        if not re.match(r"^https?://",url,flags=re.IGNORECASE):
            url = "hhtps://" + url
        parse_url = urlparse(url)
        hostname = (parse_url.hostname or "").lower()
        video_id = None

        if hostname in YOUTUBE_HOSTS:
            if parse_url.path == "/watch":
                video_id = parse_qs(parse_url.query).get("v",[None])[0]
            else:
                parts = [part for part in parse_url.path.split("/") if part]

                if len(parts) >= 2 and parts[0] in ("shorts","embed","live","v"):
                    video_id = parts[1]

        elif hostname == "youtu.be":
            video_id = parse_url.path.lstrip("/").split("/")[0]

        if video_id and VIDEO_ID_PATTERN.match(video_id):
            return video_id

        return None

    except Exception:
        return None

    
@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "Flask backend is running"
    })


@app.route("/api/analyze", methods=["POST"])
def analyze():


    data = request.get_json(silent=True) or {}

    youtube_url = data.get("url")


    if not youtube_url:
        return jsonify({
            "error": "YouTube URL is required"
        }), 400

    video_id = get_youtube_video_id(youtube_url)
    

    if not video_id:
        return jsonify({
            "error": "Invalid YouTube URL"
        }), 400

    if not API_KEY:
        return jsonify({
            "error":  "Server is missing the YouTube API Key"
        }),500

    youtube_api_url = "https://www.googleapis.com/youtube/v3/videos"

    
    params = {
        "part": "snippet,statistics",
        "id": video_id,
        "key": API_KEY
    }
    try:
        response = requests.get(
            youtube_api_url,
            params=params,
            timeout=REQUEST_TIMEOUT
        )
    except requests.RequestException:
        return jsonify({
            "error": "Could not reach the YouTube API"
        }),502

    if response.status_code != 200:
        return jsonify({
            "error": "YouTube API request failed"
        }), response.status_code

    youtube_data = response.json()

    if not youtube_data.get("items"):
        return jsonify({
            "error": "Video not found"
        }), 404

    video = youtube_data["items"][0]
    comments = get_youtube_comments(video_id)
    #print("\nTOTAL COMMENTS FETCHED:",len(comments))
    transcript = get_youtube_transcript(video_id)
    sentiment_results = analyze_comments(comments)
    sentiment_summary = calculate_sentiment_sumary(sentiment_results)
    

    document = create_documents(
        transcript,
        chunk_size=150
    )

    if not document :
        topics = []
    else:
        lda_model,dictionary,corpus = build_lda(document,num_topics=3)

        topic_percentage = calculate_topic_probability(lda_model,corpus,num_topics=3)

        topic_words = get_topic_words(lda_model,num_words=5)
        

        topics=[]

        for topic_id,probability in enumerate(topic_percentage):
            topics.append({
                "topic_id":int(topic_id),
                "probability":round(float(probability),2),
                "words":topic_words[topic_id]["words"]
            })

    preprocessed_words = get_preprocessed_words(transcript)
    detected_phrases = detect_phrases(preprocessed_words)
    phrase_scores = classify_phrases(detected_phrases)
    keyword_scores = classify_topics(topics)
    combined_scores = combine_scores(keyword_scores,phrase_scores)
    category_percentages = calculate_category_percentages(combined_scores)
    dominant_category = get_dominant_category(category_percentages)
    classification_confidence = calculate_category_confidence(category_percentages)


    return jsonify({
        "video_id": video_id,
        "title": video["snippet"]["title"],
        "description": video["snippet"]["description"],
        "channel": video["snippet"]["channelTitle"],
        "views": video["statistics"].get("viewCount", 0),
        "likes": video["statistics"].get("likeCount", 0),
        "comment_count": video["statistics"].get("commentCount", 0),
        "comments": comments,
        "transcript": transcript,
        "sentiment": sentiment_summary,
        "sentiment_results": sentiment_results,
        "topics":topics,
        "categories":{
            "dominant":dominant_category,
            "percentages":category_percentages,
            "confidence":classification_confidence
        },
        "phrase_results":detected_phrases
    })  

def get_youtube_comments(video_id):
    youtube_comments_url = ("https://www.googleapis.com/youtube/v3/commentThreads")

    comments = []

    next_page_token = None

    while len(comments) < MAX_COMMENTS:

        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": 100,
            "key": API_KEY
        }

        if next_page_token:
            params["pageToken"] = next_page_token
        try:
            response = requests.get(
                youtube_comments_url,
                params = params,
                timeout = REQUEST_TIMEOUT
            )
        except requests.RequestException as error:
            print("YouTube comments request failed:",error)
            break

        if response.status_code !=200:
            print(
                "YouTube comments API error:",
                response.status_code
            )

            break

        data = response.json()

        for item in data.get("items",[]):
            comment = (
                item["snippet"]
                ["topLevelComment"]
                ["snippet"]
                ["textDisplay"]
            )

            comments.append(comment)

        next_page_token = data.get("nextPageToken")

        if not next_page_token:
            break

    return comments[:MAX_COMMENTS]

def get_youtube_transcript(video_id):

    try:

        ytt_api = YouTubeTranscriptApi()

        transcript_list = ytt_api.list(video_id)

        transcript = transcript_list.find_transcript(['en'])

        fetched_transcript = transcript.fetch()

        text = " ".join(segment.text for segment in fetched_transcript)
        #return fetched_transcript
        return text
    
    except Exception:
        return ""


if __name__ == "__main__":
    app.run(debug=True)