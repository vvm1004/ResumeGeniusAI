import json
import joblib
from flask import Flask, request, jsonify
from model_training.check_meaning.checkModelHandler import checkData
from model_training.edit_field.editModelHandler import predict_field_name
from model_training.check_spell.upgradeSentence import upgrade_sentence
from model_training.check_spell.spellcheck import check_and_correct_spelling_with_positions
from extract_data.resume_upgrade_module import handleData
def normalize_phrase(phrase):
    # Thay thế dấu gạch dưới và dấu gạch nối bằng khoảng trắng
    phrase = phrase.replace('_', ' ').replace('-', ' ')
    # Chia cụm từ thành danh sách các từ
    words = phrase.split()
    normalized_words = [word.capitalize() for word in words]
    # Nối lại thành chuỗi
    return ' '.join(normalized_words)

app = Flask(__name__)
@app.route('/process_resume', methods=['POST'])
def process_resume():
    data = request.json
    pdf_path = data.get('pdf_path')

    if not pdf_path:
        return jsonify({'error': 'PDF path is required'}), 400

    job_title, esdata = handleData(pdf_path)

    removed_items = {}
    results = {}
    for field, value in esdata.items():
        print("\n\n----------------", field,"\n-----------",value)   
        improved_value=value
        improved_field=field

        if isinstance(improved_value, list):
            result_dict = {}
            isChange=False
            for data in improved_value:
                if isinstance(data, str):  
                    isChange=True
                    field_name = predict_field_name(data)  
                    if field_name in result_dict:
                        result_dict[field_name].append(data)
                    else: 
                        result_dict[field_name] = [data]
            if len(result_dict) != 1 and isChange: 
                if not any(key in improved_field for key in result_dict.keys()):
                    improved_value = result_dict
 
                    
                
        if not checkData(improved_field, improved_value):
            predicted_name = predict_field_name(improved_value)
            print("\n\npredicted_name: ----------------", predicted_name)


            results[predicted_name] = improved_value
        else:
            results[field] = improved_value

   
    results2 = {
        "title": job_title,
        "Personal Information": {
            "Name": {"$type": "string", "value": results.get("Name", "")},
            "Email": {"$type": "string", "value": results.get("Email", "")},
            "Address": {
                "$type": "string",
                "value": next((results.get(key) for key in ["Address", "Location"] if results.get(key)), "")  # Kiểm tra nhiều key
            },
            "Phone": {"$type": "string", "value": results.get("Phone", "")},
            "Github": {"$type": "string", "value": results.get("Github", "")},
            "Linkedin": {"$type": "string", "value": results.get("Linkedin", "")},
            "Social link": {"$type": "string", "value": results.get("Social link","")}
        },
        "Job Title": job_title,
        "Summary": {"$type": "string", "value": next((results.get(key) for key in ["Summary", "Objective","Career_goals","Professional Summary","Professional_overview"] if results.get(key)), "")} ,
        "Experience": [],
        "Education": [],
        "Projects": [],
        "Activities": [],
        "Accomplishments":[],
        "Skills":[],
        "Languages":[],
        "Interests":[],
        "References":[],
        "Certifications": [],
        "CustomFields": []
    }
    
    personal_info_keys = ["Personal Information", "Personal Info", "Contact Information","Personal_info","Personal information"]
    for key in personal_info_keys:
        if key in results:
            if not results2["Personal Information"]["Name"]["value"]:
                results2["Personal Information"]["Name"]["value"] = results[key].get("Name", "")
            if not results2["Personal Information"]["Email"]["value"]:
                results2["Personal Information"]["Email"]["value"] = results[key].get("Email", "")
            if not results2["Personal Information"]["Address"]["value"]:
                results2["Personal Information"]["Address"]["value"] = next(
                    (results[key].get(k) for k in ["Address", "Location"] if results[key].get(k)), ""
                )
            if not results2["Personal Information"]["Phone"]["value"]:
                results2["Personal Information"]["Phone"]["value"] = results[key].get("Phone", "")
            if not results2["Personal Information"]["Github"]["value"]:
                results2["Personal Information"]["Github"]["value"] = results[key].get("Github", "")
            if not results2["Personal Information"]["Linkedin"]["value"]:
                results2["Personal Information"]["Linkedin"]["value"] = results[key].get("Linkedin", "")
            if not results2["Personal Information"]["Social link"]["value"]:
                results2["Personal Information"]["Social link"]["value"] = next(
                    (results[key].get(k) for k in ["Social link", "Portfolio"] if results[key].get(k)), ""
                )
            break


    accKey = ["Activity", "Activities","Activities_and_honors","Extracurricular","Healthcare Operations",""]
    for keyword in accKey:
        if keyword in results:
            print("\n\n\n\t--------ActivitiesActivities-------------\n",results[keyword],"\n\n\n\t----------------\n")
            if isinstance(results[keyword], list): 
                for activity in results[keyword]:
                    activity_item = {
                        "Title": {"$type": "string", "value": ""},
                        "Organization": {"$type": "string", "value": ""},
                        "Date": {"$type": "string", "value": ""},
                        "Description": {"$type": "string", "value": ""},
                        "Role": {"$type": "string", "value": ""},
                        "Achievements": {
                            "$type": "array",
                            "items": []
                        }
                    }

                    
                    if isinstance(activity, str):
                        activity_item["Title"]["value"] = activity  

                    elif isinstance(activity, dict):
                        activity_item["Title"]["value"] = next((activity.get(key) for key in ["Title", "Name"] if activity.get(key)), "")
                        activity_item["Organization"]["value"] = next((activity.get(key) for key in ["Organization", "Company"] if activity.get(key)), "")
                        activity_item["Date"]["value"] = next((activity.get(key) for key in ["Date", "Duration"] if activity.get(key)), "")
                        activity_item["Description"]["value"] = next((activity.get(key) for key in ["Description"] if activity.get(key)), "")
                        activity_item["Role"]["value"] = next((activity.get(key) for key in ["Role"] if activity.get(key)), "")

                    elif isinstance(activity, list):
                        for act in activity:
                            if isinstance(act, dict):
                                activity_item["Title"]["value"] = next((act.get(key) for key in ["Title", "Name"] if act.get(key)), "")
                                activity_item["Organization"]["value"] = next((act.get(key) for key in ["Organization", "Company"] if act.get(key)), "")
                                activity_item["Date"]["value"] = next((act.get(key) for key in ["Date", "Duration"] if act.get(key)), "")
                                activity_item["Description"]["value"] = next((act.get(key) for key in ["Description"] if act.get(key)), "")
                                activity_item["Role"]["value"] = next((act.get(key) for key in ["Role"] if act.get(key)), "")

                    results2["Activities"].append(activity_item)
            break

    skillsKey = ["Skills", "Skill","Computer_skills","Design Skills","Hard Skills","Interpersonal Skills","Professional Skills","Skills Summary","Technical Skills","Soft skills","Soft skill"]
    for keyword in skillsKey:
        if keyword in results:
            skills = results[keyword]
            results2["Skills"] = results2.get("Skills", [])

            if isinstance(skills, dict):
                for category, skill_list in skills.items():
                    skill_item = {
                        "Title": {"$type": "string", "value": category},
                        "Value": {"$type": "string", "value": ", ".join(skill_list) if isinstance(skill_list, list) else ""}
                    }
                    
                    results2["Skills"].append(skill_item)

            elif isinstance(skills, list):

                if all(isinstance(skill, str) for skill in skills):
                    skill_item = {
                        "Title": {"$type": "string", "value": "Skills"},
                        "Value": {"$type": "string", "value": ", ".join(skills)}
                    }
                    results2["Skills"].append(skill_item)
                elif all(isinstance(skill, dict) for skill in skills):
                    for skill in skills:
                        for key, value in skill.items():
                            skill_item = {
                                "Title": {"$type": "string", "value": key},
                                "Value": {"$type": "string", "value": value}
                            }
                            results2["Skills"].append(skill_item)
            break

    
    referenceKey = ["References", "Reference"]
    for keyword in referenceKey:
        if keyword in results:
            references = results[keyword]
            
            results2["References"] = results2.get("References", [])

            if isinstance(references, list):
                for reference in references:
                    reference_item = {
                        "Name": {"$type": "string", "value": ""},
                        "Position": {"$type": "string", "value": ""},
                        "Organization": {"$type": "string", "value": ""},
                        "Contact": {"$type": "string", "value": ""}
                    }

                    if isinstance(reference, str):
                        reference_item["Name"]["value"] = reference  

                    elif isinstance(reference, dict):
                        reference_item["Name"]["value"] = reference.get("Name", "")
                        reference_item["Position"]["value"] = reference.get("Position", "")
                        reference_item["Organization"]["value"] = reference.get("Organization", "")
                        reference_item["Contact"]["value"] = reference.get("Contact", "")

                    results2["References"].append(reference_item)

            elif isinstance(references, dict):
                reference_item = {
                    "Name": {"$type": "string", "value": references.get("Name", "")},
                    "Position": {"$type": "string", "value": references.get("Position", "")},
                    "Organization": {"$type": "string", "value": references.get("Organization", "")},
                    "Contact": {"$type": "string", "value": references.get("Contact", "")}
                }
                results2["References"].append(reference_item)
            break

    interestsKey = ["Interests", "Interest","Highlights","Hobbies","Personal_interests",""]
    for keyword in interestsKey:
        if keyword in results:
            if isinstance(results[keyword], list):
                for interest in results[keyword]:
                    interest_item = {
                        "Title": {"$type": "string", "value": ""},
                        "Description": {"$type": "string", "value": ""}
                    }

                    if isinstance(interest, str):
                        interest_item["Title"]["value"] = interest

                    elif isinstance(interest, dict):
                        interest_item["Title"]["value"] = interest.get("Title", "")
                        interest_item["Description"]["value"] = interest.get("Description", "")

                    results2["Interests"].append(interest_item)

            elif isinstance(results[keyword], dict):
                for category, interest_list in results[keyword].items():
                    interest_item = {
                        "Title": {"$type": "string", "value": category},
                        "Description": {"$type": "string", "value": ", ".join(interest_list) if isinstance(interest_list, list) else ""}
                    }
                    results2["Interests"].append(interest_item)
            break
    languagesKey = ["Languages", "Language"]
    for keyword in languagesKey:
        if keyword in results:
            if isinstance(results[keyword], list):
                for language in results[keyword]:
                    language_item = {
                        "Title": {"$type": "string", "value": ""},
                        "Level": {"$type": "string", "value": ""}
                    }

                    if isinstance(language, str):
                        language_item["Title"]["value"] = language

                    elif isinstance(language, dict):
                        language_item["Title"]["value"] = language.get("Name", "")
                        language_item["Level"]["value"] = language.get("Level", "")

                    results2["Languages"].append(language_item)

            elif isinstance(results[keyword], dict):
                for lang, details in results[keyword].items():
                    language_item = {
                        "Title": {"$type": "string", "value": lang},
                        "Level": {"$type": "string", "value": details.get("Level", "")}
                    }
                    results2["Languages"].append(language_item)
            break



    accKey = ["Experience", "Experiences", "Work history","Working history","Working History","Design Experience","Experience_summary","HR Experience","Internships","Military_experience","Professional Experience","Jobs","Work_experience","Work_history"]
    for keyword in accKey:
        if keyword in results:
            if isinstance(results[keyword], list):  
                for exp in results[keyword]:
                    experience_item = {
                        "Title": {"$type": "string", "value": ""},
                        "Company": {"$type": "string", "value": ""},
                        "Position": {"$type": "string", "value": ""},
                        "Date": {"$type": "string", "value": ""},
                        "Description": {"$type": "string", "value": ""},
                        "Responsibilities": {
                            "$type": "array",
                            "items": []
                        }
                    }

                    # Check if the experience entry is a string
                    if isinstance(exp, str):
                        experience_item["Title"]["value"] = exp  # Assuming the string is the title

                    # Check if the experience entry is a dictionary
                    elif isinstance(exp, dict):
                        title=exp.get("Title", "")
                        if(title==results2["title"]): continue
                        experience_item["Title"]["value"] = exp.get("Title", "")
                        experience_item["Company"]["value"] = next((exp.get(key) for key in ["Company","Organization","Institution"] if exp.get(key)), "")
                        experience_item["Position"]["value"] = next((exp.get(key) for key in ["Position"] if exp.get(key)), "")
                        experience_item["Date"]["value"] = next((exp.get(key) for key in ["Date","Years","Year"] if exp.get(key)), "")
                        experience_item["Description"]["value"] = exp.get("Description", "")
                        responsibilities = next((exp.get(key) for key in ["Responsibilities", "Responsibility"] if exp.get(key)), "")
                        if isinstance(responsibilities, list):
                            experience_item["Responsibilities"]["items"] = [{"$type": "string", "value": resp} for resp in responsibilities]
                        else:
                            experience_item["Responsibilities"]["items"] = [{"$type": "string", "value": responsibilities}]

                    # Check if the experience entry is a list
                    elif isinstance(exp, list):
                        if all(isinstance(item, str) for item in exp):  # Check if all items are strings
                            experience_item["Title"]["value"]= ", ".join(exp)  # Join strings for the title
                        else:
                            for ex in exp:
                                if isinstance(ex, dict):
                                    experience_item["Title"]["value"] += ex.get("Title", "") + "; "
                                    experience_item["Company"]["value"] += ex.get("Company", "") + "; "
                                    experience_item["Position"]["value"] += next((ex.get(key) for key in ["Position"] if ex.get(key)), "") + "; "
                                    experience_item["Date"]["value"] +=  next((ex.get(key) for key in ["Date","Years","Year"] if ex.get(key)), "") + "; "
                                    experience_item["Description"]["value"] += ex.get("Description", "") + "; "
                                    
                                    # Handle Responsibilities
                                    resp = next((ex.get(key) for key in ["Responsibilities", "Responsibility"] if ex.get(key)), "")
                                    if isinstance(resp, list):
                                        experience_item["Responsibilities"]["items"].extend([{"$type": "string", "value": r} for r in resp])
                                    else:
                                        experience_item["Responsibilities"]["items"].append({"$type": "string", "value": resp})

                    # Clean up the values to remove the trailing "; "
                    
                    results2["Experience"].append(experience_item)
            break

    awardKey = ["Award", "Awards","Achievements","Accomplishments", "Core_accomplishments"]
    for keyword in awardKey:
        if keyword in results:
            print ("\n\n\n\n\n\t\t---------------------------------------\n\n\n\n")
            if isinstance(results[keyword], list):
                for award in results[keyword]:
                    award_item = {
                        "Title": {"$type": "string", "value": ""},
                        "Issuer": {"$type": "string", "value": ""},
                        "Date": {"$type": "string", "value": ""},
                        "Description": {"$type": "string", "value": ""},
                    }

                    if isinstance(award, str):
                        award_item["Title"]["value"] = award  

                    elif isinstance(award, dict):
                        award_item["Title"]["value"] = next((award.get(key) for key in ["Title", "Name"] if award.get(key)), "")
                        award_item["Issuer"]["value"] = next((award.get(key) for key in ["Issuer", "Organization"] if award.get(key)), "")
                        award_item["Date"]["value"] = next((award.get(key) for key in ["Date"] if award.get(key)), "")
                        award_item["Description"]["value"] = next((award.get(key) for key in ["Description"] if award.get(key)), "")

                    elif isinstance(award, list):
                        if all(isinstance(item, str) for item in award):  
                            award_item["Title"]["value"] = ", ".join(award) 
                        else:
                            for awd in award:
                                if isinstance(awd, dict):
                                    award_item["Title"]["value"] += next((awd.get(key) for key in ["Title", "Name"] if awd.get(key)), "") + "; "
                                    award_item["Issuer"]["value"] += next((awd.get(key) for key in ["Issuer", "Organization"] if awd.get(key)), "") + "; "
                                    award_item["Date"]["value"] += next((awd.get(key) for key in ["Date"] if awd.get(key)), "") + "; "
                                    award_item["Description"]["value"] += next((awd.get(key) for key in ["Description"] if awd.get(key)), "") + "; "

                    
                    results2["Accomplishments"].append(award_item)
            elif isinstance(results[keyword], dict):
                results2["Accomplishments"].append(results[keyword]) 

                
            break


    eduKey = ["Education", "Educations"]
    for keyword in eduKey:
        if keyword in results:
            if isinstance(results[keyword], list):
                for edu in results[keyword]:
                    education_item = {
                        "Degree": {"$type": "string", "value": ""},
                        "Major": {"$type": "string", "value": ""},
                        "Institution": {"$type": "string", "value": ""},
                        "GPA": {"$type": "string", "value": ""},
                        "Date": {"$type": "string", "value": ""},
                    }

                    if isinstance(edu, str):
                        education_item["Degree"]["value"] = edu  

                    elif isinstance(edu, dict):
                        education_item["Degree"]["value"] = edu.get("Degree", ""),
                        education_item["Major"]["value"] = edu.get("Major", "")
                        education_item["Institution"]["value"] = next((edu.get(key) for key in ["Institution", "University", "School"] if edu.get(key)), "")
                        education_item["GPA"]["value"] = next((edu.get(key) for key in ["Gpa", "GPA", "Score", "Grade", "Averagescore"] if edu.get(key)), "")
                        education_item["Date"]["value"] = next((edu.get(key) for key in ["Date","Graduation_year"] if edu.get(key)), "")

                    elif isinstance(edu, list):
                        if all(isinstance(item, str) for item in edu): 
                            education_item["Degree"]["value"]= ", ".join(edu)  
                        else:
                            for ed in edu:
                                if isinstance(ed, dict):
                                    education_item["Degree"]["value"] += ed.get("Degree", "") + "; "
                                    education_item["Major"]["value"] += ed.get("Major", "") + "; "
                                    education_item["Institution"]["value"] += next((ed.get(key) for key in ["Institution", "University", "School"] if ed.get(key)), "") + "; "
                                    education_item["GPA"]["value"] += next((ed.get(key) for key in ["Gpa", "GPA", "Score", "Grade", "Averagescore"] if ed.get(key)), "") + "; "
                                    education_item["Date"]["value"] += next((ed.get(key) for key in ["Date","Graduation_year"] if ed.get(key)), "") + "; "

                    
                    results2["Education"].append(education_item)
            break


    projKey = ["Projects", "Project","Clinical Research","Consulting Projects","Content Projects","Content Strategy","Development Projects","Event Projects","Finance Projects","Healthcare Projects","Logistics Projects","Market Research","Marketing Campaigns"]
    for keyword in projKey:
        if keyword in results:
            if isinstance(results[keyword], list):
                for project in results[keyword]:
                    # Initialize project_item
                    project_item = {
                        "Title": {"$type": "string", "value": ""},
                        "Description": {"$type": "string", "value": ""},
                        "Features": {"$type": "string", "value": ""},
                        "Technologies": {"$type": "string", "value": ""},
                        "Github link": {"$type": "string", "value": ""},
                        "Demo": {"$type": "string", "value": ""},
                        "Date": {"$type": "string", "value": ""},
                        "Tool": {"$type": "string", "value": ""},
                    }

                    if isinstance(project, str):
                        project_item["Title"]["value"] = project

                    elif isinstance(project, dict):
                        project_item["Title"]["value"] = next((project.get(key) for key in ["Name", "Title"] if project.get(key)), "")
                        project_item["Description"]["value"] = next((project.get(key) for key in ["Description"] if project.get(key)), "")
                        project_item["Features"]["value"] = next((project.get(key) for key in ["Features"] if project.get(key)), "")
                        project_item["Technologies"]["value"] = next((project.get(key) for key in ["Technologies", "Technology"] if project.get(key)), "")
                        project_item["Github link"]["value"] = next((project.get(key) for key in ["Github_link", "SourceCode", "Sourcecode", "Source_code","GitHub"] if project.get(key)), "")
                        project_item["Demo"]["value"] = next((project.get(key) for key in ["Links", "Link", "Url", "Youtubereview", "Youtube_review"] if project.get(key)), "")
                        project_item["Date"]["value"] = next((project.get(key) for key in ["Date", "Duration"] if project.get(key)), "")
                        project_item["Tool"]["value"] = project.get("Tools", "")

                    elif isinstance(project, list):
                        if all(isinstance(item, str) for item in project): 
                           project_item["Title"]["value"]= ", ".join(project)  
                        else:
                            for proj in project:
                                if isinstance(proj, dict):
                                    project_item["Title"]["value"] += next((proj.get(key) for key in ["Name", "Title"] if proj.get(key)), "") + "; "
                                    project_item["Description"]["value"] += next((proj.get(key) for key in ["Description"] if proj.get(key)), "") + "; "
                                    project_item["Features"]["value"] += next((proj.get(key) for key in ["Features"] if proj.get(key)), "") + "; "
                                    project_item["Technologies"]["value"] += next((proj.get(key) for key in ["Technologies", "Technology"] if proj.get(key)), "") + "; "
                                    project_item["Github link"]["value"] += next((proj.get(key) for key in ["Github_link", "SourceCode", "Sourcecode", "Source_code"] if proj.get(key)), "") + "; "
                                    project_item["Demo"]["value"] += next((proj.get(key) for key in ["Links", "Link", "Url", "Youtubereview", "Youtube_review"] if proj.get(key)), "") + "; "
                                    project_item["Date"]["value"] += next((proj.get(key) for key in ["Date", "Duration"] if proj.get(key)), "") + "; "
                                    project_item["Tool"]["value"] += proj.get("Tools", "") + "; "

                   

                    results2["Projects"].append(project_item)
            break


    cerKey = ["Certifications", "Certificate","Awards_certifications","Courses"]  
    for keyword in cerKey:
        if keyword in results:
            certs = results[keyword]
            if isinstance(certs, str):
                certification_item = {
                    "Name": {"$type": "string", "value": certs},
                    "Details": {"$type": "string", "value": ""},
                    "Year": {"$type": "string", "value": ""},
                    "Link": {"$type": "string", "value": ""}
                }
                results2["Certifications"].append(certification_item)
            elif isinstance(certs, list):
                for cert in certs:
                    if isinstance(cert, str):
                        # Nếu cert là một chuỗi, gán trực tiếp
                        certification_item = {
                            "Name": {"$type": "string", "value": cert},
                            "Details": {"$type": "string", "value": ""}, 
                            "Year": {"$type": "string", "value": ""},
                            "Link": {"$type": "string", "value": ""}
                        }
                        results2["Certifications"].append(certification_item)
                    elif isinstance(cert, dict):
                        # Nếu cert là một từ điển, lấy các giá trị từ nó
                        certification_item = {
                            "Name": {"$type": "string", "value": next((cert.get(key) for key in ["Name", "Title"] if cert.get(key)), "")},
                            "Details": {"$type": "string", "value": next((cert.get(key) for key in ["Details", "Description","Point", "Grade","Score"] if cert.get(key)), "")},
                            "Year": {"$type": "string", "value": next((cert.get(key) for key in ["Date", "End Date", "EndDate","Year"] if cert.get(key)), "")},
                            "Link": {"$type": "string","value": next((cert.get(key) for key in ["Link", "Url","Demo"] if cert.get(key)), "")}
                        }
                        results2["Certifications"].append(certification_item)
            
            break
    


        # Initialize CustomFields
    results2["CustomFields"] = []

    predefined_keys = [
        "Name", "Email", "Address", "Phone", "Github", "Linkedin", "Social link", 
        "Summary", "Experience", "Education", "Projects", "Activities", "Personal Information", "Personal Info", "Contact Information","Personal_info","Activity", "Activities","Activities_and_honors","Extracurricular","Healthcare Operations",
        "Skills", "Skill","Computer_skills","Design Skills","Hard Skills","Interpersonal Skills","Professional Skills","Skills Summary","Technical Skills","Soft skills","Soft skill",
        "References", "Reference","Interests", "Interest","Highlights","Hobbies","Personal_interests","Languages", "Language",
        "Experience", "Experiences", "Work history","Working history","Working History","Design Experience","Experience_summary","HR Experience","Internships","Military_experience","Professional Experience","Jobs","Work_experience","Work_history",
        "Award", "Awards","Achievements","Accomplishments", "Core_accomplishments",
        "Education", "Educations","Projects", "Project","Clinical Research","Consulting Projects","Content Projects","Content Strategy","Development Projects","Event Projects","Finance Projects","Healthcare Projects","Logistics Projects","Market Research","Marketing Campaigns",
        "Certifications", "Certificate","Awards_certifications","Courses",
        "Awards", "Skills", "References", "Certifications","Job_title","Location","Objective","Interests","Contact Information","Job_position"
    ]

    for key, value in results.items():
        if key not in predefined_keys:
            custom_field_item = {
                "Title": {"$type": "string", "value": key},
                "Value": {"$type": "string", "value": ""},
                "Date": {"$type": "string", "value": ""},           
            }

            if isinstance(value, str):
                custom_field_item["Value"]["value"] = value

            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        custom_field_item["Value"]["value"] = item.get("Value", "")
                        custom_field_item["Date"]["value"] = item.get("Date", "")
                       
                    else:
                        custom_field_item["Value"]["value"] += str(item) + ", "

            elif isinstance(value, dict):
                custom_field_item["Value"]["value"] = value.get("Value", "")
                custom_field_item["Date"]["value"] = value.get("Date", "")
               
            
            custom_field_item["Value"]["value"] = custom_field_item["Value"]["value"].rstrip(", ")

            results2["CustomFields"].append(custom_field_item)

    return jsonify({
        'data': results2
        
    })
       

        # Thêm các trường tùy chỉnh
    

@app.route('/upgrade_sentence', methods=['POST'])
def upgrade_sentences():
    data = request.json
    sentence = data.get('sentence')
    new_sentence=upgrade_sentence(sentence)
    return jsonify({
        'new_sentence':new_sentence
    })

@app.route('/check_spell', methods=['POST'])
def check_spell():
    data = request.json
    sentence = data.get('sentence')
    corrected_sentence, corrections=check_and_correct_spelling_with_positions(sentence)
    return jsonify({
        'corrected_sentence': corrected_sentence,
        'corrections': corrections
        
    })

@app.route('/generate_summary', methods=['POST'])
def generate_summary():
    data = request.json
    key_words = data.get('sentence')



if __name__ == '__main__':
    app.run(debug=True)
