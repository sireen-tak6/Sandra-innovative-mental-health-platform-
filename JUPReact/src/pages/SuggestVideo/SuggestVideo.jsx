import React, { useEffect, useState } from 'react'
import post2 from '../../../public/assetss/imagepost.png';
import '../PostsSession/PostsSession.css'; 
import Swal from 'sweetalert2';
import axiosClient from '../../axios';
import doctor from '../../../public/assetss/doctoricon.png';
import hand from '../../../public/assetss/hand.png';
import { useNavigate } from 'react-router-dom';

function SuggestVideo() {

    const [posts, setPosts] = useState([]);
    const navigate = useNavigate(); 
    const completePath = 'http://localhost:8000/';

    const fetchSuggetstionPost = async () => {
        try {
            const response = await axiosClient.get(
                `/get/suggestion/post/${localStorage.getItem('user-id')}`);
            const data = response.data;
            setPosts(data.posts)
        }
        catch (error) {
            console.log("error fetching suggestion video", error);
            handleError(error)
        }
    }

    
    const [visiblePosts, setVisiblePosts] = useState(3);

    useEffect(() => {
        fetchSuggetstionPost(); 
    }, []);

    const handleError = () => {
        Swal.fire(
            {
                'title': "OPPS...",
                'icon': "error",
                'text': "Something Went Wrong",
            }
        );
    }

  
    function handleLoadMore() {
        setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 3);
    }

    return (
        <div>   
            <div className='mt-[200px]'>


                <button
                    className='w-[500px] p-2 border-0 shadow-md input rounded-full mr-3 font-mono focus:ring-0 focus:border-0 outline-none inpp text-xl text-white ml-[470px]'
                >
                    Posts You Like 
                </button>


                <div className='mt-5 ml-[310px] flex flex-wrap max-h-[450px]' style={{ overflowX: 'hidden' }}>
                    {posts && posts.length > 0 ? (
                        posts.slice(0, visiblePosts).map((post, index) => (
                            <div className='cont2 mb-[50px]' key={index}>
                                <div>
                                    <img src={doctor} height={1} width={70} className='doc ml-4 mt-[10px]' />
                                </div>
                                <div>
                                    <p className='font-mono font-weight-bold text-xl ml-[120px] mt-[-40px]'>
                                        DR.{post.doctor_name}
                                    </p>

                                </div>
                                <div className='flex flex-wrap font-mono text-sm mt-4 ml-5 mr-1'>
                                    <p className=''> {post.description} </p>

                                </div>
                                <div>
                                    <div className='cont3 mt-3 ml-3'>
                                        {post.path != null ? (
                                            <video src={`${completePath}${post.path}`} controls className='video' />
                                        ) : (
                                            <img src={novid} alt='Post' className='image mr-auto ml-auto mb-auto mt-[50px]' />
                                        )}
                                    </div>
                                </div>
                                <div className='flex flex-wrap'>
                                    <button className='font-mono ml-[44%] mt-2 text-sm font-weight-bold load'
                                    onClick={() => navigate('/posts')}>
                                        Back 
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='mb-auto mt-auto mr-auto font-mono bold font-weight-bold ml-[350px]'>No posts available</p>
                    )}
                </div>
                {visiblePosts < posts.length && (
                    <button className='load ml-[29.5%] mt-5' onClick={handleLoadMore}>
                        Load More
                    </button>
                )}
            </div>
        </div>
    )
}

export default SuggestVideo
