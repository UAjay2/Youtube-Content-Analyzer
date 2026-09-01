from flask import Flask, jsonify,request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


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

    return jsonify({
        "message": "URL Recevied",
        "url": youtube_url
    })

if __name__ == "__main__":
    app.run(debug=True)