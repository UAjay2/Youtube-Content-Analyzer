from nltk.stem import PorterStemmer
import nltk
from collections import Counter


categories = {
    "Gaming": {
        "game": 1,
        "gaming": 5,
        "player": 1,
        "console": 5,
        "xbox": 5,
        "playstation": 5,
        "steam": 5,
        "gameplay": 5,
        "gamer": 3,
        "controller": 5
    },

    "Technology": {
        "technology": 5,
        "computer": 3,
        "software": 4,
        "programming": 5,
        "python": 5,
        "javascript": 5,
        "code": 2,
        "coding": 3,
        "phone": 2,
        "smartphone": 4,
        "iphone": 4,
        "android": 4,
        "ai": 5
    },

    "Sports": {
        "football": 5,
        "cricket": 5,
        "match": 1,
        "player": 1,
        "goal": 3,
        "team": 1,
        "score": 1,
        "tournament": 5,
        "league": 5,
        "sport": 3
    },

    "Entertainment": {
        "movie": 5,
        "film": 5,
        "actor": 5,
        "actress": 5,
        "music": 1,
        "song": 2,
        "show": 1,
        "series": 3,
        "celebrity": 5
    }
}

phrases = {

    "Gaming": {
        "video game": 4,
        "game console": 4,
        "game play": 3,
        "game controller": 4,
        "online gaming": 4
    },

    "Technology": {
        "machine learning": 4,
        "artificial intelligence": 4,
        "data science": 4,
        "web development": 4,
        "software development": 4
    },

    "Sports": {
        "football match": 4,
        "cricket match": 4,
        "world cup": 4,
        "sports team": 3,
        "football player": 4
    },

    "Entertainment": {
        "movie review": 4,
        "music video": 4,
        "tv series": 4,
        "film industry": 4,
        "movie star": 4
    }
}

stemmer = PorterStemmer()

def create_stemmed_categories(categories):
    stemmed_categories = {}

    for category,keywords in categories.items():
        stemmed_keywords ={}

        for word,weight in keywords.items():
            stemmed_word = stemmer.stem(word)

            if stemmed_word in stemmed_keywords:
                stemmed_keywords[stemmed_word] = max(stemmed_keywords[stemmed_word],weight)
            else:
                stemmed_keywords[stemmed_word] = weight

        stemmed_categories[category] = stemmed_keywords

    return stemmed_categories

stemmed_categories = create_stemmed_categories(categories)

def classify_transcript(words):
    category_scores = {
        category: 0
        for category in categories
    }

    matched_words = {
        category: []
        for category in categories
    }
    word_counts = Counter(words)

    for word,count in word_counts.items():
        stemmed_word = stemmer.stem(word)
        effective_count = min(count,5)

        for category, keywords in stemmed_categories.items():

            if stemmed_word in keywords:
                weight = keywords[stemmed_word]
                score = weight * effective_count
                category_scores[category] += score

                matched_words[category].append({
                    "word": word,
                    "count":count,
                    "effective_score":effective_count,
                    "weight": weight,
                    "score":score
                })

    return category_scores, matched_words

def normalize_score(scores):
    total = sum(scores.values())

    if total == 0:
        return {
            category:0
            for category in categories
        }
    normalized = {}

    for category,score in scores.items():
        normalized[category] = score/total

    return normalized

def classify_topics(topics):
    category_scores = {
        category: 0
        for category in categories
    }

    for topic in topics:
        probability = topic["probability"] / 100
        words = topic["words"]

        for category,keywords in stemmed_categories.items():
            matches = 0

            for word in words:
                stemmed_word = stemmer.stem(word)
                if stemmed_word in keywords:
                    matches+=keywords[stemmed_word]

            category_scores[category]+=(probability * matches)

    return category_scores


def detect_phrases(words):
    detected_phrases = []

    for i in range(len(words) - 1):
        phrase = words[i]+ " "+words[i+1]

        for category,category_phrases in phrases.items():
            if phrase in category_phrases:
                detected_phrases.append({
                    "phrase":phrase,
                    "category":category,
                    "weight":category_phrases[phrase]
                })

    return detected_phrases

def classify_phrases(detected_phrases):
    phrase_scores ={
        category:0
        for category in categories
    }
    phrase_counts = Counter(
        item["phrase"]
        for item in detected_phrases
    )

    for phrase,count in phrase_counts.items():
        effective_count = min(count,5)

        for item in detected_phrases:
            if item["phrase"] == phrase:
                category = item["category"]
                weight = item["weight"]

                phrase_scores[category] +=(weight * effective_count)

                break

    return phrase_scores

def combine_scores(keyword_scores,phrase_scores):
    combined_scores = {}

    for category in categories:
        combined_scores[category] = (
            keyword_scores.get(category,0) + phrase_scores.get(category,0)
        )
    return combined_scores

def calculate_category_percentages(category_scores):
    total = sum(category_scores.values())

    if total == 0:
        return {
            "Unknown":100
        }

    percentages = {}

    for category,score in category_scores.items():
        percentages[category] = round(
            (score/total)*100,
            2
        )
    return percentages

def get_dominant_category(category_percentages):
    if not category_percentages:
        return "Unknown"
    return max(category_percentages,key=category_percentages.get)

def calculate_category_confidence(category_percentages):
    if not category_percentages:
        return{
            "level":"Unknown",
            "margin":0
        }

    if "Unknown" in category_percentages:
        return {
            "level":"Unknown",
            "margin":0
        }

    sorted_categories = sorted(
        category_percentages.items(),
        key = lambda x: x[1],
        reverse=True
    )

    highest = sorted_categories[0][1]

    if len(sorted_categories)< 2:
        return {
            "level": "Strong",
            "margin":highest
        }

    second_highest = sorted_categories[1][1]

    margin = round(highest-second_highest,2)

    if margin >= 40 :
        level = "Strong"
    elif margin >= 20:
        level = "Moderate"
    else:
        level = "Weak"

    return {
        "level":level,
        "margin":margin
    }