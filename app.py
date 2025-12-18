from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')

FLOWISE_API_URL = os.getenv('FLOWISE_API_URL', 'https://cloud.flowiseai.com')
FLOWISE_CHATFLOW_ID = os.getenv('FLOWISE_CHATFLOW_ID', '7fd72080-6174-4513-a6ea-ffdc0f164e1c')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health():
    return {'status': 'ok'}, 200

@app.route('/api/chat', methods=['POST'])
def chat():
    """Proxy endpoint for Flowise chatbot"""
    try:
        data = request.json
        question = data.get('question', '')
        
        if not question:
            return jsonify({'error': 'No question provided'}), 400
        
        flowise_url = f"{FLOWISE_API_URL}/api/v1/prediction/{FLOWISE_CHATFLOW_ID}"
        print(f"Calling: {flowise_url}")  # Debug log
        
        response = requests.post(
            flowise_url,
            json={
                'question': question,
                'history': data.get('history', []),
                'overrideConfig': data.get('overrideConfig', {})
            },
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"Flowise error: {response.status_code} - {response.text}")
            return jsonify({'error': 'Chatbot service error', 'details': response.text}), response.status_code
        
        return jsonify(response.json()), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', debug=debug_mode, port=5000)