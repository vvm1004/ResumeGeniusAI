
import json
import joblib
import os
model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'model','edit','trained_model.pkl')
token_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),  'model','edit','vectorizer.pkl')

# Tải mô hình đã lưu
model = joblib.load(model_dir)
vectorizer = joblib.load(token_dir)  # Lưu vectorizer nếu cần

def predict_field_name(value):
    test_values = [str(value)]

    test_vectorized = vectorizer.transform(test_values)

    predictions = model.predict(test_vectorized)

    return predictions[0]  

if __name__ == "__main__":
    # Test case
  
    field_data="C++, Java"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)


    field_data="123 Main St, Cityville, ST 12345"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)

    field_data="0934977521"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)
    

    field_data="tranduongtruong@gmail.com"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)
    
    
    field_data="www.johndoeworks.com"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)
    
    
    field_data="Communication"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)

    
    field_data="Obtained a degree from University of Technology Ho Chi Minh City."
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)


    field_data="Obtained a degree from University of Technology Ho Chi Minh City."
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)

    field_data="IELTS, JLPT"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)

    field_data="Male"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)

    field_data="Currently serve as a volunteer for the Sexual Assault Response Team (SART), provide support to victims in crisis, document vital information related to assault, and make appropriate referrals available victims."
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)
    

    field_data="To obtain admittance into the Masters of Science in Health Science and Rehabilitation program at Rocky Mountain University."
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)

    field_data="Habitat For Humanity"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)

    field_data="{'title': 'Curriculum Development', 'date': '2024', 'description': 'Developed and implemented a new curriculum for improved educational outcomes.', 'technology': 'Curriculum Design, Educational Research', 'link_github': 'github.com/educationconsultant/curriculum-development', 'link_demo': 'demo.com/curriculum-development'}"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)

    field_data="{'title': 'Viral Marketing Campaign', 'date': '2024', 'description': 'Created a viral marketing campaign that significantly boosted brand visibility.', 'technology': 'Social Media, Video Production', 'link_github': 'github.com/contentcreator/viral-marketing-campaign', 'link_demo': 'demo.com/viral-marketing-campaign'}"
    result = predict_field_name(field_data)
    print("data: ",field_data,"\t\tresult: ", result)