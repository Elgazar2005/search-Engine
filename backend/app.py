from flask import Flask, request, jsonify
from flask_cors import CORS
import search_engine
import math

app = Flask(__name__)
CORS(app)

@app.route('/api/search')
def search():
    query = request.args.get('query', '').strip()
    page = int(request.args.get('page', 1))
    per_page = 5

    if not query:
        return jsonify({
            "query": query,
            "results": [],
            "expanded_terms": [],
            "page": page,
            "total_pages": 0,
            "total_results": 0
        })

    all_results, expanded_terms = search_engine.search(query, top_k=50)

    total_results = len(all_results)
    total_pages = math.ceil(total_results / per_page)

    start = (page - 1) * per_page
    end = start + per_page
    results = all_results[start:end]

    return jsonify({
        "query": query,
        "results": results,
        "expanded_terms": expanded_terms,
        "page": page,
        "total_pages": total_pages,
        "total_results": total_results
    })

@app.route('/api/suggestions')
def suggestions():
    return jsonify([
        "technology",
        "economy",
        "movie",
        "sports",
        "education",
        "business",
        "government"
    ])

if __name__ == '__main__':
    app.run(debug=True)