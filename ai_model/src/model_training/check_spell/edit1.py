import os
from dotenv import load_dotenv
from transformers import BartForConditionalGeneration, BartTokenizer

# Tải các biến môi trường từ file .env
load_dotenv()

# Lấy giá trị cache_dir từ biến môi trường
cache_dir = os.getenv('CACHE_DIR')

# Tải mô hình và tokenizer cho BART từ cache_dir
model_name = "facebook/bart-large-cnn"
model = BartForConditionalGeneration.from_pretrained(model_name, cache_dir=cache_dir)
tokenizer = BartTokenizer.from_pretrained(model_name, cache_dir=cache_dir)

def optimize_resume(sentence):
    """Tối ưu hóa nội dung của resume."""
    input_text = f"optimize: {sentence}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt")

    output = model.generate(input_ids)
    optimized_sentence = tokenizer.decode(output[0], skip_special_tokens=True)

    return optimized_sentence

def enhance_sentence(sentence):
    """Nâng cao câu bằng NLP."""
    input_text = f" {sentence}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt")

    output = model.generate(input_ids)
    enhanced_sentence = tokenizer.decode(output[0], skip_special_tokens=True)

    return enhanced_sentence

def generate_improved_text(sentence):
    """Sinh văn bản cho việc cải thiện resume."""
    input_text = f"generate: {sentence}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt")

    output = model.generate(input_ids)
    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

    return generated_text


