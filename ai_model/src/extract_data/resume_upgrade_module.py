import json
import time
import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
import google.generativeai as genai
from .resume_parser_module import parse_resume 
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
  
    possible_keys = ['Job_Position', 'Job_Title', 'Job','job_title','job_position','job','Job_title','Job_position', 'Title','Jobtitle','JobTitle']

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

def handleData(path):
    resume_data = parse_resume(path)
    print ("\n\n\n\n\n\t\t---------------------------------------\n\n\n\n")

    print(resume_data)
    resume_data1=normalize_keys(resume_data)
    print ("\n\n\n\n\n\t\t---------------------------------------\n\n\n\n")

    print(resume_data1)
    # esdata=process_data(resume_data1)
    jobName= get_job_position(resume_data1)
    return jobName, resume_data1
# if __name__ == "__main__":
    




#     nomalFields=["Name","Email","Phone","Linkedin","Location","Title","Github"]
  
#     pdf_path = 'E:\\Certificate\\10076271.pdf'
#     resume_data = parse_resume(pdf_path)
#     print(resume_data)
#     resume_data1=normalize_keys(resume_data)
#    # print(resume_data1)
#     esdata=process_data(resume_data1)
#     jobName= get_job_position(esdata)
#     print(jobName)

#     for key, value in esdata.items():
#         if key in nomalFields: continue
#         print(f"\n\n\tKey: {key},\n Value: {value}")

#     print(f"\n\n\------------------------------------\n\n\n")
  
#     for key, value in resume_data1.items():
#         print("\t\tNEW DATA: \n\n\n",key,"\n\n",value,"\n\n")
#         process_and_test_model(model, tokenizer, key, value)

    

 