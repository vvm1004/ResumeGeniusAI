import spacy
from MediaWiki import get_search_results
from bs4 import BeautifulSoup
from datetime import datetime

# Khởi tạo mô hình spaCy
print("Loading Jd Parser model...")
jd_model = spacy.load('model/JdModel/output/model-best')
print("Jd Parser model loaded")

def calculate_experience(start_date, end_date):
    """ Tính số năm giữa hai mốc thời gian (MM/YYYY) """
    date_format = "%m/%Y"  # Định dạng ngày là tháng/năm (ví dụ: 06/2020)
    
    start = datetime.strptime(start_date, date_format)
    end = datetime.strptime(end_date, date_format)
    
    # Tính toán sự khác biệt giữa hai ngày
    delta = end - start
    # Chuyển đổi độ dài thời gian thành năm
    years = delta.days / 365.25  # Chia cho 365.25 để tính trung bình của các năm nhuận
    return round(years, 2)

def process_resume_experience(resume_experience_list):
    """ Xử lý danh sách kinh nghiệm trong CV để tính số năm """
    resume_experience = []
    
    for period in resume_experience_list:
        # Tách chuỗi thành các phần bắt đầu và kết thúc
        start_date, end_date = period.split(" - ")
        
        # Tính số năm giữa các mốc thời gian
        experience_years = calculate_experience(start_date, end_date)
        resume_experience.append(experience_years)
    
    return resume_experience

def Matching(jd_html_description, resume_workedAs, resume_experience_list, resume_skills):
    # Phân tích HTML để trích xuất văn bản
    soup = BeautifulSoup(jd_html_description, 'html.parser')
    jd_text = soup.get_text(separator=" ", strip=True)  # Lấy văn bản và giữ khoảng cách hợp lý

    # Bây giờ, sử dụng văn bản đã trích xuất (jd_text) để xử lý tiếp
    text_of_jd = jd_text

    label_list_jd = []
    text_list_jd = []
    dic_jd = {}

    # Xử lý mô tả công việc bằng mô hình spaCy đã tải trước
    doc_jd = jd_model(text_of_jd)
    for ent in doc_jd.ents:
        label_list_jd.append(ent.label_)
        text_list_jd.append(ent.text)

    print("Xử lý mô hình xong")

    for i in range(len(label_list_jd)):
        if label_list_jd[i] in dic_jd:
            dic_jd[label_list_jd[i]].append(text_list_jd[i])
        else:
            dic_jd[label_list_jd[i]] = [text_list_jd[i]]

    print("Từ điển mô tả công việc:", dic_jd)

    # Sử dụng tham số đã truyền vào thay vì lấy từ cơ sở dữ liệu
    print("Kinh nghiệm làm việc của CV: ", resume_workedAs)

    # Chuyển đổi resume_experience_list thành số năm
    resume_experience = process_resume_experience(resume_experience_list)

    print("Kinh nghiệm làm việc của CV (tính bằng năm): ", resume_experience)

    print("Kỹ năng trong CV: ", resume_skills)

    job_description_skills = dic_jd.get('SKILLS')
    print("Kỹ năng trong mô tả công việc: ", job_description_skills)

    jd_experience_list = dic_jd.get('EXPERIENCE')
    print("Kinh nghiệm trong mô tả công việc: ", jd_experience_list)
    
    jd_experience = []
    for p in jd_experience_list:
        parts = p.split()
        if "years" in p or "year" in p:
            year = int(parts[0])
            if "months" in p or "month" in p:
                year += int(parts[2]) / 12
        else:
            year = int(parts[0]) / 12
        year = round(year, 2)
        jd_experience.append(year)

    print("Kinh nghiệm trong mô tả công việc (tính bằng năm): ", jd_experience)
    jd_post = dic_jd.get('JOBPOST')
    print("Vị trí công việc trong mô tả: ", jd_post)

    ###########################################################
    #########  So sánh resume_workedAs và jd_post
    jd_post = [item.lower() for item in jd_post]
    experience_similarity = 0
    match_index = -1
    jdpost_similarity = 0
    if resume_workedAs:
        resume_workedAs = [item.lower() for item in resume_workedAs]
    
        for i, item in enumerate(resume_workedAs):
            if item in jd_post:
                result = True
                match_index = i
                ########   So sánh kinh nghiệm giữa resume_experience và jd_experience
                if resume_experience:
                    experience_difference = (jd_experience[0] - resume_experience[match_index])
                    if (experience_difference <= 0):
                        print("Kinh nghiệm khớp")
                        experience_similarity = 1
                    elif (0 < experience_difference <= 1):
                        print("Kinh nghiệm có thể được xem xét")
                        experience_similarity = 0.7
                    else:
                        print("Kinh nghiệm không khớp")
                        experience_similarity = 0
                
                    break
            else:
                result = False
                
        if result == True:
            jdpost_similarity = 1
        else:
            jdpost_similarity = 0

    jdpost_similarity = jdpost_similarity * 0.3
    print("Tương đồng về vị trí công việc: ", jdpost_similarity)
    experience_similarity = experience_similarity * 0.2
    print("Tương đồng về kinh nghiệm: ", experience_similarity)

    ########   So sánh kỹ năng trong resume và mô tả công việc
    new_resume_skills = []
    count = 0
    if resume_skills:
        for skills in resume_skills:   
            search_query = f"{skills} in technology "
            results = get_search_results(search_query)
            if results:
                new_resume_skills.append(results) 
            else:
                print("Không tìm thấy bài viết phù hợp")

    if job_description_skills:
        for skill in job_description_skills:
            for resume_skill in new_resume_skills:
                if skill in resume_skill:
                    count += 1
                    break

        skills_similarity = 1 - ((len(job_description_skills) - count) / len(job_description_skills))
        skills_similarity = skills_similarity * 0.5
        print("Kỹ năng khớp: ", skills_similarity)
    else:
        skills_similarity = 0
        print("Kỹ năng khớp: ", skills_similarity)

    matching = (jdpost_similarity + experience_similarity + skills_similarity) * 100
    matching = round(matching, 2)
    print("Tổng độ tương đồng giữa CV và mô tả công việc: ", matching)

    return matching