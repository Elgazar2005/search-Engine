from rank_bm25 import BM25Okapi
import pandas as pd
import numpy as np
import re
from collections import defaultdict
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import csv
import math
import sys
import nltk

csv.field_size_limit(sys.maxsize)

nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('wordnet')

files = [
    "data/business_data.csv",
    "data/education_data.csv",
    "data/entertainment_data.csv",
    "data/sports_data.csv",
    "data/technology_data.csv"
]

df_list = []

for file in files:
    temp_df = pd.read_csv(file, engine='python', encoding='utf-8')

    needed_cols = ['headlines', 'description', 'content', 'category', 'url', 'url_to_image']
    for col in needed_cols:
        if col not in temp_df.columns:
            temp_df[col] = ""

    df_list.append(temp_df)

df = pd.concat(df_list, ignore_index=True)

if 'url_to_image' in df.columns:
    df.rename(columns={'url_to_image': 'image_url'}, inplace=True)
else:
    df['image_url'] = ""

for col in ['headlines', 'description', 'content', 'category', 'url', 'image_url']:
    df[col] = df[col].fillna("").astype(str)

df['full_text'] = (
    df['headlines'] + " " +
    df['description'] + " " +
    df['content']
).str.strip()

corpus = df['full_text'].tolist()

stop_words = set(stopwords.words('english'))
extra_stopwords = {
    "say", "also", "get", "one", "two", "read", "already", "new",
    "make", "story", "first", "per", "cent", "advertisement", "register"
}
stop_words.update(extra_stopwords)

wnl = WordNetLemmatizer()

def preprocess(text):
    text = str(text)
    text = re.sub(r"https?://\S+", " ", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = text.lower()

    tokens = word_tokenize(text)

    clean_tokens = []
    for word in tokens:
        word = wnl.lemmatize(word, 'n')
        word = wnl.lemmatize(word, 'v')
        word = wnl.lemmatize(word, 'a')

        if word not in stop_words and len(word) > 2:
            clean_tokens.append(word)

    return clean_tokens

df['processed_tokens'] = df['full_text'].apply(preprocess)
df['processed_text'] = df['processed_tokens'].apply(lambda x: " ".join(x))

# BM25 model
bm25 = BM25Okapi(df['processed_tokens'].tolist())

inverted_index = defaultdict(list)

for doc_id, tokens in enumerate(df['processed_tokens']):
    freq_dict = defaultdict(int)

    for token in tokens:
        freq_dict[token] += 1

    for token, freq in freq_dict.items():
        inverted_index[token].append((doc_id, freq))

boolean_operators = {'and', 'or', 'not'}

synonyms_dict = {
    "technology": ["tech", "innovation", "digital"],
    "education": ["study", "learning", "student", "university"],
    "business": ["economy", "finance", "market", "trade"],
    "sports": ["game", "match", "football", "cricket"],
    "entertainment": ["film", "movie", "cinema", "actor"],
    "economy": ["finance", "market", "business"],
    "market": ["trade", "finance", "economy"],
    "politics": ["government", "policy", "political"],
    "government": ["politics", "policy", "minister"],
    "movie": ["film", "cinema"],
    "film": ["movie", "cinema"]
}

N = len(df)

document_frequency = {}
for term in inverted_index:
    document_frequency[term] = len(inverted_index[term])

def expand_query_terms(query):
    expanded_terms = []

    for term in query.lower().split():
        if term in boolean_operators:
            continue

        processed = preprocess(term)
        if processed:
            base_term = processed[0]
            expanded_terms.append(base_term)

            if base_term in synonyms_dict:
                for synonym in synonyms_dict[base_term]:
                    processed_syn = preprocess(synonym)
                    if processed_syn:
                        expanded_terms.append(processed_syn[0])

    unique_terms = []
    for term in expanded_terms:
        if term not in unique_terms:
            unique_terms.append(term)

    return unique_terms

def compute_tfidf_score(query, doc_id):
    query_terms = expand_query_terms(query)
    score = 0.0

    for term in query_terms:
        if term in inverted_index:
            postings = inverted_index[term]
            df_term = document_frequency[term]
            idf = math.log10(N / df_term)

            for posting_doc_id, tf in postings:
                if posting_doc_id == doc_id:
                    score += tf * idf
                    break

    return score

def get_term_vector(term, corpus_size):
    vec = np.zeros(corpus_size, dtype=int)

    if term in inverted_index:
        for doc_id, _ in inverted_index[term]:
            vec[doc_id] = 1

    return vec

def query_filteration(query):
    qterms = []

    for term in query.lower().split():
        if term in boolean_operators:
            qterms.append(term)
        else:
            processed = preprocess(term)
            if processed:
                t = processed[0]
                if t in inverted_index:
                    qterms.append(t)

    return qterms

def detect_category(query):
    categories = ["business", "education", "entertainment", "sports", "technology"]

    for cat in categories:
        if cat in query.lower():
            return cat

    return None

def boolean_retrieval(query, top_k=10, category=None):
    qterms = query_filteration(query)

    if not qterms:
        return []

    corpus_size = len(corpus)
    result_vec = None
    current_op = None
    i = 0

    while i < len(qterms):
        term = qterms[i]

        if term == "not":
            if i + 1 < len(qterms):
                next_term = qterms[i + 1]
                vec = get_term_vector(next_term, corpus_size)
                vec = np.logical_not(vec).astype(int)
                i += 2
            else:
                break

        elif term in boolean_operators:
            current_op = term
            i += 1
            continue

        else:
            vec = get_term_vector(term, corpus_size)
            i += 1

        if result_vec is None:
            result_vec = vec
        else:
            if current_op == "and":
                result_vec = np.logical_and(result_vec, vec).astype(int)
            elif current_op == "or":
                result_vec = np.logical_or(result_vec, vec).astype(int)
            else:
                result_vec = np.logical_and(result_vec, vec).astype(int)

            current_op = None

    if result_vec is None:
        return []

    doc_ids = [idx for idx, val in enumerate(result_vec) if val == 1]

    results = []
    for doc_id in doc_ids:
        row = df.loc[doc_id]

        image = row['image_url']
        if pd.isna(image) or image.strip() == "":
            image = ""

        score = compute_tfidf_score(query, doc_id)

        results.append({
            'doc_id': int(doc_id),
            'headline': row['headlines'],
            'description': row['description'],
            'content': row['content'],
            'category': row['category'],
            'url': row['url'],
            'image_url': image,
            'score': score
        })

    if category:
        results = [r for r in results if r['category'].lower() == category.lower()]

    results = sorted(results, key=lambda x: x['score'], reverse=True)

    return results[:top_k]

def bm25_search(query, top_k=10):
    query_terms = expand_query_terms(query)

    scores = bm25.get_scores(query_terms)

    top_doc_ids = np.argsort(scores)[::-1][:top_k]

    results = []

    for doc_id in top_doc_ids:
        if scores[doc_id] <= 0:
            continue

        row = df.loc[doc_id]

        image = row['image_url']
        if pd.isna(image) or image.strip() == "":
            image = ""

        results.append({
            'doc_id': int(doc_id),
            'headline': row['headlines'],
            'description': row['description'],
            'content': row['content'],
            'category': row['category'],
            'url': row['url'],
            'image_url': image,
            'score': float(scores[doc_id])
        })

    return results

def search(query, top_k=10):
    if not query:
        return [], []

    expanded_terms = expand_query_terms(query)

    # BM25 ranking is used for the final retrieved results
    results = bm25_search(query, top_k=top_k)

    return results, expanded_terms