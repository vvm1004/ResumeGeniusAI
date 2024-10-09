from transformers import pipeline

# Tải mô hình BART cho việc chỉnh sửa văn bản
text_summarizer = pipeline("text2text-generation", model="facebook/bart-large-cnn")

# Câu cần chỉnh sửa
input_sentence = "Increased annual sales to nearly $5.7 million through strategic marketing & sales campaigns."

# Sử dụng mô hình để cải thiện câu
improved_sentence = text_summarizer(input_sentence, max_length=50, do_sample=False)
print(improved_sentence[0]['generated_text'])
