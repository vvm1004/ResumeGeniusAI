

from textblob import TextBlob
def check_and_correct_spelling_with_positions(sentence):
    if isinstance(sentence, dict):
        # Nếu là dict, kết hợp tất cả các giá trị thành một chuỗi
        sentence = ' '.join(str(value) for value in sentence.values())

    elif isinstance(sentence, list):
        # Nếu là list, kiểm tra từng phần tử
        # Chuyển đổi từng phần tử thành chuỗi nếu cần
        sentence = ' '.join(str(value) for value in sentence)

    # Kiểm tra nếu sentence là chuỗi rỗng
    if not sentence:
        return '', {}

    blob = TextBlob(sentence)
    corrected_sentence = str(blob.correct())
    
    # Tách câu gốc và câu đã sửa thành danh sách các từ
    original_words = sentence.split()
    corrected_words = corrected_sentence.split()

    corrections = {}
    
    # So sánh từng từ để tìm vị trí đã sửa
    for index, (original, corrected) in enumerate(zip(original_words, corrected_words)):
        if original != corrected:
            corrections[index] = (original, corrected)

    return corrected_sentence, corrections
