
import json
import joblib
import os
model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'model','edit','trained_model.pkl')
token_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),  'model','edit','vectorizer.pkl')

# Tải mô hình đã lưu
model = joblib.load(model_dir)
vectorizer = joblib.load(token_dir)  # Lưu vectorizer nếu cần

def predict_field_name(value):
    test_values = [str(value)]

    test_vectorized = vectorizer.transform(test_values)

    predictions = model.predict(test_vectorized)

    return predictions[0]  
