from flask import Flask, jsonify,request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi

load_dotenv()

API_KEY = os.getenv("YouTube-API-Key")

app = Flask(__name__)

CORS(app)


def get_youtube_video_id(url):
    try:
        parse_url = urlparse(url)

        if parse_url.hostname in ["www.youtube.com","youtube.com"]:
            return parse_qs(parse_url.query).get("v",[None])[0]

        if parse_url.hostname == "youtu.be":
            return parse_url.path.lstrip("/")

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

    data = request.get_json()

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

    youtube_api_url = "https://www.googleapis.com/youtube/v3/videos"

    
    params = {
        "part": "snippet,statistics",
        "id": video_id,
        "key": API_KEY
    }

    response = requests.get(
        youtube_api_url,
        params=params
    )

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
    text = get_youtube_transcript(video_id)

    return jsonify({
        "video_id": video_id,
        "title": video["snippet"]["title"],
        "description": video["snippet"]["description"],
        "channel": video["snippet"]["channelTitle"],
        "views": video["statistics"].get("viewCount", 0),
        "likes": video["statistics"].get("likeCount", 0),
        "comments_count": video["statistics"].get("commentCount", 0),
        "comments ": comments,
        "Transcript":text
    })  


def get_youtube_comments(video_id):
    youtube_comments_url = ("https://www.googleapis.com/youtube/v3/commentThreads")

    params = {
        "part": "snippet",
        "videoId": video_id,
        "maxResults": 100,
        "key": API_KEY
    }

    response = requests.get(
        youtube_comments_url,
        params = params
    )

    if response.status_code !=200:
        return []

    data = response.json()

    comments =[]

    for item in data.get("items",[]):
        comment = (
            item["snippet"]
            ["topLevelComment"]
            ["snippet"]
            ["textDisplay"]
        )

        comments.append(comment)

    return comments

def get_youtube_transcript(video_id):
    try:

        ytt_api = YouTubeTranscriptApi()

        transcript_list = ytt_api.list(video_id)

        transcript = transcript_list.find_transcript(['en'])

        fetched_transcript = transcript.fetch()

        text = " ".join(segment.text for segment in fetched_transcript)
        return text
    
    except Exception:
        return ""


if __name__ == "__main__":
    app.run(debug=True)