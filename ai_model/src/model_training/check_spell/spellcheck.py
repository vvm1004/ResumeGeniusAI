

# from textblob import TextBlob
# def check_and_correct_spelling_with_positions(sentence):
#     if isinstance(sentence, dict):
#         sentence = ' '.join(str(value) for value in sentence.values())

#     elif isinstance(sentence, list):
    
#         sentence = ' '.join(str(value) for value in sentence)

#     if not sentence:
#         return '', {}

#     blob = TextBlob(sentence)
#     corrected_sentence = str(blob.correct())
    
#     original_words = sentence.split()
#     corrected_words = corrected_sentence.split()

#     corrections = {}
    
#     for index, (original, corrected) in enumerate(zip(original_words, corrected_words)):
#         if original != corrected:
#             corrections[index] = (original, corrected)

#     return corrected_sentence, corrections
import os
from symspellpy import SymSpell, Verbosity
import re
def load_dictionary():
    sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
    # Lấy đường dẫn tệp từ điển trong thư mục hiện tại
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dictionary_path = os.path.join(current_dir, "frequency_dictionary_en_82_765.txt")
    
    # Kiểm tra xem tệp có tồn tại không
    if not os.path.exists(dictionary_path):
        raise FileNotFoundError(f"Tệp từ điển không được tìm thấy: {dictionary_path}")
    
    # Tải từ điển
    sym_spell.load_dictionary(dictionary_path, term_index=0, count_index=1)
    
    # Thêm từ chuyên ngành vào từ điển
    custom_words = ["DevOps", "AWS", "Terraform", "Docker", "Gitlab", "Jenkins", ".NET"]
    for word in custom_words:
        sym_spell.create_dictionary_entry(word, 1)
    
    return sym_spell
def normalize_word(word):
    """Normalize word by removing repeated characters like 'aaa'."""
    return re.sub(r"(.)\1{2,}", r"\1", word)
def capitalize_if_needed(word, original_word):
    """Capitalize the word if the original was capitalized."""
    if original_word[0].isupper():
        return word.capitalize()
    return word

def check_and_correct_spelling_with_positions(sentence):
    sym_spell = load_dictionary()
    
    if isinstance(sentence, dict):
        sentence = ' '.join(str(value) for value in sentence.values())
    elif isinstance(sentence, list):
        sentence = ' '.join(str(value) for value in sentence)

    if not sentence:
        return '', {}

    original_words = sentence.split()
    corrected_words = []
    corrections = {}
    unknown_words = []

    # Xác định vị trí đầu câu
    sentence_start = True

    for index, word in enumerate(original_words):
        normalized_word = normalize_word(word)
        suggestions = sym_spell.lookup(normalized_word, Verbosity.CLOSEST, max_edit_distance=2)

        if suggestions:
            corrected_word = suggestions[0].term
            if sentence_start:  # Nếu là từ đầu câu, viết hoa
                corrected_word = capitalize_if_needed(corrected_word, word)
            corrected_words.append(corrected_word)
            if corrected_word != word:
                corrections[index] = (word, corrected_word)
        else:
            corrected_words.append(word)
            if not suggestions:
                unknown_words.append(word)
        
        # Cập nhật trạng thái đầu câu
        sentence_start = word.endswith('.') or word.endswith('!') or word.endswith('?')

    corrected_sentence = ' '.join(corrected_words)

    # In các từ không nhận dạng được
    if unknown_words:
        print("Unknown words:", unknown_words)
    print("corrections:\t",corrections)

    return corrected_sentence, corrections