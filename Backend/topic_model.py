import re
from nltk.corpus import stopwords
from gensim import corpora
from gensim.models import LdaModel
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
from nltk import pos_tag

lemmatizer = WordNetLemmatizer()


def lemmatize_words(words):
    tagged_words = pos_tag(words)

    lemmatized_words = []

    for word,tag in tagged_words:
        wordnet_pos = get_wordnet_pos(tag)

        lemma = lemmatizer.lemmatize(word,pos = wordnet_pos)

        lemmatized_words.append(lemma)
    return lemmatized_words



def get_wordnet_pos(tag):

    if tag.startswith("J"):
        return wordnet.ADJ

    elif tag.startswith("V"):
        return wordnet.VERB

    elif tag.startswith("N"):
        return wordnet.NOUN
    
    elif tag.startswith("R"):
        return wordnet.ADV

    else:
        return wordnet.NOUN


stop_words = set(stopwords.words("english"))

custom_stopwords = {
    "uh",
    "um",
    "okay",
    "like",
    "basically",
    "actually",
    "really",
    "right",
    "yeah",
    "know"
}

stop_words = stop_words.union(custom_stopwords)

def preprocessing_text(text):
    text =text.lower()

    text = re.sub(r"[^a-zA-Z\s]", "", text)

    words = text.split()

    words = [
        word
        for word in words
        if word not in stop_words and len(word) > 2
    ]

    words = lemmatize_words(words)

    return words


def create_documents(text,chunk_size = 150):
    words = preprocessing_text(text)

    documents=[]

    for i in range(0,len(words),chunk_size):
        chunk = words[i:i + chunk_size]

        if chunk:
            documents.append(chunk)

    return documents

def build_lda(documents,num_topics=3):
    dictionary = corpora.Dictionary(documents)

    corpus = [
        dictionary.doc2bow(document)
        for document in documents
    ]

    lda_model = LdaModel(
        corpus = corpus,
        id2word = dictionary,
        num_topics = num_topics,
        random_state =42
    )

    return lda_model,dictionary,corpus

def calculate_topic_probability(lda_model,corpus,num_topics):
    topic_total =[0]* num_topics

    document_count = len(corpus)

    for bow in corpus:
        topics = lda_model.get_document_topics(
            bow,
            minimum_probability = 0
        )

        for topic_id,probability in topics:
            topic_total[topic_id] += probability

    topic_percentage = []

    for total in topic_total:
        percentage =(total/document_count)*100

        topic_percentage.append(
            round(percentage,2)
        )

    return topic_percentage


def get_topic_words(lda_model,num_words=5):
    topic_words=[]

    for topic_id in range(lda_model.num_topics):
        words = lda_model.show_topic(
            topic_id,
            topn = num_words
        )
        words_only = []

        for word ,probability in words:
            words_only.append(word)

        topic_words.append({
            #"topic_id":topic_id,
            "words":words_only
        })

    return topic_words

def get_preprocessed_words(text):
    return preprocessing_text(text)