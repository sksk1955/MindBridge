# Add these imports at the top of your existing api.py
import os
from flask import Flask
from flask_cors import CORS

# Your existing Flask app setup
app = Flask(__name__)

# Update CORS configuration for production
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5173", 
    "https://your-app-frontend.onrender.com",  # Replace with your actual frontend URL
    # Add your frontend domain here once deployed
])

# Your existing routes and logic here...
# (Keep all your existing code)

# Update the main execution block at the bottom:
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)