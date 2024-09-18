import tensorflow as tf
import numpy as np
import json
from sklearn.metrics import accuracy_score
import os
# Hàm tải dữ liệu từ file JSON
def load_data(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
    return data

# Hàm chuẩn bị dữ liệu cho mô hình
def prepare_evaluation_data(data, tokenizer):
    keys = [d['field_name'] for d in data]
    values = [d['field_data'] for d in data]
    labels = [d['label'] for d in data]
    
    # Chuyển đổi key và value thành sequence
    key_sequences = tokenizer.texts_to_sequences(keys)
    value_sequences = tokenizer.texts_to_sequences(values)

    # Padding các sequence để có độ dài bằng nhau
    key_sequences = tf.keras.preprocessing.sequence.pad_sequences(key_sequences, padding='post')
    value_sequences = tf.keras.preprocessing.sequence.pad_sequences(value_sequences, padding='post')

    return np.array(key_sequences), np.array(value_sequences), np.array(labels)

# Hàm đánh giá mô hình
def evaluate_model(model, tokenizer, data_path):
    # Tải dữ liệu đánh giá
    data = load_data(data_path)
    
    # Chuẩn bị dữ liệu cho mô hình
    key_sequences, value_sequences, labels = prepare_evaluation_data(data, tokenizer)
    
    # Dự đoán
    predictions = model.predict([key_sequences, value_sequences])
    
    # Chuyển đổi dự đoán thành nhãn
    predicted_labels = (predictions > 0.5).astype(int).flatten()
    
    # Tính toán accuracy
    accuracy = accuracy_score(labels, predicted_labels)
    
    return accuracy
model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'model')
model_path = os.path.join(model_dir, 'check_meaning.keras')
tokenizer_path = os.path.join(model_dir, 'check_meaning_tokenizer.json')
# Tải mô hình và tokenizer
try:
    model = tf.keras.models.load_model(model_path)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

try:
    with open(tokenizer_path, 'r') as f:
        tokenizer_json = f.read()
    tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(tokenizer_json)
except Exception as e:
    print(f"Error loading tokenizer: {e}")
    tokenizer = None

data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'data','training_data.json')

# Đánh giá mô hình nếu model và tokenizer được tải thành công
if model and tokenizer:
    accuracy = evaluate_model(model, tokenizer, data_dir)
    print(f"Model Accuracy: {accuracy:.4f}")
else:
    print("Failed to load model or tokenizer.")
