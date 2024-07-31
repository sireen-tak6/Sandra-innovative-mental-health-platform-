import React, { useEffect, useState } from 'react';


{/* this component just for test and see the results */}



function ScriptComponent() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/get/posts')
      .then(response => response.json())
      .then(data => {
        const sortedPosts = data.posts;
        setPosts(sortedPosts);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div>
      <h1>Ranked Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            Post ID: {post.id}, Like Count: {post.like}, Dislike Count: {post.report}
            <video controls src={post.path}></video>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ScriptComponent;

