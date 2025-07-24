import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier, ExtraTreesClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.inspection import permutation_importance
import warnings
warnings.filterwarnings('ignore')

class DepressionPredictor:
    def __init__(self):
        self.models = {}
        self.best_model = None
        self.feature_importance = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.feature_names = []
        
    def load_and_preprocess_data(self, csv_filename=None, data_string=None):
        """Load and preprocess the dataset from CSV file or data string"""
        if csv_filename:
            try:
                df = pd.read_csv(csv_filename)
                print(f"Successfully loaded {len(df)} records from {csv_filename}")
            except Exception as e:
                print(f"Error loading CSV file: {e}")
                print("Falling back to sample data...")
                return self.load_sample_data()
                
        else:
            # Parse the data string into a DataFrame (original method)
            lines = data_string.strip().split('\n')
            headers = lines[0].split()
            
            # Clean up headers
            self.feature_names = [h.replace('?', '').strip() for h in headers[1:]]  # Skip 'id'
            
            # Parse data rows
            data_rows = []
            for line in lines[1:]:
                row = line.split()
                data_rows.append(row)
            
            # Create DataFrame
            df = pd.DataFrame(data_rows, columns=headers)
        
        # Display basic info about the dataset
        print(f"Dataset shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        print(f"Depression distribution:")
        if 'Depression' in df.columns:
            print(df['Depression'].value_counts())
        
        # Handle missing values
        print(f"Missing values per column:")
        missing_values = df.isnull().sum()
        print(missing_values[missing_values > 0])
        
        # Fill missing values appropriately
        for col in df.columns:
            if df[col].dtype == 'object':
                df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown')
            else:
                df[col] = df[col].fillna(df[col].median())
        
        # Store feature names for later use
        self.feature_names = [col for col in df.columns if col not in ['id', 'Depression']]
        
        # Convert columns to appropriate types with error handling
        numeric_columns = []
        categorical_columns = []
        
        for col in df.columns:
            if col == 'id':
                continue
            
            # Try to convert to numeric
            try:
                df[col] = pd.to_numeric(df[col], errors='ignore')
                if df[col].dtype in ['int64', 'float64']:
                    numeric_columns.append(col)
                else:
                    categorical_columns.append(col)
            except:
                categorical_columns.append(col)
        
        print(f"Numeric columns: {numeric_columns}")
        print(f"Categorical columns: {categorical_columns}")
        
        # Encode categorical variables
        for col in categorical_columns:
            if col in df.columns and col != 'Depression':
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
                self.label_encoders[col] = le
        
        # Prepare features and target
        if 'Depression' in df.columns:
            X = df.drop(['Depression'], axis=1)
            if 'id' in X.columns:
                X = X.drop(['id'], axis=1)
            y = df['Depression']
        else:
            raise ValueError("Depression column not found in dataset")
        
        # Scale numerical features
        numerical_cols = X.select_dtypes(include=[np.number]).columns.tolist()
        
        X_scaled = X.copy()
        if numerical_cols:
            X_scaled[numerical_cols] = self.scaler.fit_transform(X[numerical_cols])
        
        return X_scaled, y, df
    
    def load_sample_data(self):
        """Load sample data as fallback"""
        data_string = """id Gender Age City Profession Academic_Pressure Work_Pressure CGPA Study_Satisfaction Job_Satisfaction Sleep_Duration Dietary_Habits Degree Have_you_ever_had_suicidal_thoughts Work_Study_Hours Financial_Stress Family_History_of_Mental_Illness Depression
2 Male 33 Visakhapatnam Student 5 0 8.97 2 0 5-6_hours Healthy B.Pharm Yes 3 1 No 1
8 Female 24 Bangalore Student 2 0 5.9 5 0 5-6_hours Moderate BSc No 3 2 Yes 0
26 Male 31 Srinagar Student 3 0 7.03 5 0 Less_than_5_hours Healthy BA No 9 1 Yes 0
30 Female 28 Varanasi Student 3 0 5.59 2 0 7-8_hours Moderate BCA Yes 4 5 Yes 1
32 Female 25 Jaipur Student 4 0 8.13 3 0 5-6_hours Moderate M.Tech Yes 1 1 No 0"""
        
        return self.load_and_preprocess_data(data_string=data_string)
    
    def initialize_models(self):
        """Initialize only Gradient Boosting model"""
        self.models = {
            'Gradient Boosting': GradientBoostingClassifier(random_state=42)
        }
    
    def train_and_evaluate_models(self, X, y):
        """Train and evaluate all models"""
        if len(X) < 10 or len(set(y)) < 2:
            raise ValueError("Not enough data or not enough classes to train/test. Please provide a larger dataset with at least 10 rows and at least 2 classes.")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        results = {}
        
        for name, model in self.models.items():
            print(f"Training {name}...")
            
            # Train the model
            model.fit(X_train, y_train)
            
            # Make predictions
            y_pred = model.predict(X_test)
            y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else y_pred
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            precision = precision_score(y_test, y_pred, average='weighted')
            recall = recall_score(y_test, y_pred, average='weighted')
            f1 = f1_score(y_test, y_pred, average='weighted')
            
            # Cross-validation score
            cv_score = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy').mean()
            
            results[name] = {
                'model': model,
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'cv_score': cv_score,
                'y_pred': y_pred,
                'y_pred_proba': y_pred_proba
            }
        
        return results, X_test, y_test
    
    def get_feature_importance(self, X):
        """Calculate feature importance using the best model"""
        if hasattr(self.best_model, 'feature_importances_'):
            importance = self.best_model.feature_importances_
        else:
            # Use permutation importance for models without built-in feature importance
            perm_importance = permutation_importance(self.best_model, X, y, n_repeats=10, random_state=42)
            importance = perm_importance.importances_mean
        
        feature_importance_df = pd.DataFrame({
            'feature': X.columns,
            'importance': importance
        }).sort_values('importance', ascending=False)
        
        return feature_importance_df
    
    def predict_depression(self, user_data):
        """Predict depression for a single user"""
        # Convert user data to the same format as training data
        user_df = pd.DataFrame([user_data])
        
        # Apply same preprocessing
        categorical_cols = ['Gender', 'City', 'Profession', 'Sleep Duration', 
                          'Dietary Habits', 'Degree', 'Have you ever had suicidal thoughts ?', 
                          'Family History of Mental Illness']
        
        for col in categorical_cols:
            if col in user_df.columns and col in self.label_encoders:
                try:
                    user_df[col] = self.label_encoders[col].transform(user_df[col].astype(str))
                except ValueError:
                    # Handle unseen categories
                    user_df[col] = 0
        
        # Scale numerical features
        numerical_cols = ['Age', 'Academic Pressure', 'Work Pressure', 'CGPA', 
                         'Study Satisfaction', 'Job Satisfaction', 'Work/Study Hours', 
                         'Financial Stress']
        
        user_df[numerical_cols] = self.scaler.transform(user_df[numerical_cols])
        
        # Make prediction
        prediction = self.best_model.predict(user_df)[0]
        prediction_proba = self.best_model.predict_proba(user_df)[0][1] if hasattr(self.best_model, 'predict_proba') else prediction
        
        return prediction, prediction_proba
    
    def calculate_data_driven_weights(self, df):
        """Calculate weights based on actual data correlation and statistical significance"""
        weights = {}
        risk_thresholds = {}
        
        # For each feature, calculate its correlation with depression
        feature_stats = {}
        
        for column in df.columns:
            if column in ['id', 'Depression']:
                continue
                
            # Calculate correlation with depression
            correlation = df[column].corr(df['Depression'])
            
            # Calculate odds ratio for categorical variables
            if df[column].dtype == 'object' or df[column].nunique() <= 10:
                # For categorical/discrete variables
                crosstab = pd.crosstab(df[column], df['Depression'])
                if crosstab.shape == (2, 2):  # 2x2 contingency table
                    # Calculate odds ratio
                    odds_ratio = (crosstab.iloc[0,0] * crosstab.iloc[1,1]) / (crosstab.iloc[0,1] * crosstab.iloc[1,0] + 1e-8)
                else:
                    odds_ratio = 1.0
            else:
                odds_ratio = 1.0
            
            # Calculate depression rate by feature value
            depression_rates = df.groupby(column)['Depression'].mean()
            max_depression_rate = depression_rates.max()
            min_depression_rate = depression_rates.min()
            rate_difference = max_depression_rate - min_depression_rate
            
            # Determine high-risk categories/values
            high_risk_threshold = depression_rates.mean() + depression_rates.std()
            high_risk_values = depression_rates[depression_rates > high_risk_threshold].index.tolist()
            
            feature_stats[column] = {
                'correlation': abs(correlation) if not pd.isna(correlation) else 0,
                'odds_ratio': abs(np.log(odds_ratio)) if odds_ratio > 0 else 0,
                'rate_difference': rate_difference,
                'high_risk_values': high_risk_values,
                'depression_rates': depression_rates
            }
        
        # Calculate composite weights
        correlations = [stats['correlation'] for stats in feature_stats.values()]
        max_correlation = max(correlations) if correlations else 1
        
        for feature, stats in feature_stats.items():
            # Normalize correlation to 0-2 scale
            normalized_correlation = (stats['correlation'] / max_correlation) * 2
            
            # Combine multiple factors for weight
            weight = normalized_correlation * (1 + stats['rate_difference']) * (1 + stats['odds_ratio']/10)
            
            weights[feature] = max(0.1, min(3.0, weight))  # Cap between 0.1 and 3.0
            risk_thresholds[feature] = stats['high_risk_values']
        
        return weights, risk_thresholds, feature_stats

    def generate_detailed_score(self, user_data, weights=None, risk_thresholds=None):
        """Generate detailed scoring based on data-driven feature importance"""
        scores = {}
        total_risk_score = 0
        
        # Use provided weights or fall back to feature importance
        if weights is None or risk_thresholds is None:
            # Fallback to feature importance weights
            if self.feature_importance is not None:
                weights = dict(zip(self.feature_importance['feature'], 
                                 self.feature_importance['importance'] * 2))  # Scale up
                risk_thresholds = {
                    'Academic Pressure': [4, 5],
                    'Work Pressure': [4, 5], 
                    'Financial Stress': [4, 5],
                    'Sleep Duration': ['Less than 5 hours'],
                    'Study Satisfaction': [1, 2],
                    'Job Satisfaction': [1, 2],
                    'Have you ever had suicidal thoughts ?': ['Yes', 1],
                    'Family History of Mental Illness': ['Yes', 1],
                    'Dietary Habits': ['Unhealthy'],
                    'Work/Study Hours': [10, 11, 12]
                }
            else:
                # Emergency fallback
                weights = {col: 1.0 for col in user_data.keys()}
                risk_thresholds = {col: [] for col in user_data.keys()}
        
        for factor in user_data.keys():
            if factor in weights:
                value = user_data[factor]
                high_risk_values = risk_thresholds.get(factor, [])
                is_high_risk = value in high_risk_values
                weight = weights[factor]
                risk_score = weight * (1.0 if is_high_risk else 0.2)
                
                scores[factor] = {
                    'value': value,
                    'risk_score': risk_score,
                    'weight': weight,
                    'is_high_risk': is_high_risk,
                    'high_risk_threshold': high_risk_values
                }
                total_risk_score += risk_score
        
        # Normalize to 0-100 scale
        max_possible_score = sum(weights.values())
        normalized_score = min(100, (total_risk_score / max_possible_score) * 100)
        
        return scores, normalized_score

    def analyze_feature_impact(self, df):
        """Comprehensive analysis of how each feature impacts depression"""
        analysis = {}
        
        print("\n" + "="*80)
        print("DATA-DRIVEN FEATURE IMPACT ANALYSIS")
        print("="*80)
        
        for column in df.columns:
            if column in ['id', 'Depression']:
                continue
                
            print(f"\n📊 {column.upper()}")
            print("-" * 50)
            
            # Basic statistics
            correlation = df[column].corr(df['Depression'])
            print(f"Correlation with Depression: {correlation:.4f}")
            
            # Depression rates by category/value
            depression_by_value = df.groupby(column).agg({
                'Depression': ['count', 'sum', 'mean']
            }).round(4)
            depression_by_value.columns = ['Total_Count', 'Depressed_Count', 'Depression_Rate']
            
            print("Depression rates by value:")
            print(depression_by_value)
            
            # Chi-square test for independence (if categorical)
            from scipy.stats import chi2_contingency
            try:
                contingency_table = pd.crosstab(df[column], df['Depression'])
                chi2, p_value, dof, expected = chi2_contingency(contingency_table)
                print(f"Chi-square test p-value: {p_value:.6f}")
                significance = "SIGNIFICANT" if p_value < 0.05 else "NOT SIGNIFICANT"
                print(f"Statistical significance: {significance}")
            except:
                print("Chi-square test: Not applicable")
            
            analysis[column] = {
                'correlation': correlation,
                'depression_rates': depression_by_value,
                'p_value': p_value if 'p_value' in locals() else None
            }
        
        return analysis

# Example usage
def main():
    csv_filename = "Student Depression Dataset.csv"
    predictor = DepressionPredictor()
    print("Loading and preprocessing data from CSV file...")
    try:
        X, y, df = predictor.load_and_preprocess_data(csv_filename=csv_filename)
    except Exception as e:
        print(f"Error loading CSV: {e}")
        print("Using sample data for demonstration...")
        X, y, df = predictor.load_sample_data()

    print(f"\n📊 Dataset loaded successfully!")
    print(f"Total records: {len(df)}")
    print(f"Features: {len(X.columns)}")
    print(f"Depression cases: {sum(y)} ({sum(y)/len(y)*100:.1f}%)")
    print(f"Non-depression cases: {len(y)-sum(y)} ({(len(y)-sum(y))/len(y)*100:.1f}%)")

    # Initialize only Gradient Boosting
    predictor.initialize_models()

    # Train only Gradient Boosting
    print("\nTraining Gradient Boosting model...")
    results, X_test, y_test = predictor.train_and_evaluate_models(X, y)
    predictor.best_model = results['Gradient Boosting']['model']

    # Analyze feature impact with actual data
    print("Analyzing feature impact...")
    feature_analysis = predictor.analyze_feature_impact(df)
    
    # Calculate data-driven weights
    print("Calculating data-driven weights...")
    weights, risk_thresholds, feature_stats = predictor.calculate_data_driven_weights(df)
    
    print("\n" + "="*60)
    print("DATA-DRIVEN WEIGHTS (Based on Actual Data)")
    print("="*60)
    
    weight_df = pd.DataFrame({
        'Feature': weights.keys(),
        'Data_Driven_Weight': weights.values(),
        'Correlation': [feature_stats[f]['correlation'] for f in weights.keys()],
        'Depression_Rate_Difference': [feature_stats[f]['rate_difference'] for f in weights.keys()]
    }).sort_values('Data_Driven_Weight', ascending=False)
    
    print(weight_df)
    
    # Find best model
    best_model_name = max(results.keys(), key=lambda k: results[k]['f1_score'])
    predictor.best_model = results[best_model_name]['model']
    
    print("\n" + "="*60)
    print("MODEL COMPARISON RESULTS")
    print("="*60)
    
    # Display results
    results_df = pd.DataFrame({
        name: {
            'Accuracy': f"{result['accuracy']:.4f}",
            'Precision': f"{result['precision']:.4f}",
            'Recall': f"{result['recall']:.4f}",
            'F1-Score': f"{result['f1_score']:.4f}",
            'CV Score': f"{result['cv_score']:.4f}"
        }
        for name, result in results.items()
    }).T
    
    print(results_df)
    print(f"\nBest Model: {best_model_name}")
    
    # Feature importance
    print("\n" + "="*60)
    print("FEATURE IMPORTANCE (Top Contributing Factors)")
    print("="*60)
    
    feature_importance = predictor.get_feature_importance(X)
    predictor.feature_importance = feature_importance  # Store for later use
    print(feature_importance.head(10))
    
    # Example prediction with data-driven weights (using more realistic example)
    print("\n" + "="*60)
    print("EXAMPLE PREDICTION (Using Data-Driven Weights)")
    print("="*60)
    
    # Example user data that matches your dataset structure
    example_user = {
        'Gender': 'Female',
        'Age': 22,
        'City': 'Delhi', 
        'Profession': 'Student',
        'Academic_Pressure': 4,  # High pressure
        'Work_Pressure': 1,      # Low work pressure (student)
        'CGPA': 6.2,            # Average CGPA
        'Study_Satisfaction': 2, # Low satisfaction
        'Job_Satisfaction': 0,   # N/A for student
        'Sleep_Duration': 'Less than 5 hours',  # Poor sleep
        'Dietary_Habits': 'Moderate',
        'Degree': 'BSc',
        'Have_you_ever_had_suicidal_thoughts': 'Yes',  # High risk factor
        'Work_Study_Hours': 8,   # Normal study hours
        'Financial_Stress': 4,   # High financial stress
        'Family_History_of_Mental_Illness': 'No'
    }
    
    prediction, probability = predictor.predict_depression(example_user)
    detailed_scores, risk_score = predictor.generate_detailed_score(example_user, weights, risk_thresholds)
    
    print(f"Prediction: {'Depressed' if prediction == 1 else 'Not Depressed'}")
    print(f"Confidence: {probability:.2f}")
    print(f"Overall Risk Score: {risk_score:.1f}/100")
    
    print("\nDetailed Risk Analysis (Data-Driven):")
    for factor, data in detailed_scores.items():
        risk_level = "HIGH" if data['is_high_risk'] else "LOW"
        print(f"  {factor}: {data['value']} - Risk: {risk_level} (Weight: {data['weight']:.2f}, Score: {data['risk_score']:.2f})")
    
    return predictor, results, feature_importance, weights, risk_thresholds, feature_analysis

# Interactive prediction function
def get_user_prediction(predictor):
    """Interactive function to get user input and make prediction"""
    print("\n" + "="*60)
    print("DEPRESSION RISK ASSESSMENT")
    print("="*60)
    
    user_data = {}
    
    # Collect user input
    user_data['Gender'] = input("Gender (Male/Female): ")
    user_data['Age'] = int(input("Age: "))
    user_data['City'] = input("City: ")
    user_data['Profession'] = input("Profession: ")
    user_data['Academic Pressure'] = int(input("Academic Pressure (1-5): "))
    user_data['Work Pressure'] = int(input("Work Pressure (1-5): "))
    user_data['CGPA'] = float(input("CGPA: "))
    user_data['Study Satisfaction'] = int(input("Study Satisfaction (1-5): "))
    user_data['Job Satisfaction'] = int(input("Job Satisfaction (1-5): "))
    user_data['Sleep Duration'] = input("Sleep Duration (Less than 5 hours/5-6 hours/7-8 hours/More than 8 hours): ")
    user_data['Dietary Habits'] = input("Dietary Habits (Healthy/Moderate/Unhealthy): ")
    user_data['Degree'] = input("Degree: ")
    user_data['Have you ever had suicidal thoughts ?'] = input("Have you ever had suicidal thoughts? (Yes/No): ")
    user_data['Work/Study Hours'] = int(input("Work/Study Hours per day: "))
    user_data['Financial Stress'] = int(input("Financial Stress (1-5): "))
    user_data['Family History of Mental Illness'] = input("Family History of Mental Illness (Yes/No): ")
    
    # Make prediction
    prediction, probability = predictor.predict_depression(user_data)
    detailed_scores, risk_score = predictor.generate_detailed_score(user_data)
    
    print("\n" + "="*60)
    print("ASSESSMENT RESULTS")
    print("="*60)
    print(f"Prediction: {'HIGH RISK for Depression' if prediction == 1 else 'LOW RISK for Depression'}")
    print(f"Confidence: {probability:.2f}")
    print(f"Overall Risk Score: {risk_score:.1f}/100")
    
    print(f"\nRisk Level: {'CRITICAL' if risk_score > 70 else 'HIGH' if risk_score > 50 else 'MODERATE' if risk_score > 30 else 'LOW'}")
    
    print("\nDetailed Risk Analysis:")
    for factor, data in detailed_scores.items():
        risk_level = "HIGH" if data['is_high_risk'] else "LOW"
        print(f"  {factor}: {data['value']} - Risk: {risk_level} (Score: {data['risk_score']:.2f})")
    
    if risk_score > 50:
        print("\n⚠️  RECOMMENDATION: Consider consulting with a mental health professional.")
    
    return user_data, prediction, probability, risk_score

if __name__ == "__main__":
    # Run the main analysis
    predictor, results, feature_importance, weights, risk_thresholds, feature_analysis = main()
    
    # Uncomment the following line to run interactive prediction
    get_user_prediction(predictor)