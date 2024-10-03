# python src/model_training/check_meaning/model.py

import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Embedding, LSTM, concatenate
from tensorflow.keras.models import Model
import os


# Tạo và huấn luyện mô hình
def create_and_train_model(keys, values, labels, tokenizer):
    key_sequences = tokenizer.texts_to_sequences(keys)
    value_sequences = tokenizer.texts_to_sequences(values)
    
    # Padding các sequence
    key_sequences = tf.keras.preprocessing.sequence.pad_sequences(key_sequences, padding='post')
    value_sequences = tf.keras.preprocessing.sequence.pad_sequences(value_sequences, padding='post')
    
    # Chuyển labels thành numpy array
    labels = np.array(labels)
    
    vocab_size = len(tokenizer.word_index) + 1
    embedding_dim = 128
    key_input_length = key_sequences.shape[1]
    value_input_length = value_sequences.shape[1]

    # Xây dựng mô hình
    key_input = Input(shape=(key_input_length,), name='key_input')
    value_input = Input(shape=(value_input_length,), name='value_input')
    
    embedding_layer = Embedding(input_dim=vocab_size, output_dim=embedding_dim)
    
    key_embedding = embedding_layer(key_input)
    value_embedding = embedding_layer(value_input)
    
    lstm_layer = LSTM(64)
    
    key_output = lstm_layer(key_embedding)
    value_output = lstm_layer(value_embedding)
    
    concat = concatenate([key_output, value_output])
    dense = Dense(64, activation='relu')(concat)
    output = Dense(1, activation='sigmoid')(dense)
    
    model = Model(inputs=[key_input, value_input], outputs=output)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    # Huấn luyện mô hình
    model.fit([key_sequences, value_sequences], labels, epochs=10, batch_size=32, validation_split=0.2)
    
    return model


#create_sample_data()
# Tải dữ liệu huấn luyện
data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'data','training_data.json')


with open(data_dir, 'r') as f:
    data = json.load(f)

keys = [d['field_name'] for d in data]
values = [d['field_data'] for d in data]
labels = [d['label'] for d in data]
corrected_keys = [d['corrected_field_name'] for d in data]

# Tạo tokenizer
tokenizer = tf.keras.preprocessing.text.Tokenizer()
tokenizer.fit_on_texts(keys + values + corrected_keys)

# Tạo và huấn luyện mô hình
model = create_and_train_model(keys, values, labels, tokenizer)


model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'model')
model_path = os.path.join(model_dir, 'check_meaning.keras')
tokenizer_path = os.path.join(model_dir, 'check_meaning_tokenizer.json')



# Lưu mô hình và tokenizer
model.save(model_path)


tokenizer_json = tokenizer.to_json()
with open(tokenizer_path, 'w') as f:
    f.write(tokenizer_json)