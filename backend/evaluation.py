import search_engine
import pandas as pd

def precision(retrieved, relevant):
    retrieved = set(retrieved)
    relevant = set(relevant)

    if len(retrieved) == 0:
        return 0

    tp = len(retrieved.intersection(relevant))
    return tp / len(retrieved)

def recall(retrieved, relevant):
    retrieved = set(retrieved)
    relevant = set(relevant)

    if len(relevant) == 0:
        return 0

    tp = len(retrieved.intersection(relevant))
    return tp / len(relevant)

def f1_score(p, r):
    if p + r == 0:
        return 0

    return 2 * p * r / (p + r)


test_queries = {
    "technology": {
        "relevant": [9865, 8448, 9844, 8908, 9496]
    },
    "economy AND market": {
        "relevant": [380, 694, 724, 104, 106]
    },
    "politics OR government": {
        "relevant": [3685, 1023, 1342, 6631, 4307]
    }
}

results_table = []

for query, data in test_queries.items():
    results, expanded_terms = search_engine.search(query, top_k=5)

    retrieved = []
    for r in results:
        retrieved.append(r['doc_id'])

    relevant = data["relevant"]

    p = precision(retrieved, relevant)
    r = recall(retrieved, relevant)
    f1 = f1_score(p, r)

    results_table.append([
        query,
        retrieved,
        relevant,
        round(p, 3),
        round(r, 3),
        round(f1, 3)
    ])

df = pd.DataFrame(
    results_table,
    columns=["Query", "Retrieved Docs", "Relevant Docs", "Precision", "Recall", "F1 Score"]
)

print("\nSearch Engine Evaluation Results\n")
print(df)