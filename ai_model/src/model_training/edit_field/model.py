import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn import metrics
import joblib
import os
data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'data','training_data.json')

# Đọc dữ liệu từ file JSON
with open(data_dir, 'r') as file:
    data = json.load(file)

# Chuyển đổi dữ liệu thành DataFrame
df = pd.DataFrame(data)

# Kiểm tra cấu trúc dữ liệu
print(df.head())

# Chỉ lấy các cột cần thiết
df = df[['field_data', 'corrected_field_name']]

# Chia dữ liệu thành các tập huấn luyện và kiểm tra
X = df['field_data']
y = df['corrected_field_name']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Tạo pipeline với Tfidf và Naive Bayes
model = make_pipeline(TfidfVectorizer(), MultinomialNB())


model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'model')
model_path = os.path.join(model_dir, 'edit_field.pkl')

# Huấn luyện mô hình
model.fit(X_train, y_train)
joblib.dump(model, model_path)

# Dự đoán
y_pred = model.predict(X_test)

# Đánh giá
print("Accuracy:", metrics.accuracy_score(y_test, y_pred))
print("Classification Report:\n", metrics.classification_report(y_test, y_pred))
