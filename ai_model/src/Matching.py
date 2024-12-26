import spacy
from bs4 import BeautifulSoup
from datetime import datetime
from MediaWiki import get_search_results

# Khởi tạo mô hình spaCy
print("Loading Jd Parser model...")
jd_model = spacy.load('model/JdModel/output/model-best')
print("Jd Parser model loaded")

# Hàm tính số năm từ ngày bắt đầu và kết thúc
def calculate_experience(start_date, end_date):
    start = datetime.strptime(start_date, "%m/%Y")
    end = datetime.strptime(end_date, "%m/%Y")
    experience_in_months = (end.year - start.year) * 12 + (end.month - start.month)
    return round(experience_in_months / 12, 2)  # Trả về số năm với 2 chữ số thập phân

def Matching(jd_html_description, resume_workedAs, resume_experience_list, resume_skills):
    # Phân tích HTML để trích xuất văn bản
    soup = BeautifulSoup(jd_html_description, 'html.parser')
    jd_text = soup.get_text(separator=" ", strip=True)  # Lấy văn bản và giữ khoảng cách hợp lý

    # Xử lý mô tả công việc bằng mô hình spaCy
    label_list_jd = []
    text_list_jd = []
    dic_jd = {}

    doc_jd = jd_model(jd_text)
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

    # Xử lý danh sách kinh nghiệm từ CV
    resume_experience = []
    for p in resume_experience_list:
        if " - " in p:  # Nếu định dạng là MM/YYYY - MM/YYYY
            try:
                start_date, end_date = p.split(" - ")
                year_experience = calculate_experience(start_date.strip(), end_date.strip())
                resume_experience.append(year_experience)
            except ValueError as e:
                print(f"Lỗi khi phân tích ngày: {p} - {e}")
        elif "years" in p or "year" in p:  # Nếu định dạng là '2 years', '1 year 6 months'
            parts = p.split()
            year = int(parts[0])
            if "months" in p or "month" in p:
                year += int(parts[2]) / 12
            resume_experience.append(round(year, 2))
        else:
            print(f"Lỗi không thể xử lý: {p}")

    print("Kinh nghiệm làm việc của CV (tính bằng năm): ", resume_experience)

    # Trích xuất các thông tin từ mô tả công việc
    job_description_skills = dic_jd.get('SKILLS', [])
    jd_experience_list = dic_jd.get('EXPERIENCE', [])
    jd_post = dic_jd.get('JOBPOST', [])

    # Xử lý kinh nghiệm trong JD
    jd_experience = []
    for p in jd_experience_list:
        parts = p.split()
        if "years" in p or "year" in p:
            year = int(parts[0])
            if "months" in p or "month" in p:
                year += int(parts[2]) / 12
        else:
            year = int(parts[0]) / 12
        jd_experience.append(round(year, 2))

    print("Kỹ năng trong mô tả công việc: ", job_description_skills)
    print("Kinh nghiệm trong mô tả công việc (tính bằng năm): ", jd_experience)
    print("Vị trí công việc trong mô tả: ", jd_post)

    ###########################################################
    #########  So sánh resume_workedAs và jd_post
    jd_post = [item.lower() for item in jd_post]
    jdpost_similarity = 0
    experience_similarity = 0

    if resume_workedAs:
        resume_workedAs = [item.lower() for item in resume_workedAs]
        for i, item in enumerate(resume_workedAs):
            if item in jd_post:
                match_index = i
                jdpost_similarity = 1
                ########   So sánh kinh nghiệm giữa resume_experience và jd_experience
                if resume_experience:
                    experience_difference = jd_experience[0] - resume_experience[match_index]
                    if experience_difference <= 0:
                        experience_similarity = 1
                    elif 0 < experience_difference <= 1:
                        experience_similarity = 0.7
                    else:
                        experience_similarity = 0
                break

    jdpost_similarity = jdpost_similarity * 0.3
    experience_similarity = experience_similarity * 0.2
    print("Tương đồng về vị trí công việc: ", jdpost_similarity)
    print("Tương đồng về kinh nghiệm: ", experience_similarity)

    ########   So sánh kỹ năng trong CV và JD
    count = 0
    if resume_skills and job_description_skills:
        for skill in job_description_skills:
            if skill.lower() in [s.lower() for s in resume_skills]:
                count += 1

        skills_similarity = 1 - ((len(job_description_skills) - count) / len(job_description_skills))
        skills_similarity = skills_similarity * 0.5
    else:
        skills_similarity = 0

    print("Tương đồng về kỹ năng: ", skills_similarity)

    # Tính toán tổng điểm tương đồng
    matching = (jdpost_similarity + experience_similarity + skills_similarity) * 100
    matching = round(matching, 2)
    print("Tổng độ tương đồng giữa CV và mô tả công việc: ", matching)

    return matching
