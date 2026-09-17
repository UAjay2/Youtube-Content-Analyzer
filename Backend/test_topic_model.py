from topic_model import create_documents, build_lda, calculate_topic_probability
from app.py import get_youtube_transcript


transcript_text = get_youtube_transcript(video_id):

documents = create_documents(transcript_text,chunk_size=50)

print("DOCUMENTS:")
for i,document in enumerate(documents):
    print(i,document)

lda_model, dictionary, corpus = build_lda(
    documents,
    num_topics=3
)

print("\nTOPICS:")

topics = lda_model.print_topics(num_words =10)

for topic in topics:
    print(topic)


print("\nDOCUMENT TOPIC PROBABILITY:")

for i,bow in enumerate(corpus):
    topics = lda_model.get_document_topics(bow,minimum_probability = 0)

    print(f"Document {i}:")
    print(topics)


probabilities  = calculate_topic_probability(lda_model,corpus,num_topics=3)

print(probabilities)