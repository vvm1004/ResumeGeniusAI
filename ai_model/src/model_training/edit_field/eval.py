from sklearn import metrics

import joblib
import json
import pandas as pd
import os
data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'data','training_data.json')

# Đọc dữ liệu kiểm tra từ file JSON
with open(data_dir, 'r') as file:
    test_data = json.load(file)

# Chuyển dữ liệu kiểm tra thành DataFrame
test_df = pd.DataFrame(test_data)

# Chỉ lấy các cột cần thiết
X_test_data = test_df['field_data']
y_test_data = test_df['corrected_field_name']

# Load mô hình từ file
model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'model')
model_path = os.path.join(model_dir, 'edit_field.pkl')
model = joblib.load(model_path)

# Dự đoán trên tập kiểm tra
y_test_pred = model.predict(X_test_data)

# Đánh giá
print("Test Accuracy:", metrics.accuracy_score(y_test_data, y_test_pred))
print("Test Classification Report:\n", metrics.classification_report(y_test_data, y_test_pred))
