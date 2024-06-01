import pandas as pd
import json
from sklearn.preprocessing import LabelEncoder
from keras.models import Model
from keras.layers import Input, Embedding, Flatten, Multiply, Concatenate, Dense, LeakyReLU, BatchNormalization, Dropout
from keras.regularizers import l2
from keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.model_selection import train_test_split
import numpy as np
import tensorflow as tf
import sys

# Cấu hình stdout để sử dụng mã hóa UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def main():
    # Load the data
    comments = pd.read_csv('data/comment.csv')
    novels = pd.read_csv('data/novel.csv')

    # Drop rows with NaN values in specified columns
    comments.dropna(subset=['accountId', 'novelId', 'commentId'], inplace=True)
    novels.dropna(subset=['novelId'], inplace=True)

    comments['accountId'] = comments['accountId'].astype(np.int64)
    comments['novelId'] = comments['novelId'].astype(np.int64)
    novels['novelId'] = novels['novelId'].astype(np.int64)

    # Encode user and novel IDs
    user_encoder = LabelEncoder()
    novel_encoder = LabelEncoder()
    category_encoder = LabelEncoder()

    comments['user'] = user_encoder.fit_transform(comments['accountId'])
    comments['novel'] = novel_encoder.fit_transform(comments['novelId'])
    novels['category'] = category_encoder.fit_transform(novels['categoryName'])

    # Create and save encoders
    with open('data/user_encoder.json', 'w', encoding='utf-8') as f:
        json.dump(user_encoder.classes_.tolist(), f, ensure_ascii=False)
    with open('data/novel_encoder.json', 'w', encoding='utf-8') as f:
        json.dump(novel_encoder.classes_.tolist(), f, ensure_ascii=False)
    with open('data/category_encoder.json', 'w', encoding='utf-8') as f:
        json.dump(category_encoder.classes_.tolist(), f, ensure_ascii=False)

    # Create mappings for novel, user, and category IDs
    novel_id_mapping = dict(zip(novel_encoder.classes_, novel_encoder.transform(novel_encoder.classes_)))
    reverse_novel_id_mapping = dict(zip(novel_encoder.transform(novel_encoder.classes_), novel_encoder.classes_))
    user_id_mapping = dict(zip(user_encoder.classes_, user_encoder.transform(user_encoder.classes_)))
    reverse_user_id_mapping = dict(zip(user_encoder.transform(user_encoder.classes_), user_encoder.classes_))
    category_id_mapping = dict(zip(category_encoder.classes_, category_encoder.transform(category_encoder.classes_)))
    reverse_category_id_mapping = dict(zip(category_encoder.transform(category_encoder.classes_), category_encoder.classes_))

    # Save mappings to JSON
    def save_mapping(mapping, filename):
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({str(k): int(v) for k, v in mapping.items()}, f, ensure_ascii=False)

    def save_reverse_mapping(mapping, filename):
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({int(k): str(v) for k, v in mapping.items()}, f, ensure_ascii=False)

    save_mapping(novel_id_mapping, 'data/novel_id_mapping.json')
    save_reverse_mapping(reverse_novel_id_mapping, 'data/reverse_novel_id_mapping.json')
    save_mapping(user_id_mapping, 'data/user_id_mapping.json')
    save_reverse_mapping(reverse_user_id_mapping, 'data/reverse_user_id_mapping.json')
    save_mapping(category_id_mapping, 'data/category_id_mapping.json')
    save_reverse_mapping(reverse_category_id_mapping, 'data/reverse_category_id_mapping.json')

    # Merge category information into comments
    comments = comments.merge(novels[['novelId', 'category']], left_on='novelId', right_on='novelId', how='left')

    # Normalize ratings
    ratings = comments[['user', 'novel', 'category', 'rating']].astype(np.float32)

    # Split the data into training and testing sets
    train_data, test_data = train_test_split(ratings, test_size=0.2, random_state=42)

    train_users = train_data['user'].values
    train_novels = train_data['novel'].values
    train_categories = train_data['category'].values
    train_ratings = train_data['rating'].values

    test_users = test_data['user'].values
    test_novels = test_data['novel'].values
    test_categories = test_data['category'].values
    test_ratings = test_data['rating'].values

    # Define the model
    embedding_dim = 64
    dropout_rate = 0.4
    dense_units = 64
    learning_rate = 0.0001
    reg_value = 0.01
    regularization = l2(reg_value)

    num_users = len(user_encoder.classes_)
    num_novels = len(novel_encoder.classes_)
    num_categories = len(category_encoder.classes_)

    user_input = Input(shape=(1,), dtype='int32', name='user_input')
    novel_input = Input(shape=(1,), dtype='int32', name='novel_input')
    category_input = Input(shape=(1,), dtype='int32', name='category_input')

    user_embedding_gmf = Embedding(input_dim=num_users, output_dim=embedding_dim, name='user_embedding_gmf')(user_input)
    novel_embedding_gmf = Embedding(input_dim=num_novels, output_dim=embedding_dim, name='novel_embedding_gmf')(novel_input)
    category_embedding_gmf = Embedding(input_dim=num_categories, output_dim=embedding_dim, name='category_embedding_gmf')(category_input)

    user_vec_gmf = Flatten()(user_embedding_gmf)
    novel_vec_gmf = Flatten()(novel_embedding_gmf)
    category_vec_gmf = Flatten()(category_embedding_gmf)

    gmf = Multiply()([user_vec_gmf, novel_vec_gmf, category_vec_gmf])

    user_embedding_mlp = Embedding(input_dim=num_users, output_dim=embedding_dim, name='user_embedding_mlp')(user_input)
    novel_embedding_mlp = Embedding(input_dim=num_novels, output_dim=embedding_dim, name='novel_embedding_mlp')(novel_input)
    category_embedding_mlp = Embedding(input_dim=num_categories, output_dim=embedding_dim, name='category_embedding_mlp')(category_input)

    user_vec_mlp = Flatten()(user_embedding_mlp)
    novel_vec_mlp = Flatten()(novel_embedding_mlp)
    category_vec_mlp = Flatten()(category_embedding_mlp)

    mlp = Concatenate()([user_vec_mlp, novel_vec_mlp, category_vec_mlp])
    mlp = Dense(dense_units, kernel_regularizer=regularization)(mlp)
    mlp = LeakyReLU(negative_slope=0.1)(mlp)
    mlp = BatchNormalization()(mlp)
    mlp = Dropout(dropout_rate)(mlp)
    mlp = Dense(dense_units // 2, kernel_regularizer=regularization)(mlp)
    mlp = LeakyReLU(negative_slope=0.1)(mlp)
    mlp = BatchNormalization()(mlp)
    mlp = Dropout(dropout_rate)(mlp)
    mlp = Dense(dense_units // 4, kernel_regularizer=regularization)(mlp)
    mlp = LeakyReLU(negative_slope=0.1)(mlp)
    mlp = BatchNormalization()(mlp)

    neumf = Concatenate()([gmf, mlp])
    output = Dense(1)(neumf)

    model = Model(inputs=[user_input, novel_input, category_input], outputs=output)
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate), loss='mean_squared_error', metrics=['mae', 'mape', tf.keras.metrics.RootMeanSquaredError()])

    # Early Stopping and ReduceLROnPlateau
    early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=2, min_lr=0.00001)

    # Model Training
    history = model.fit([train_users, train_novels, train_categories], train_ratings,
                        batch_size=256, epochs=100, verbose=1,
                        validation_data=([test_users, test_novels, test_categories], test_ratings),
                        callbacks=[early_stopping, reduce_lr])

    model.save('data/recommendation_model.h5')

    # Model Evaluation
    eval_results = model.evaluate([test_users, test_novels, test_categories], test_ratings, verbose=1)
    print(f"Test Loss: {eval_results[0]}, Test MAE: {eval_results[1]}, Test MAPE: {eval_results[2]}, Test RMSE: {eval_results[3]}")

    novel_id_to_name = dict(zip(novels['novelId'], novels['name']))

    def recommend_novels(user_id, top_n=10):
        user_index = user_encoder.transform([user_id])[0]
        novel_indices = np.arange(num_novels)
        category_indices = novels['category'].values
        predictions = model.predict([np.full(num_novels, user_index), novel_indices, category_indices])
        top_novels = predictions.flatten().argsort()[-top_n:][::-1]
        recommended_novels_ids = novel_encoder.inverse_transform(top_novels)
        # Map novel IDs to names
        recommended_novels = [(nid, novel_id_to_name[nid]) for nid in recommended_novels_ids]
        
        return recommended_novels
    
    # Example usage
    recommendations = recommend_novels('4304343304')
    for novel_id, novel_name in recommendations:
        print(f"Novel ID: {novel_id}, Name: {novel_name}")


if __name__ == "__main__":
    main()
