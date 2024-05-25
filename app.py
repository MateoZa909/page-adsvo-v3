from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/get_article', methods=['GET'])
def get_article():
    api_key = '8fc6900bb6bd4b6197f389a0e186b130'
    article_url = request.args.get('url')

    if not article_url:
        return jsonify({'error': 'URL is required'}), 400

    article_response = requests.get(article_url)
    article_soup = BeautifulSoup(article_response.content, 'html.parser')
    
    # Try to find the main content of the article
    paragraphs = article_soup.find_all('p')
    full_text = ' '.join([p.get_text() for p in paragraphs])

    return jsonify({'content': full_text})

if __name__ == '__main__':
    app.run(debug=True)
