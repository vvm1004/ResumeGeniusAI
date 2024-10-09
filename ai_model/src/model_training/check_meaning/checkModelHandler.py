import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
import os
model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'model','final','final_model.keras')
token_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),  'model','final','final_tokenizer.json')

# Tải mô hình và tokenizer
model = tf.keras.models.load_model(model_dir)
with open(token_dir, 'r') as f:
    tokenizer_json = f.read()
tokenizer = tokenizer_from_json(tokenizer_json)
def convert_to_string(data):
    if isinstance(data, dict):
        return " ".join([f"{key}: {value}" for key, value in data.items()])
    elif isinstance(data, list):
        return " ".join(convert_to_string(item) for item in data)
    else:
        return str(data)  # Handle other types (e.g., strings, numbers)

def test_model(model, tokenizer, field_name, field_data):
    if model is None:
        raise ValueError("Model not loaded properly")
    if tokenizer is None:
        raise ValueError("Tokenizer not loaded properly")
    field_data_str =convert_to_string(field_data)
    # Chuyển field_name và field_data thành sequence
    sequences = tokenizer.texts_to_sequences([field_name, field_data_str])
    
    # Lấy kích thước padding cho các input
    key_input_shape = model.input[0].shape[1]
    value_input_shape = model.input[1].shape[1]
    
    # Padding sequences cho key và value riêng biệt
    padded_key_sequence = pad_sequences(
        [sequences[0]], 
        maxlen=key_input_shape, 
        padding='post'
    )
    padded_value_sequence = pad_sequences(
        [sequences[1]], 
        maxlen=value_input_shape, 
        padding='post'
    )
    
    key_sequence = np.array(padded_key_sequence)
    value_sequence = np.array(padded_value_sequence)
    
    # Dự đoán
    try:
        prediction = model.predict([key_sequence, value_sequence])[0][0]
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None

    is_valid = prediction > 0.5
    
    # Xác định corrected_field_name dựa trên dự đoán
    corrected_field_name = []
    if is_valid:
        corrected_field_name = [field_name]
    
    # Kết quả trả về
    result = {
        "corrected_field_name": corrected_field_name,
        "is_valid": is_valid,
        "field_name": field_name,
        "prediction": float(prediction),
        "value": field_data
    }
    
    return result

def checkData(field_name, field_data):
    result = test_model(model, tokenizer, field_name, field_data)

    return result['is_valid']
