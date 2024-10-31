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

    if response.text.strip():
        # Parse the JSON response string into a dictionary
        try:
            response_data = json.loads(response.text)
            # Return the summary value
            return response_data.get("summary", "Summary not found.")
        except json.JSONDecodeError:
            print("Error decoding JSON response.")
            return None
    else:
        print("Phản hồi từ API trống hoặc không hợp lệ.")
        return None

def generate_resume_summary(name, job_title, achievements=None, skills=None, activities=None, 
                             hobbies=None, education=None, languages=None, employment_history=None):
    summary_lines = []
    summary_lines.append(f"Based on the following information, create a concise and impactful resume summary:\n")


    summary_lines.append(f"Job Title: {job_title}")
    if name:
        summary_lines.append(f"Name: {name}")
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
        summary_lines.append("Languages: " + ", ".join(languages))
    if employment_history:
        summary_lines.append("Employment History: " + ", ".join(employment_history))
    
    summary_lines.append(f"The summary should clearly highlight the candidate's data in their field. Ensure that it captures the attention of potential employers. ")
    return genSumary("\n".join(summary_lines))
   