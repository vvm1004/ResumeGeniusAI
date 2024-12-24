import google.generativeai as genai
import json
genai.configure(api_key="AIzaSyAcW8yLla0zTb31HGqs9fljpNM70ubj5r0")
def genSumary(promot):
    print("Promot:", promot)
    # Define generation configuration
    generation_config = {
      "temperature": 1,
      "top_p": 0.95,
      "top_k": 64,
      "max_output_tokens": 8192,
      "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel('gemini-1.5-flash',
                              generation_config={"response_mime_type": "application/json"})

    
    chat_session = model.start_chat(history=[])

    
    response = chat_session.send_message(
      promot
    )
    print("ress:0/n",response)
    try:
        candidates = response.candidates  # Lấy danh sách candidates
        if candidates:
            content = candidates[0].content.parts[0].text  # Lấy phần text
            
            # In chuỗi JSON để kiểm tra
            print("JSON Content:", content)
            
            json_data = json.loads(content)  # Chuyển đổi chuỗi JSON thành đối tượng Python
            return json_data  # Trả về đối tượng JSON
    except (AttributeError, json.JSONDecodeError) as e:
        print(f"Error processing response: {e}")
        return None

def generate_resume_summary(name, job_title, achievements=None, skills=None, activities=None, 
                             hobbies=None, education=None, languages=None, employment_history=None):
    summary_lines = []
    summary_lines.append(f"Based on the following information, create 9 impactful resumes for levels: Intern, Fresher, Junior, Mid-level, Senior, Lead, Architect, Manager, CTO level:\n")

    summary_lines.append(f"Job Title: {job_title}")
    # if name:
    #     summary_lines.append(f"Name: {name}")
    if achievements:
        summary_lines.append("Achievements: " + ", ".join(achievements))
    if skills:
        summary_lines.append("Skills: " + ", ".join(skills))
    if activities:
        summary_lines.append("Activities: " + ", ".join(activities))
    if hobbies:
        summary_lines.append("Hobbies: " + ", ".join(hobbies))
    if education:
        summary_lines.append("Education: " + ", ".join(education))
    if languages:
        # Xử lý danh sách languages
        language_list = [lang["Title"] if isinstance(lang, dict) and "Title" in lang else str(lang) for lang in languages]
        summary_lines.append("Languages: " + ", ".join(language_list))
    if employment_history:
        summary_lines.append("Employment History: " + ", ".join(employment_history))
    
    summary_lines.append(f"The summary should clearly highlight the candidate's data in their field. Ensure that it captures the attention of potential employers. Just return with level name in key and the corresponding summary.")
    return genSumary("\n".join(summary_lines))



def generate_employment_history_description( job_title, position):
    summary_lines = []
    summary_lines.append(f"Generate 5  working  description for the following position and job title:\n")


    summary_lines.append(f"Job Title: {job_title}")
    summary_lines.append(f"Position: {position}")
    
    
    summary_lines.append(f"The description should  relevant to the position and jobtitle. Ensure that it captures the attention of potential employers.  just return with lnumber in key and the corresponding description")
    return genSumary("\n".join(summary_lines))
   