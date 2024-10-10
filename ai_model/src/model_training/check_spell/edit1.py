
from transformers import BartForConditionalGeneration, BartTokenizer

# Tải mô hình và tokenizer cho BART
model_name = "facebook/bart-large-cnn"
model = BartForConditionalGeneration.from_pretrained(model_name)
tokenizer = BartTokenizer.from_pretrained(model_name)

def optimize_resume(sentence):
    """Tối ưu hóa nội dung của resume."""
    # Giả định rằng mô hình sẽ tối ưu hóa cấu trúc câu
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


# Ví dụ sử dụng
# example_sentence = "Increase annual sales to nearly $5.7 million through strategic marketing & sales campaigns.', 'Launched aggressive growth plans that helped increase customer base from 0 to 15,000 customers.', 'Created strategies to develop and expand existing customer sales, which resulted in a 200% sales growth in less than 12 months.', 'Grew a targeted newsletter subscriber list from 0 to 6,000 members in just 12 months.'"

# print("\nOriginal Sentence:", example_sentence)

# # Tối ưu hóa resume
# optimized_sentence = optimize_resume(example_sentence)
# print("\nOptimized Resume Sentence:", optimized_sentence)

# # Nâng cao câu
# enhanced_sentence = enhance_sentence(example_sentence)
# print("\nEnhanced Sentence:", enhanced_sentence)

# # Sinh văn bản cải thiện
# generated_improved_text = generate_improved_text(example_sentence)
# print("\nGenerated Improved Text:", generated_improved_text)
