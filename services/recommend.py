import numpy as np
import json
import sys
import pandas as pd
from keras.models import load_model

# Ensure UTF-8 encoding for the output
sys.stdout.reconfigure(encoding='utf-8')

# Load encoders and mappings
with open('data/user_encoder.json', 'r', encoding='utf-8') as f:
    user_classes = json.load(f)
with open('data/novel_encoder.json', 'r', encoding='utf-8') as f:
    novel_classes = json.load(f)
with open('data/category_encoder.json', 'r', encoding='utf-8') as f:
    category_classes = json.load(f)

# Load mappings
with open('data/reverse_novel_id_mapping.json', 'r', encoding='utf-8') as f:
    reverse_novel_id_mapping = json.load(f)
with open('data/novel_id_mapping.json', 'r', encoding='utf-8') as f:
    novel_id_mapping = json.load(f)
with open('data/reverse_user_id_mapping.json', 'r', encoding='utf-8') as f:
    reverse_user_id_mapping = json.load(f)
with open('data/user_id_mapping.json', 'r', encoding='utf-8') as f:
    user_id_mapping = json.load(f)

# Load the pre-trained model
model = load_model('data/recommendation_model.h5')

# Load the ratings data once and keep it in memory
ratings = pd.read_csv('data/comment.csv')

def recommend_novels(user_id, top_n=50):
    # Check if user_id is valid
    user_id_str = str(user_id)
    if user_id_str not in user_id_mapping:
        return {"error": "Invalid user_id"}

    # Convert user_id to the model's internal encoding
    user_index = user_id_mapping[user_id_str]
    
    # Get list of novels the user has already rated
    rated_novels = ratings[ratings['accountId'] == int(user_id)]['novelId'].tolist()
    rated_novel_indices = [novel_id_mapping[str(nid)] for nid in rated_novels if str(nid) in novel_id_mapping]
    
    # Create array of all novel indices
    novel_indices = np.arange(len(novel_classes))
    
    # Remove novels that have already been rated
    novel_indices = np.setdiff1d(novel_indices, rated_novel_indices)
    
    # Assuming all novels belong to the first category for simplicity, replace with actual categories if available
    novel_categories = np.zeros_like(novel_indices)  # Change this based on actual category data if available
    
    # Prepare input for model prediction
    predictions = model.predict([np.full_like(novel_indices, user_index), novel_indices, novel_categories])
    
    # Get top N novel indices with the highest predicted ratings
    top_n_indices = np.argsort(predictions[:, 0])[-top_n:][::-1]
    
    # Map back to original novel IDs and include the predicted ratings
    recommended_novels = [{"id": reverse_novel_id_mapping[str(idx)], "predicted_rating": float(predictions[idx, 0])} for idx in top_n_indices]
    
    return recommended_novels

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            user_id = int(sys.argv[1])
            recommendations = recommend_novels(user_id)
            print(json.dumps(recommendations, ensure_ascii=False))
        except ValueError:
            print(json.dumps({"error": "Invalid user_id"}, ensure_ascii=False))
    else:
        print(json.dumps({"error": "No user_id provided"}, ensure_ascii=False))
