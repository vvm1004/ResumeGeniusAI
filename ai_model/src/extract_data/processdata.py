import os
import json
import time
from resume_upgrade_module import get_job_position, process_data,normalize_keys,parse_resume
def get_pdf_filenames(directory):
    # Danh sách để lưu tên file
    pdf_files = []
    
    # Duyệt qua từng file trong thư mục
    for filename in os.listdir(directory):
        # Kiểm tra xem file có đuôi .pdf không
        if filename.endswith('.pdf'):
            pdf_files.append(filename)
    
    return pdf_files


def append_to_json_file(file_path, data):
        with open(file_path, 'a') as f:
            f.write('{\n')
            f.write(json.dumps(data, indent=4)[1:-1])  # Remove surrounding brackets
            f.write('}\n')
            f.write(',\n')
def write_count_to_file(count, file_path):
    with open(file_path, 'w') as file:
        file.write(str(count))  # Chuyển đổi count thành chuỗi và ghi vào file
def read_count_from_file(file_path):
    try:
        with open(file_path, 'r') as file:
            count = int(file.read().strip())  # Đọc nội dung và chuyển thành số nguyên
            return count
    except (FileNotFoundError, ValueError):
        return 0  # Trả về 0 nếu file không tồn tại hoặc không thể chuyển đổi
    





def process_resumes(directory_path,  c):
    # Ghi đè count bằng 0
    write_count_to_file(c, "count.txt")
    
    pdf_filenames = get_pdf_filenames(directory_path)
    file_path = 'training_data1.json'
    count = read_count_from_file("count.txt")
    i = 0
    last_backslash_index = directory_path.rfind('\\')

    for pdf in pdf_filenames:
        if i < count and count != 0:
            i += 1
            continue
        i += 1
        
        pdf_path = f"{directory_path}\\{pdf}"  # Sử dụng đường dẫn đã cho
        resume_data = parse_resume(pdf_path)
        
        if resume_data is None:
            print(f"{pdf} resume_data1 is None!")
            continue

        resume_data1 = normalize_keys(resume_data)
        esdata = process_data(resume_data1)
        jobName = get_job_position(esdata)

        if esdata is None:
            print(f"{pdf} resume_data1 is None!")
            continue
        else:
            for key, value in esdata.items():
                print("\n\n\tLoading...")
                sample = {
                    "context": "Resume for " + (directory_path[last_backslash_index + 1:] if (jobName =="" or jobName == None) else jobName) ,
                    "field_name": key,
                    "field_data": value,
                    "label": 1,
                    "corrected_field_name": key
                }
                append_to_json_file(file_path, sample)
                print("\nDone key:...", key)

        write_count_to_file(i, "count.txt")
        time.sleep(5)

# Gọi hàm với đường dẫn thư mục  91552
# directory_path = 'E:\\Study\\NCKH\\archive\\data\\data\\CONSULTANT'
# process_resumes(directory_path,0)
# write_count_to_file(directory_path, "pr.txt")

directory_path = 'E:\\Study\\NCKH\\archive\\data\\data\\DESIGNER'
process_resumes(directory_path,62)
write_count_to_file(directory_path, "pr.txt")

directory_path = 'E:\\Study\\NCKH\\archive\\data\\data\\DIGITAL-MEDIA'
process_resumes(directory_path,0)
write_count_to_file(directory_path, "pr.txt")

directory_path = 'E:\\Study\\NCKH\\archive\\data\\data\\ENGINEERING'
process_resumes(directory_path,0)
write_count_to_file(directory_path, "pr.txt")


directory_path = 'E:\\Study\\NCKH\\archive\\data\\data\\FINANCE'
process_resumes(directory_path,0)
write_count_to_file(directory_path, "pr.txt")

directory_path = 'E:\\Study\\NCKH\\archive\\data\\data\\FITNESS'
process_resumes(directory_path,0)
write_count_to_file(directory_path, "pr.txt")














# write_count_to_file (0,"count.txt")
# directory_path = 'E:\\Study\\NCKH\\archive\\data\\data\\AVIATION'
# pdf_filenames = get_pdf_filenames(directory_path)
# file_path = 'training_data1.json'
# count=read_count_from_file("count.txt")
# i=0
# # In ra danh sách tên file PDF
# for pdf in pdf_filenames:
    
    
#     if i < count and count != 0:
#         i+=1
#         continue
#     i+=1
    
#     # print(pdf)
#     pdf_path = 'E:\\Study\\NCKH\\archive\\data\\data\\AVIATION\\'+pdf
#     resume_data = parse_resume(pdf_path)
#     if resume_data is None:
        
#         print(pdf," resume_data1 is None!")
#         continue

#     # print(resume_data)
#     resume_data1=normalize_keys(resume_data)
   
#     esdata=process_data(resume_data1)
#     jobName= get_job_position(esdata)
#     # print(jobName)
#     if esdata is None:
#         print(pdf," resume_data1 is None!")
#         continue
#     else:
#         for key, value in esdata.items():
#         # print(f"\n\n\tKey: {key},\n Value: {value}")
        
#             print("\n\n\tLoading...")
#             sample={
#                 "context": "Resume for "+jobName,
#                 "field_name": key,
#                 "field_data": value,
#                 "label": 1,
#                 "corrected_field_name": key
#             }
#             append_to_json_file(file_path, sample)
#             print("\nDone key:...", key)

#     write_count_to_file (i,"count.txt")
#     time.sleep(10)



# write_count_to_file (0,"count.txt")

# directory_path = 'E:\\Study\\NCKH\\archive\\data\\data\\BANKING'
# pdf_filenames = get_pdf_filenames(directory_path)
# file_path = 'training_data1.json'
# count=read_count_from_file("count.txt")
# i=0
# # In ra danh sách tên file PDF
# for pdf in pdf_filenames:
    
    
#     if i < count and count != 0:
#         i+=1
#         continue
#     i+=1
    
#     # print(pdf)
#     pdf_path = 'E:\\Study\\NCKH\\archive\\data\\data\\BANKING\\'+pdf
#     resume_data = parse_resume(pdf_path)
#     if resume_data is None:
        
#         print(pdf," resume_data1 is None!")
#         continue

#     # print(resume_data)
#     resume_data1=normalize_keys(resume_data)
   
#     esdata=process_data(resume_data1)
#     jobName= get_job_position(esdata)
#     # print(jobName)
#     if esdata is None:
#         print(pdf," resume_data1 is None!")
#         continue
#     else:
#         for key, value in esdata.items():
#         # print(f"\n\n\tKey: {key},\n Value: {value}")
        
#             print("\n\n\tLoading...")
#             sample={
#                 "context": "Resume for "+jobName,
#                 "field_name": key,
#                 "field_data": value,
#                 "label": 1,
#                 "corrected_field_name": key
#             }
#             append_to_json_file(file_path, sample)
#             print("\nDone key:...", key)

#     write_count_to_file (i,"count.txt")
#     time.sleep(10)


