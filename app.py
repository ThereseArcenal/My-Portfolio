from flask import Flask, render_template
from dotenv import load_dotenv
import os
import sys

load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')

# Validate required environment variables
required_env_vars = [
    'FLOWISE_API_URL',
    'FLOWISE_CHATFLOW_ID',
]

missing_vars = [var for var in required_env_vars if not os.getenv(var)]

if missing_vars and os.getenv('FLASK_ENV') == 'production':
    print(f"ERROR: Missing required environment variables: {', '.join(missing_vars)}")
    sys.exit(1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health():
    return {'status': 'ok'}, 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)