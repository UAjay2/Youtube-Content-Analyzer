import re

def clean_text(text):
    text = text.lower()

    text = re.sub(
        r"http\S+|www\S+",
        "",
        text
    )

    text = " ".join(text.split())

    return text