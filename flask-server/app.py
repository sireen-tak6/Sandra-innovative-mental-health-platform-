from flask import Flask, jsonify
from flask_cors import CORS
import requests
import json
import numpy as np
from sklearn.svm import SVC

app = Flask(__name__)
CORS(app)

@app.route('/api/get/posts')
def get_posts():
    response = requests.get('http://127.0.0.1:8000/api/get/posts')

    if response.status_code == 200:
        data = response.json()
        posts = data['posts']

        X = []
        y = []
        class_labels = {}
        class_counter = 0

        for post in posts:
            like_count = post['like']
            dislike_count = post['report']
            X.append([like_count, -dislike_count])

            if post['id'] not in class_labels:
                class_labels[post['id']] = class_counter
                class_counter += 1
            y.append(class_labels[post['id']])

        svm = SVC(kernel='linear')
        svm.fit(X, y)

        rankings = svm.decision_function(X)
        rankings = np.squeeze(rankings)

        sorted_indices = np.argsort(rankings)[::-1]
        sorted_indices = sorted_indices.flatten().tolist()
        sorted_posts = [posts[i] for i in sorted_indices]

        result = {'sorted_posts': sorted_posts}

        with open('ranking_results.json', 'w') as file:
            json.dump(result, file)

        print("Ranking results saved in 'ranking_results.json' file.")

        
        num_classes = len(set(y))
        unique_sorted_posts = sorted_posts[:num_classes]
        print(f"Ranking Results (Top {num_classes}):")
        for i, post in enumerate(unique_sorted_posts):
            print(f"Rank {i+1}: Post ID {post['id']}, Like Count: {post['like']}, Dislike Count: {post['report']}")

        return jsonify({'posts': unique_sorted_posts})
    else:
        return jsonify({'error': 'Failed to fetch posts from the API'})

if __name__ == '__main__':
    app.run(debug=True)