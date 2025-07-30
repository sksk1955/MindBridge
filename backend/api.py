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

# CORS configuration for production - FIXED URL
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://mental-health-frontend-7u5z.onrender.com",  # CORRECTED URL
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
            "predict": "/api/predict (POST)"  # Updated to show correct endpoint
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "service": "ML API",
        "timestamp": pd.Timestamp.now().isoformat()
    })

# Add the /api/predict route that your frontend expects
@app.route('/api/predict', methods=['POST'])
def predict_api():
    try:
        # Get JSON data from request
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided", "status": "error"}), 400
        
        print(f"Received prediction request: {data}")  # Debug log
        
        # Mock prediction logic - replace with your actual ML model
        # Calculate a simple risk score based on provided data
        risk_score = calculate_risk_score(data)
        prediction = 1 if risk_score > 50 else 0
        probability = risk_score / 100.0
        
        prediction_result = {
            "risk_score": risk_score,
            "prediction": prediction,
            "probability": probability,
            "status": "success"
        }
        
        print(f"Sending prediction result: {prediction_result}")  # Debug log
        return jsonify(prediction_result)
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")  # Debug log
        return jsonify({"error": str(e), "status": "error"}), 500

def calculate_risk_score(data):
    """Simple risk score calculation - replace with your actual ML model"""
    score = 0
    
    # Academic/Work pressure (0-20 points)
    pressure_map = {"None": 0, "Low": 5, "Moderate": 10, "High": 15, "Extreme": 20}
    score += pressure_map.get(data.get("Academic Pressure", "None"), 0)
    score += pressure_map.get(data.get("Work Pressure", "None"), 0)
    
    # Sleep duration (0-15 points)
    sleep_map = {"<5": 15, "5-6": 10, "6-7": 5, "7-8": 0, ">8": 0}
    score += sleep_map.get(data.get("Sleep Duration", "7-8"), 5)
    
    # Suicidal thoughts (0-30 points)
    if data.get("Have you ever had suicidal thoughts ?") == "Yes":
        score += 30
    
    # Financial stress (0-15 points)
    score += pressure_map.get(data.get("Financial Stress", "None"), 0) * 0.75
    
    # Family history (0-10 points)
    if data.get("Family History of Mental Illness") == "Yes":
        score += 10
    
    # Satisfaction scores (reverse scoring, 0-10 points each)
    satisfaction_map = {"Very Satisfied": 0, "Satisfied": 2, "Neutral": 5, "Unsatisfied": 8, "Very Unsatisfied": 10}
    score += satisfaction_map.get(data.get("Study Satisfaction", "Neutral"), 5)
    score += satisfaction_map.get(data.get("Job Satisfaction", "Neutral"), 5)
    
    return min(score, 100)  # Cap at 100

# Keep the original /predict route for backward compatibility
@app.route('/predict', methods=['POST'])
def predict():
    return predict_api()

# Add more endpoints as needed for your ML model
@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify({
        "model_type": "Mental Health Risk Assessment",
        "version": "1.0.0",
        "features": ["Academic Pressure", "Work Pressure", "Sleep Duration", "Financial Stress"],
        "last_trained": "2025-01-01"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"Starting Flask app on port {port}")
    print(f"Debug mode: {debug_mode}")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)