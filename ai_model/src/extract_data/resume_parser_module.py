import json
from pyresparser import ResumeParser
from pdfminer.high_level import extract_text
import google.generativeai as genai
import re
import logging
import os

# Configure the Google Gemini API
genai.configure(api_key="AIzaSyBCvwMA6XriY5K6x2JHdd9DuoiN0ag5Lz8")
# Configure logging
# Đường dẫn cụ thể


# Function to parse resume and return JSON data
def parse_resume(pdf_path):
    # Define generation configuration
    generation_config = {
      "temperature": 1,
      "top_p": 0.95,
      "top_k": 64,
      "max_output_tokens": 8192,
      "response_mime_type": "text/plain",
    }

    # Initialize the Generative Model
    model = genai.GenerativeModel('gemini-1.5-flash',
                              # Set the `response_mime_type` to output JSON
                              generation_config={"response_mime_type": "application/json"})

    
    # Start a chat session
    chat_session = model.start_chat(history=[])

    # Extract text from the PDF
    resume_text1 = extract_text(pdf_path)
    # print(resume_text1)
    # Send the resume text to the model and ask for JSON format
    response = chat_session.send_message(
       #resume_text1 + " THERE IS A data I read from a resume, PLEASE return this as a JSON object with fields: job_title, executive_profile, skills, summary, etc and all data in this resume "
        resume_text1 + """
                HERE IS A data I read from a resume, Please return the extracted resume data as a JSON object with the following example structure:
                {
                "Personal Information": {
                    "Name": { "$type": "string", "value": "<Name>" },
                    "Email": { "$type": "string", "value": "<Email>" },
                    "Address": { "$type": "string", "value": "<Address>" },
                    "Phone": { "$type": "string", "value": "<Phone>" },
                    "Github": { "$type": "string", "value": "<Github>" },
                    "Linkedin": { "$type": "string", "value": "<Linkedin>" },
                    "Social link": { "$type": "string", "value": "<Social link>" },
                    "Image": "<Base64 encoded image>"
                },
                "Skills": [
                    { "Title": { "$type": "string", "value": "<Category>" }, "Value": { "$type": "string", "value": "<Skills>" } }
                ],
                "Projects": [
                    {
                    "Title": { "$type": "string", "value": "<Project Title>" },
                    "Description": { "$type": "string", "value": "<Description>" },
                    "Tool": { "$type": "string", "value": "<Tools>" }
                    }
                ],
                "Experience": [...],
                "Education": [...],
                "Certifications": [...],
                "Languages": [...],
                "Interests": [...],
                "References": [...],
                "Summary": { "$type": "string", "value": "<Summary>" },
                "Accomplishments": [...],
                "CustomFields": [...],
                "Activities": [...],
                 "Job Title":,

                }
                """
    )

   # Kiểm tra phản hồi 
    if response.text.strip():
        response_text = response.text
        response_text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', response_text)  # Loại bỏ ký tự điều khiển không hợp lệ

        try:
            resume_json = json.loads(response_text)
           # print(resume_json)

            return resume_json
        except json.JSONDecodeError as e:
            print("Lỗi khi phân tích JSON:", e)
            print("Nội dung phản hồi:", response.text)
            return None
    else:
        print("Phản hồi từ API trống hoặc không hợp lệ.")
        return None



if __name__ == "__main__":
    pdf_path = 'E:\\Certificate\\CV_BackEnd_VuTuanHung.pdf'
    resume_data = parse_resume(pdf_path)
    print(resume_data)

  
    
