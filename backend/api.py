from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

class DepressionPredictor:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.feature_names = []
        self.weights = {}
        self.risk_thresholds = {}
        
    def load_and_preprocess_data(self, csv_filename):
        """Load and preprocess the dataset"""
        try:
            df = pd.read_csv(csv_filename)
            print(f"Successfully loaded {len(df)} records from {csv_filename}")
        except Exception as e:
            print(f"Error loading CSV file: {e}")
            # Create sample data as fallback
            return self.create_sample_data()
        
        # Handle missing values
        for col in df.columns:
            if df[col].dtype == 'object':
                df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown')
            else:
                df[col] = df[col].fillna(df[col].median())
        
        # Store feature names
        self.feature_names = [col for col in df.columns if col not in ['id', 'Depression']]
        
        # Encode categorical variables
        categorical_columns = []
        for col in df.columns:
            if col in ['id', 'Depression']:
                continue
            if df[col].dtype == 'object' or df[col].nunique() <= 10:
                categorical_columns.append(col)
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
                self.label_encoders[col] = le
        
        # Prepare features and target
        X = df.drop(['Depression'], axis=1)
        if 'id' in X.columns:
            X = X.drop(['id'], axis=1)
        y = df['Depression']
        
        # Scale numerical features
        numerical_cols = X.select_dtypes(include=[np.number]).columns.tolist()
        X_scaled = X.copy()
        if numerical_cols:
            X_scaled[numerical_cols] = self.scaler.fit_transform(X[numerical_cols])
        
        return X_scaled, y, df
    
    def create_sample_data(self):
        """Create sample data as fallback"""
        sample_data = {
            'Gender': ['Male', 'Female', 'Male', 'Female', 'Male'] * 20,
            'Age': [20, 21, 22, 23, 24] * 20,
            'City': ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'] * 20,
            'Profession': ['Student'] * 100,
            'Academic_Pressure': [1, 2, 3, 4, 5] * 20,
            'Work_Pressure': [1, 2, 3, 4, 5] * 20,
            'CGPA': [6.0, 7.0, 8.0, 9.0, 5.0] * 20,
            'Study_Satisfaction': [1, 2, 3, 4, 5] * 20,
            'Job_Satisfaction': [0, 1, 2, 3, 4] * 20,
            'Sleep_Duration': ['5-6_hours', '7-8_hours', 'Less_than_5_hours', 'More_than_8_hours', '5-6_hours'] * 20,
            'Dietary_Habits': ['Healthy', 'Moderate', 'Unhealthy', 'Healthy', 'Moderate'] * 20,
            'Degree': ['BSc', 'BA', 'BTech', 'BCA', 'BCom'] * 20,
            'Have_you_ever_had_suicidal_thoughts': ['No', 'Yes', 'No', 'No', 'Yes'] * 20,
            'Work_Study_Hours': [6, 7, 8, 9, 10] * 20,
            'Financial_Stress': [1, 2, 3, 4, 5] * 20,
            'Family_History_of_Mental_Illness': ['No', 'Yes', 'No', 'No', 'Yes'] * 20,
            'Depression': [0, 1, 0, 0, 1] * 20
        }
        df = pd.DataFrame(sample_data)
        return self.load_and_preprocess_data_from_df(df)
    
    def load_and_preprocess_data_from_df(self, df):
        """Process DataFrame directly"""
        self.feature_names = [col for col in df.columns if col not in ['id', 'Depression']]
        
        # Encode categorical variables
        for col in df.columns:
            if col in ['id', 'Depression']:
                continue
            if df[col].dtype == 'object':
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
                self.label_encoders[col] = le
        
        X = df.drop(['Depression'], axis=1)
        if 'id' in X.columns:
            X = X.drop(['id'], axis=1)
        y = df['Depression']
        
        # Scale numerical features
        numerical_cols = X.select_dtypes(include=[np.number]).columns.tolist()
        X_scaled = X.copy()
        if numerical_cols:
            X_scaled[numerical_cols] = self.scaler.fit_transform(X[numerical_cols])
        
        return X_scaled, y, df
    
    def train_model(self, X, y):
        """Train the gradient boosting model"""
        if len(X) < 10:
            raise ValueError("Not enough data to train the model")
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y if len(set(y)) > 1 else None
        )
        
        self.model = GradientBoostingClassifier(random_state=42)
        self.model.fit(X_train, y_train)
        
        # Calculate accuracy
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model trained with accuracy: {accuracy:.4f}")
        
        return accuracy
    
    def map_frontend_to_model_columns(self, user_data):
        """Map frontend column names to model column names"""
        column_mapping = {
            'Gender': 'Gender',
            'Age': 'Age',
            'City': 'City',
            'Profession': 'Profession',
            'Academic Pressure': 'Academic_Pressure',
            'Work Pressure': 'Work_Pressure',
            'CGPA': 'CGPA',
            'Study Satisfaction': 'Study_Satisfaction',
            'Job Satisfaction': 'Job_Satisfaction',
            'Sleep Duration': 'Sleep_Duration',
            'Dietary Habits': 'Dietary_Habits',
            'Degree': 'Degree',
            'Have you ever had suicidal thoughts ?': 'Have_you_ever_had_suicidal_thoughts',
            'Work/Study Hours': 'Work_Study_Hours',
            'Financial Stress': 'Financial_Stress',
            'Family History of Mental Illness': 'Family_History_of_Mental_Illness'
        }
        
        mapped_data = {}
        for frontend_key, model_key in column_mapping.items():
            if frontend_key in user_data:
                mapped_data[model_key] = user_data[frontend_key]
        
        return mapped_data
    
    def preprocess_user_input(self, user_data):
        """Preprocess user input to match training data format"""
        # Map frontend column names to model column names
        mapped_data = self.map_frontend_to_model_columns(user_data)
        
        # Convert to DataFrame
        user_df = pd.DataFrame([mapped_data])
        
        # Handle categorical columns
        categorical_columns = ['Gender', 'City', 'Profession', 'Sleep_Duration', 
                             'Dietary_Habits', 'Degree', 'Have_you_ever_had_suicidal_thoughts', 
                             'Family_History_of_Mental_Illness']
        
        for col in categorical_columns:
            if col in user_df.columns and col in self.label_encoders:
                try:
                    user_df[col] = self.label_encoders[col].transform(user_df[col].astype(str))
                except ValueError:
                    # Handle unseen categories by assigning the most common category
                    most_common = self.label_encoders[col].classes_[0]
                    user_df[col] = self.label_encoders[col].transform([most_common])
        
        # Convert numeric columns
        numeric_columns = ['Age', 'Academic_Pressure', 'Work_Pressure', 'CGPA', 
                          'Study_Satisfaction', 'Job_Satisfaction', 'Work_Study_Hours', 
                          'Financial_Stress']
        
        for col in numeric_columns:
            if col in user_df.columns:
                user_df[col] = pd.to_numeric(user_df[col], errors='coerce')
                if user_df[col].isna().any():
                    user_df[col] = user_df[col].fillna(0)
        
        # Ensure all expected columns are present with correct order
        expected_cols = self.feature_names
        for col in expected_cols:
            if col not in user_df.columns:
                user_df[col] = 0  # Default value for missing columns
        
        # Reorder columns to match training data
        user_df = user_df[expected_cols]
        
        # Scale numerical features
        numerical_cols = [col for col in numeric_columns if col in user_df.columns]
        if numerical_cols:
            user_df[numerical_cols] = self.scaler.transform(user_df[numerical_cols])
        
        return user_df
    
    def predict_depression(self, user_data):
        """Predict depression for user input"""
        try:
            user_df = self.preprocess_user_input(user_data)
            prediction = self.model.predict(user_df)[0]
            probability = self.model.predict_proba(user_df)[0][1] if hasattr(self.model, 'predict_proba') else prediction
            return int(prediction), float(probability)
        except Exception as e:
            print(f"Prediction error: {e}")
            return 0, 0.0
    
    def calculate_risk_score(self, user_data):
        """Calculate risk score based on user responses"""
        risk_factors = {
            'Academic Pressure': {'High': 3, 'Extreme': 4, 'Moderate': 2},
            'Work Pressure': {'High': 3, 'Extreme': 4, 'Moderate': 2},
            'Financial Stress': {'High': 3, 'Extreme': 4, 'Moderate': 2},
            'Sleep Duration': {'<5': 4, '5-6': 2},
            'Study Satisfaction': {'Very Unsatisfied': 4, 'Unsatisfied': 3},
            'Job Satisfaction': {'Very Unsatisfied': 4, 'Unsatisfied': 3},
            'Have you ever had suicidal thoughts ?': {'Yes': 5},
            'Family History of Mental Illness': {'Yes': 2},
            'Dietary Habits': {'Unhealthy': 2}
        }
        
        total_score = 0
        max_possible_score = 30  # Approximate maximum
        
        for factor, value in user_data.items():
            if factor in risk_factors and value in risk_factors[factor]:
                total_score += risk_factors[factor][value]
        
        # Normalize to 0-100 scale
        risk_score = min(100, (total_score / max_possible_score) * 100)
        return risk_score

# Initialize the predictor
predictor = DepressionPredictor()

# Try to load and train the model
try:
    X, y, df = predictor.load_and_preprocess_data("Student Depression Dataset.csv")
    accuracy = predictor.train_model(X, y)
    print("Model initialized successfully!")
except Exception as e:
    print(f"Error initializing model: {e}")
    # Use sample data as fallback
    X, y, df = predictor.create_sample_data()
    accuracy = predictor.train_model(X, y)
    print("Model initialized with sample data!")

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        user_data = request.json
        print(f"Received data: {user_data}")
        
        # Make prediction
        prediction, probability = predictor.predict_depression(user_data)
        
        # Calculate risk score
        risk_score = predictor.calculate_risk_score(user_data)
        
        response = {
            "prediction": prediction,
            "probability": probability,
            "risk_score": risk_score,
            "status": "success"
        }
        
        print(f"Sending response: {response}")
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": predictor.model is not None})

if __name__ == "__main__":
    app.run(port=5000, debug=True)