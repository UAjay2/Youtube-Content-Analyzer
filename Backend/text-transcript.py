from youtube_transcript_api import YouTubeTranscriptApi

def get_youtube_transcript(video_id):
    try:
        video_id = "t6ABIsiRrWM"

        ytt_api = YouTubeTranscriptApi()

        transcript_list = ytt_api.list(video_id)

        transcript = transcript_list.find_transcript(['en'])

        fetched_transcript = transcript.fetch()

        text = " ".join(segment.text for segment in fetched_transcript)
        return text
    
    except Exception:
        return ""

"""for transcript in transcript_list:
    print(transcript.language)
    print(transcript.language_code)
    print(transcript.is_generated)
"""