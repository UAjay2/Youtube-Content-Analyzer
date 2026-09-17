"""from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
from nltk.corpus import wordnet
from topic_model import get_wordnet_pos
import nltk


stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()

words = [
    "games",
    "playing",
    "players",
    "programming",
    "computers",
    "movies",
    "studies",
    "phones",
    "coding",
    "football"
]
tagged_words = pos_tag(words)

print("STEMMNG")

for word in words:
    stem = stemmer.stem(word)

    print(word,"->",stem)


print("\nLEMMATIZATION")



for word ,tag in tagged_words:
    wordnet_pos = get_wordnet_pos(tag)

    lemma = lemmatizer.lemmatize(word,pos = wordnet_pos)

    print(word,"->",lemma)"""

from category_classifier import (
    detect_phrases,
    classify_phrases
)


words = [
    "machine",
    "learning",
    "python",
    "video",
    "game",
    "football",
    "match"
]


detected = detect_phrases(words)

print("Detected phrases:")
print(detected)


scores = classify_phrases(detected)

print("\nPhrase scores:")
print(scores)
