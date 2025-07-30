import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

app = Flask(__name__)

# CORS configuration for production
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://mental-health-frontend.onrender.com",  # Update with your actual frontend URL
    "*"  # You can remove this and specify exact domains for better security
])

# Root route - this fixes the 404 error
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Mental Health ML API is running!",
        "status": "healthy",
        "service": "ML Prediction API",
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)"
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "service": "ML API",
        "timestamp": pd.Timestamp.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Your existing prediction logic goes here
        # For now, returning a mock response
        prediction_result = {
            "prediction": "low_risk",  # Replace with actual prediction
            "confidence": 0.85,
            "risk_factors": ["stress", "sleep"],  # Replace with actual analysis
            "recommendations": ["Consider stress management techniques", "Improve sleep hygiene"]
        }
        
        return jsonify(prediction_result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add more endpoints as needed for your ML model
@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify({
        "model_type": "Mental Health Risk Assessment",
        "version": "1.0.0",
        "features": ["mood", "sleep", "stress", "social_support"],  # Update with your actual features
        "last_trained": "2025-01-01"  # Update with actual training date
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"Starting Flask app on port {port}")
    print(f"Debug mode: {debug_mode}")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)