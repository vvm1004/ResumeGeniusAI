import tensorflow as tf
import numpy as np


from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from ai_model.src.extract_data.resume_upgrade_module import normalize_keys, process_data, get_job_position, analysField, refine_field
from ai_model.src.extract_data.resume_parser_module import parse_resume
import time


def test_model(model, tokenizer, field_name, field_data):
    if model is None:
        raise ValueError("Model not loaded properly")
    if tokenizer is None:
        raise ValueError("Tokenizer not loaded properly")

    # Chuyển field_name và field_data thành sequence
    sequences = tokenizer.texts_to_sequences([field_name, field_data])
    
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
def process_and_test_model(model, tokenizer, key, value):
    if value is None:
        print(f"Value for key='{key}' is None. Skipping...")
        return
    
    if isinstance(value, dict):
        for sub_key, sub_value in value.items():
            process_and_test_model(model, tokenizer, sub_key, sub_value)
    elif isinstance(value, list):
        check_value=False
        for item in value:
            if isinstance(item, dict):
                item_str = str(item)  
                result = test_model(model, tokenizer, key, item_str)
                print(f"Result (list dict) for key='{key}' and value='{item_str}':", result)
            else:
                check_value= True
                
        if(check_value):
            item_str = str(value) 
            result = test_model(model, tokenizer, key, item_str)
            print(f"Result (list) for key='{key}' and value='{item_str}':", result)
    else:
        result = test_model(model, tokenizer, key, value)
        print(f"Result for key='{key}' and value='{value}':", result)

model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model')
model_path = os.path.join(model_dir, 'check_meaning.keras')
tokenizer_path = os.path.join(model_dir, 'check_meaning_tokenizer.json')

print("dir: ", model_path,"\n\t",tokenizer_path,"\n")
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

   
pdf_path = 'E:\\Certificate\\TRAN-DUONG-TRUONG-CV.pdf'
resume_data = parse_resume(pdf_path)
print(resume_data)
resume_data1=normalize_keys(resume_data)
print("Data\t\n",resume_data1)
esdata=process_data(resume_data1)

for key, value in resume_data1.items():
    print("\t\tNEW DATA: \n\n\n",key,"\n\n",value,"\n\n")
    process_and_test_model(model, tokenizer, key, value)

        