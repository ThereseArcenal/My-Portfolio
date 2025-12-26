from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

FLOWISE_API_URL = 'https://cloud.flowiseai.com'
FLOWISE_CHATFLOW_ID = os.getenv('FLOWISE_CHATFLOW_ID')

# Gmail configuration
GMAIL_ADDRESS = os.getenv('GMAIL_ADDRESS')
GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')
RECIPIENT_EMAIL = os.getenv('RECIPIENT_EMAIL', 'galearcenal6@gmail.com')

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

@app.route('/api/contact', methods=['POST', 'OPTIONS'])
def contact():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Validate inputs
        if not all([name, email, subject, message]):
            return jsonify({'error': 'All fields are required'}), 400
        
        if len(message) < 10:
            return jsonify({'error': 'Message must be at least 10 characters'}), 400
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Invalid email address'}), 400
        
        # Send email
        send_email(name, email, subject, message)
        
        return jsonify({'success': True, 'message': 'Email sent successfully'}), 200
    
    except Exception as e:
        print(f"Error in contact route: {str(e)}")
        return jsonify({'error': f'Failed to send message: {str(e)}'}), 500

def send_email(name, email, subject, message):
    """Send email via Gmail SMTP"""
    try:
        # Validate credentials exist
        if not GMAIL_ADDRESS or not GMAIL_APP_PASSWORD:
            raise Exception("Gmail credentials not configured. Check your .env file.")
        
        # Create email message
        msg = MIMEMultipart('alternative')
        msg['From'] = GMAIL_ADDRESS
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = f"Portfolio Contact: {subject}"
        
        # Create plain text and HTML versions
        text_body = f"""
From: {name}
Email: {email}
Subject: {subject}
Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Message:
{message}
"""
        
        html_body = f"""
<html>
  <body>
    <p><strong>From:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Subject:</strong> {subject}</p>
    <p><strong>Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    <hr>
    <p><strong>Message:</strong></p>
    <p>{message.replace(chr(10), '<br>')}</p>
  </body>
</html>
"""
        
        part1 = MIMEText(text_body, 'plain')
        part2 = MIMEText(html_body, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email via Gmail SMTP
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            server.send_message(msg)
        
        print(f"Email sent successfully from {email}")
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"Gmail auth error: {str(e)}")
        print(f"Gmail address: {GMAIL_ADDRESS}")
        print("Make sure you're using a Gmail App Password (not your regular password)")
        raise Exception("Gmail authentication failed. Use a Gmail App Password generated at myaccount.google.com/apppasswords")
    except smtplib.SMTPException as e:
        print(f"SMTP error: {str(e)}")
        raise Exception(f"SMTP error occurred: {str(e)}")
    except Exception as e:
        print(f"Email error: {str(e)}")
        raise Exception(f"Error sending email: {str(e)}")

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV', 'development') != 'production'
    print("Starting Flask server...")
    print(f"Debug mode: {debug_mode}")
    app.run(host='0.0.0.0', debug=debug_mode, port=5000)