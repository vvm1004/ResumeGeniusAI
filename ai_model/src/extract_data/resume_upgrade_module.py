import json
import time

import google.generativeai as genai
from resume_parser_module import parse_resume 
# Configure the Google Gemini API
genai.configure(api_key="AIzaSyBCvwMA6XriY5K6x2JHdd9DuoiN0ag5Lz8")

profile_fields= ["Name", "Contact Information (Phone, Email, LinkedIn)", "Summary/Objective"]
experience_fields = ["Job Title", "Company", "Period", "Location", "Description"]
education_fields = ["Degree", "Institution", "Period", "Location", "Description"]
projects_fields = ["Title", "Company/Organization", "Period", "Description"]
awards_certifications_fields = ["Title", "Institution", "Date", "Description"]
experience_fields = ["Role", "Organization", "Period", "Location", "Description"]

def refine_field_text(field_name, field_value):
    try:
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 50,
            "max_output_tokens": 300,
            "response_mime_type":  "application/json"
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config
        )

        chat_session = model.start_chat(history=[])

        prompt = f"use JSON data structure to represent the following information {field_value} of field {field_value} {field_name} in my resume so that it is more beautiful and clear, more professional, identifies the technologies used, time, description...." 
        response = chat_session.send_message(prompt)

        if response and response.text.strip():
            return response.text.strip()
        else:
            print(f"Unable to refine {field_name}")
            return field_value

    except Exception as e:
        print(f"An error occurred while refining {field_name}: {e}")
        return field_value

def refine_cv_field(field_name, field_value):
    
    if isinstance(field_value, list):
        field_value_str = "\n".join([json.dumps(item, ensure_ascii=False) for item in field_value])
    else:
        field_value_str = str(field_value)

    refined_text = refine_field_text(field_name, field_value_str)

    if field_name == "interests":
        refined_value = [item.strip() for item in refined_text.split("\n") if item.strip()]
    else:
        refined_value = refined_text

    return json.dumps({field_name: refined_value}, ensure_ascii=False, indent=4)




def refine_field(job_name, field_name, field_structure, field_value):
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

        # Determine if the field is presented as text or JSON
        if isinstance(field_value, list) or isinstance(field_value, dict):
            # JSON structure
            prompt = f"I have the following {field_name} data for a {job_name} position presented in JSON format: {field_value}. Please refine the structure, grammar, and style according to the best practices for CV writing, keeping the following fields intact: {field_structure}."
        else:
            # Plain text
            prompt = f"I have the following {field_name} data for a {job_name} position: '{field_value}'. Please refine the grammar, style, and make it more professional."

        # Send the prompt to Gemini API
        response = chat_session.send_message(prompt)

        # Check the response and return the refined text or structure
        if response and response.text.strip():
            return response.text.strip()
        else:
            print(f"Unable to refine {field_name}")
            return field_value

    except Exception as e:
        print(f"An error occurred while refining {field_name}: {e}")
        return field_value

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



if __name__ == "__main__":
    field_name = "skills"
    field_name = "certification"
    field_name = "Personal Information"
    field_name = "Education"
    field_name = "Projects"
    field_name = "Activities"
    field_name = "References"
    field_name = "experiences"

    field_value = [
        {
            "title": "Software Gaminnn store",
            "company": "Axon",
            "period": "January 2022 - Present",
            "description": "Developed and maintained a game store management software application using Java, MySQL, and NetBeans. Utilized Git for version control and collaborative development. Contributed to all phases of the software development lifecycle, including design, implementation, testing, and deployment."
        }
    ]
    
    nomalFields=["Name","Email","Phone","Linkedin","Location","Title","Github"]
  
    pdf_path = 'E:\\Certificate\\TRAN-DUONG-TRUONG-CV.pdf'
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

       
  
    # jobName= get_job_position(resume_data1)
    # fields=analysField(field_name, jobName)
    # print(fields)
    # print(fields[1])
    # fields=analysField(field_name, "INTERN BACK-END DEVELOPER")
    # print(fields)
    # result =refine_field("INTERN BACK-END DEVELOPER",field_name, fields, field_value)
    # print("\n"+result)
    

 