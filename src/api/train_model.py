"""
Soil Irrigation Prediction Model Training Script

This script trains a machine learning model to predict irrigation needs
based on soil and environmental parameters.

Author: AgriVision AI Team
"""

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, BaggingClassifier
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_selection import SelectPercentile, f_classif
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.metrics import accuracy_score, classification_report

# --- Custom Transformer Classes ---
class SkipTransformer(BaseEstimator, TransformerMixin):
    """Transformer that passes data through unchanged"""
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return X

class Passthrough(BaseEstimator, TransformerMixin):
    """Passthrough transformer for pipeline compatibility"""
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return X

def generate_synthetic_data(n_samples=2000):
    """
    Generate synthetic soil and irrigation data for training.
    
    Args:
        n_samples (int): Number of samples to generate
    
    Returns:
        pd.DataFrame: Synthetic dataset with features and target
    """
    np.random.seed(42)
    
    data = {
        'N': np.random.randint(20, 150, n_samples),
        'P': np.random.randint(20, 100, n_samples),
        'K': np.random.randint(20, 100, n_samples),
        'temperature': np.random.uniform(15, 40, n_samples),
        'humidity': np.random.uniform(30, 100, n_samples),
        'ph': np.random.uniform(4.5, 9.0, n_samples),
        'rainfall': np.random.uniform(0, 300, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable based on logical rules
    # 0 = Irrigation needed, 1 = No irrigation needed
    df['irrigation_needed'] = 0
    
    # Logic: No irrigation needed if:
    # - High rainfall (>100mm) OR
    # - High humidity (>75%) AND moderate rainfall (>50mm)
    df.loc[(df['rainfall'] > 100) | 
           ((df['humidity'] > 75) & (df['rainfall'] > 50)), 
           'irrigation_needed'] = 1
    
    # Additional logic: Irrigation needed if very low humidity and low rainfall
    df.loc[(df['humidity'] < 50) & (df['rainfall'] < 30), 'irrigation_needed'] = 0
    
    return df

def train_model():
    """
    Train the soil irrigation prediction model and save it.
    """
    print("=" * 60)
    print("SOIL IRRIGATION PREDICTION MODEL TRAINING")
    print("=" * 60)
    
    # Step 1: Generate synthetic data
    print("\n[1/5] Generating synthetic training data...")
    df = generate_synthetic_data(n_samples=2000)
    print(f"✓ Generated {len(df)} samples")
    print(f"✓ Features: {list(df.columns[:-1])}")
    print(f"✓ Target distribution:")
    print(f"    - Irrigation needed (0): {(df['irrigation_needed'] == 0).sum()}")
    print(f"    - No irrigation needed (1): {(df['irrigation_needed'] == 1).sum()}")
    
    # Step 2: Split data
    print("\n[2/5] Splitting data into train and test sets...")
    X = df.drop('irrigation_needed', axis=1)
    y = df['irrigation_needed']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"✓ Training samples: {len(X_train)}")
    print(f"✓ Test samples: {len(X_test)}")
    
    # Step 3: Create pipeline
    print("\n[3/5] Building ML pipeline...")
    
    # Create a pipeline with preprocessing and model
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('feature_union', FeatureUnion([
            ('passthrough', Passthrough()),
            ('feature_selection', SelectPercentile(f_classif, percentile=80))
        ])),
        ('classifier', BaggingClassifier(
            estimator=RandomForestClassifier(
                n_estimators=50,
                max_depth=10,
                random_state=42
            ),
            n_estimators=10,
            random_state=42
        ))
    ])
    
    print("✓ Pipeline created:")
    print("    - StandardScaler (normalize features)")
    print("    - Feature selection (80th percentile)")
    print("    - BaggingClassifier with RandomForest")
    
    # Step 4: Train the model
    print("\n[4/5] Training the model...")
    pipeline.fit(X_train, y_train)
    print("✓ Model training complete!")
    
    # Step 5: Evaluate the model
    print("\n[5/5] Evaluating model performance...")
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"✓ Test Accuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, 
                                target_names=['Irrigation Needed', 'No Irrigation']))
    
    # Step 6: Save the model
    print("\n[6/6] Saving the model...")
    model_filename = 'best_pipeline.pkl'
    joblib.dump(pipeline, model_filename)
    print(f"✓ Model saved as: {model_filename}")
    
    # Test the saved model
    print("\n" + "=" * 60)
    print("TESTING SAVED MODEL")
    print("=" * 60)
    
    loaded_pipeline = joblib.load(model_filename)
    
    # Test with sample data
    test_samples = [
        {
            'name': 'Dry soil - needs irrigation',
            'data': {'N': 50, 'P': 50, 'K': 50, 'temperature': 35, 
                    'humidity': 40, 'ph': 6.5, 'rainfall': 20}
        },
        {
            'name': 'Wet soil - no irrigation',
            'data': {'N': 80, 'P': 60, 'K': 70, 'temperature': 25, 
                    'humidity': 85, 'ph': 6.8, 'rainfall': 150}
        },
        {
            'name': 'Moderate conditions',
            'data': {'N': 70, 'P': 55, 'K': 60, 'temperature': 28, 
                    'humidity': 70, 'ph': 6.5, 'rainfall': 80}
        }
    ]
    
    print("\nTest Predictions:")
    for sample in test_samples:
        test_df = pd.DataFrame([sample['data']])
        prediction = loaded_pipeline.predict(test_df)[0]
        result = "No irrigation needed" if prediction == 1 else "Irrigation needed"
        print(f"\n  {sample['name']}:")
        print(f"    Input: {sample['data']}")
        print(f"    Prediction: {result} (class {prediction})")
    
    print("\n" + "=" * 60)
    print("✓ MODEL TRAINING COMPLETE!")
    print("=" * 60)
    print(f"\nYour model file '{model_filename}' is ready to use!")
    print("You can now use it with the FastAPI server (main_api.py)")
    print("\nNext steps:")
    print("  1. Copy 'best_pipeline.pkl' to the same folder as 'main_api.py'")
    print("  2. Run: python main_api.py")
    print("  3. Use the Soil Analysis page in your web app!")
    print("=" * 60)

if __name__ == '__main__':
    try:
        train_model()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("\nMake sure you have all required packages installed:")
        print("  pip install pandas numpy scikit-learn joblib")
