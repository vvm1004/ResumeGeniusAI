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
               HERE IS A data I read from a resume. Please analyze the data and return it as a JSON object with the following structure:
    {
        "Personal Information": {
            "Name": { "$type": "string", "value": "<Full Name>" },
            "Email": { "$type": "string", "value": "<Email Address>" },
            "Address": { "$type": "string", "value": "<Home Address or Location>" },
            "Phone": { "$type": "string", "value": "<Phone Number>" },
            "Github": { "$type": "string", "value": "<GitHub Link>" },
            "Linkedin": { "$type": "string", "value": "<LinkedIn Profile>" },
            "Social link": { "$type": "string", "value": "<Social Media or Portfolio Link>" },
            "Image": { "$type": "string", "value": "<Base64 encoded image if available>" }
        },
        "Skills": [
            {
                "Title": { "$type": "string", "value": "<Category or Type of Skills>" },
                "Value": { "$type": "string", "value": "<List of skills separated by commas>" }
            }
        ],
        "Projects": [
            {
                "Title": { "$type": "string", "value": "<Project Name>" },
                "Description": { "$type": "string", "value": "<Detailed Description>" },
                "Features": { "$type": "string", "value": "<Key Features or Highlights>" },
                "Technologies": { "$type": "string", "value": "<Tools or Technologies Used>" },
                "Github link": { "$type": "string", "value": "<GitHub or Source Code Link>" },
                "Demo": { "$type": "string", "value": "<Demo or Live Link>" },
                "Date": { "$type": "string", "value": "<Timeline or Completion Date>" },
                "Tool": { "$type": "string", "value": "<Additional Tools Used>" }
            }
        ],
        "Experience": [
            {
                "Title": { "$type": "string", "value": "<Job Title>" },
                "Company": { "$type": "string", "value": "<Company Name>" },
                "Position": { "$type": "string", "value": "<Position Held>" },
                "Date": { "$type": "string", "value": "<Start and End Dates>" },
                "Description": { "$type": "string", "value": "<Job Description or Overview>" },
                "Responsibilities": {
                    "$type": "array",
                    "items": [
                        { "$type": "string", "value": "<Responsibility>" }
                    ]
                }
            }
        ],
        "Education": [
            {
                "Degree": { "$type": "string", "value": "<Degree or Certification>" },
                "Major": { "$type": "string", "value": "<Field of Study>" },
                "Institution": { "$type": "string", "value": "<University or School>" },
                "GPA": { "$type": "string", "value": "<Grade or GPA>" },
                "Date": { "$type": "string", "value": "<Graduation Date>" }
            }
        ],
        "Certifications": [
            {
                "Name": { "$type": "string", "value": "<Certification Name>" },
                "Details": { "$type": "string", "value": "<Details or Description>" },
                "Year": { "$type": "string", "value": "<Year Obtained>" },
                "Link": { "$type": "string", "value": "<Related Link>" }
            }
        ],
        "Languages": [
            {
                "Title": { "$type": "string", "value": "<Language>" },
                "Level": { "$type": "string", "value": "<Proficiency Level>" }
            }
        ],
        "Interests": [
            {
                "Title": { "$type": "string", "value": "<Interest or Hobby>" },
                "Description": { "$type": "string", "value": "<Description or Details>" }
            }
        ],
        "References": [
            {
                "Name": { "$type": "string", "value": "<Reference Name>" },
                "Position": { "$type": "string", "value": "<Reference Position>" },
                "Organization": { "$type": "string", "value": "<Reference Organization>" },
                "Contact": { "$type": "string", "value": "<Reference Contact Information>" }
            }
        ],
        "Summary": { "$type": "string", "value": "<Professional Summary or Career Objective>" },
        "Accomplishments": [
            {
                "Title": { "$type": "string", "value": "<Accomplishment Title>" },
                "Issuer": { "$type": "string", "value": "<Issuer or Organization>" },
                "Date": { "$type": "string", "value": "<Date Achieved>" },
                "Description": { "$type": "string", "value": "<Description of Accomplishment>" }
            }
        ],
        "Activities": [
            {
                "Title": { "$type": "string", "value": "<Activity Name>" },
                "Organization": { "$type": "string", "value": "<Organization>" },
                "Date": { "$type": "string", "value": "<Date of Activity>" },
                "Description": { "$type": "string", "value": "<Description or Details>" },
                "Role": { "$type": "string", "value": "<Role>" },
                "Achievements": {
                    "$type": "array",
                    "items": [
                        { "$type": "string", "value": "<Achievement>" }
                    ]
                }
            }
        ],
        "CustomFields": [
            {
                "Title": { "$type": "string", "value": "<Field Name>" },
                "Value": { "$type": "string", "value": "<Field Value>" },
                "Date": { "$type": "string", "value": "<Relevant Date>" }
            }
        ],
        "Job Title": { "$type": "string", "value": "<Extracted Job Title>" }
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

  
    
