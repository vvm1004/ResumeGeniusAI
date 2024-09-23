import json
import time
import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
import google.generativeai as genai
from resume_parser_module import parse_resume 
# Configure the Google Gemini API
genai.configure(api_key="AIzaSyBCvwMA6XriY5K6x2JHdd9DuoiN0ag5Lz8")



def analysField(field_name, job_name):
    try:
        # Define generation configuration
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 50,
            "max_output_tokens": 300,
            "response_mime_type": "application/json"
        }

        # Initialize the Generative Model
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config
        )

        # Start a chat session
        chat_session = model.start_chat(history=[])

        # Create the prompt for refining the text
        prompt = f"What fields should I include when listing my {field_name} field in my resume for {job_name} position? Just provide the field names as a list." 
        
        response = chat_session.send_message(prompt)

        if response and response.text.strip():
            fields_list = [field.strip() for field in response.text.split(',')]
            print("\nNew struct: ",fields_list)
            return fields_list
        else:
            print(f"Unable to refine {field_name}")
            return []

    except Exception as e:
        print(f"An error occurred while refining {field_name}: {e}")
        return []
def normalize_keys(data):
  
    if isinstance(data, dict):
        return {key.capitalize(): normalize_keys(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [normalize_keys(item) for item in data]
    else:
        return data
def get_job_position(data):
  
    possible_keys = ['Job_Position', 'Job_Title', 'Job','job_title','job_position','job','Job_title','Job_position', 'Title']

    for key in possible_keys:
        if key in data:
            job_position = data[key]
            return str(job_position)

    # Trường hợp không tìm thấy key nào phù hợp
    return ""
def process_data(data):
    new_data = {}
    
    for key, value in data.items():
        print("\n\t", key)
        
        # Kiểm tra nếu value không phải là null hoặc rỗng
        if value:
            if isinstance(value, list) and len(value) > 1:
                # Kiểm tra nếu danh sách chứa các dictionary
                if all(isinstance(item, dict) for item in value):
                    # Tạo các khóa mới cho từng phần tử trong danh sách
                    for i, item in enumerate(value):
                        new_key = f"{key}{i+1}"
                        new_data[new_key] = item
                else:
                    new_data[key] = value
            else:
                new_data[key] = value
    
    return new_data



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
                print(f"\nResult (list dict) for key=\t'{key}' \nand value=\t'{item_str}':\n\n\n\t", result)
            else:
                check_value= True
                
        if(check_value):
            item_str = str(value) 
            result = test_model(model, tokenizer, key, item_str)
            print(f"\nResult (list) for key=\t'{key}' \nand value=\t'{item_str}':\n\n\n\t", result)
    else:
        result = test_model(model, tokenizer, key, value)
        print(f"\nResult for key=\t'{key}' \nand value=\t'{value}':\n\n\n\t", result)

if __name__ == "__main__":
    model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'model')
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






    nomalFields=["Name","Email","Phone","Linkedin","Location","Title","Github"]
  
    pdf_path = 'E:\\Certificate\\10076271.pdf'
    resume_data = parse_resume(pdf_path)
    print(resume_data)
    resume_data1=normalize_keys(resume_data)
   # print(resume_data1)
    esdata=process_data(resume_data1)
    jobName= get_job_position(esdata)
    print(jobName)

    for key, value in esdata.items():
        if key in nomalFields: continue
        print(f"\n\n\tKey: {key},\n Value: {value}")

    print(f"\n\n\------------------------------------\n\n\n")
  
    for key, value in resume_data1.items():
        print("\t\tNEW DATA: \n\n\n",key,"\n\n",value,"\n\n")
        process_and_test_model(model, tokenizer, key, value)

    

 