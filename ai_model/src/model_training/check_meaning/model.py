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
    
    key_sequences = tf.keras.preprocessing.sequence.pad_sequences(key_sequences, padding='post')
    value_sequences = tf.keras.preprocessing.sequence.pad_sequences(value_sequences, padding='post')
    
    labels = np.array(labels)
    
    vocab_size = len(tokenizer.word_index) + 1
    embedding_dim = 128
    key_input_length = key_sequences.shape[1]
    value_input_length = value_sequences.shape[1]

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
    
    model.fit([key_sequences, value_sequences], labels, epochs=10, batch_size=32, validation_split=0.2)
    
    return model



data_dir = os.path.join('dataHandling', 'merged_data.json')

with open(data_dir, 'r', encoding='utf-8') as f:
    data = json.load(f)

keys = [d['field_name'] for d in data]
values = []

for d in data:
    field_data = d.get('field_data')
    if field_data is None:
        print("Skipping entry with missing 'field_data'\n",d)
        continue  # Skip to the next iteration
    field_data = str(field_data)
    # print("\n\n\t value: ", field_data)
    values.append(field_data)

labels = [d['label'] for d in data]
corrected_keys = [d['corrected_field_name'] for d in data]

# Tạo tokenizer
tokenizer = tf.keras.preprocessing.text.Tokenizer()
tokenizer.fit_on_texts(keys + values + corrected_keys)

# Tạo và huấn luyện mô hình
model = create_and_train_model(keys, values, labels, tokenizer)

model_dir = os.path.join('final', 'final_model.keras')
tokenizer_dir=os.path.join('final', 'final_tokenizer.json')
# Lưu mô hình và tokenizer
model.save(model_dir)
tokenizer_json = tokenizer.to_json()
with open(tokenizer_dir, 'w') as f:
    f.write(tokenizer_json)
