import React from 'react'
import { useState, useEffect } from 'react';
import './LikedPost.css';
import axiosClient from '../../axios'
import { Navigate, useNavigate } from 'react-router-dom';


function LikedPost() {
    const [posts, setPosts] = useState([]);
    const completePath = 'http://localhost:8000/storage/'
    const [displayedPosts, setDisplayedPosts] = useState(8);
    const navigate = useNavigate()

    useEffect(() => {
        const userId = localStorage.getItem('user-id');
        if (userId) {
            axiosClient
                .get(`/get/suggestion/post/${userId}`)
                .then((response) => {
                    const data = response.data;
                    setPosts(data.posts);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);


    const handleSeeItClick = (postCategory) => {
    localStorage.setItem('post-category', postCategory);
    navigate('/see/post');
  };

  
  const handleLoadMore = () => {
    setDisplayedPosts(displayedPosts + 8);
  };

    return (
        <div className='P'>
            {/* Cards section */}
            <div className='p-3 mt-[150px] ml-5 '>
                <div className='max-h-[480px]' style={{ overflowX: 'hidden' }}>
                    <div className='flex flex-wrap -mx-1 mt-0 '>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div 
                                    key={post.id}
                                    className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 h-3/5 px-4 pl-1 '
                                >
                                    <div className='flex flex-col rounded-xl mt-4 cards p-2 h-[310px] onn'>
                                        {/* video section */}
                                        <div className='flex justify-content-between'>
                                            <video controls src={`${completePath}${post.path}`} />
                                        </div>
                                        {/* description section */}
                                        <div className='mt-2 max-h-[25px] max-w-[300px] mb-2'>
                                            Description: {post.description}
                                        </div>
                                        {/* See it button */}
                                        <div>
                                            <button className='ml-[37%] mt-[50px] buttonnn'
                                            onClick={() => handleSeeItClick(post.category)}>
                                                See it
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='mt-[250px] ml-[45%] font-mono font-weight-bold text-xl'>No posts found.</div>
                        )}
                    </div>
                </div>
            </div>

            <div>
                {posts.length > 8 && <button className='buttonnnn ml-[50%]' onClick={handleLoadMore}>LOAD MORE</button>}
            </div>
        </div>
    );
}

export default LikedPost;