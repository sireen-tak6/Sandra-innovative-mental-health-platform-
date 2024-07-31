import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import axiosClient from '../../axios';
import './AdminPost.css'
import admin from '../../../public/assetss/adminicon.png';
import doctor from '../../../public/assetss/doctoricon.png';
import report from '../../../public/assetss/reporticon.png';
import hand from '../../../public/assetss/hand.png';
import per from '../../../public/assetss/per.jpg';

function AdminPost() {

    const [posts, setPosts] = useState([]);
    const completePath = 'http://localhost:8000/';
    const [visiblePosts, setVisiblePosts] = useState(3);
    const [sure, setSure] = useState(false);


    useEffect(
        () => {
            fetchPosts()
        }, []
    );

    const fetchPosts = async () => {
        try {
            const response = await axiosClient.get('/get/posts');
            const data = response.data;
            setPosts(data.posts);
        }
        catch (error) {
            handleError()
            console.log(error);
        }
    }

    const handleDeletePost = async (postId) => {
        try {
            await axiosClient.get(`/delete/post/${postId}`);
            fetchPosts()
        } catch (error) {
            console.log(error);
        }
    };

    function handleLoadMore() {
        setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 3);
    }

    const handleError = () => {
        Swal.fire(
            {
                title: "Error",
                text: "Something went wrong",
                icon: "error",

            }
        );
    }

    const handleDeletePostAlert = (postId) => {
        Swal.fire({
            title: "Do you want to delete this post?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            denyButtonText: "No",
        }).then((result) => {
            setSure(false);
            if (result.isConfirmed) {
                Swal.fire("Done!", "", "success");
                handleDeletePost(postId);
            } else if (result.isDenied) {
                Swal.fire("give him another chance", "", "info");
                setSure(false);
            }
        });
    }


    return (
        <div className='boo w-screen flex mt-[10%] pl-[7%]'>
            <div className='w-[25%] flex first'>
                <div className='infoForAdmin font-mono'>
                    <div className='mt-3 pl-3'>
                        <img height={20} width={20} src={admin} />
                        Dear {localStorage.getItem('user-name')}
                    </div>
                    <div className='mt-4 pl-3'>
                        You must delete any post that contains more than 75% reports.
                    </div>
                </div>
            </div>
            {/*just for divide*/}
            <div className='w-[10%]'></div>

            <div className='flex flex-wrap w-[60%] max-h-[600px]' style={{ overflowX: 'hidden' }}>
                {posts && posts.length > 0 ? (
                    posts.slice(0, visiblePosts).map((post, index) => (
                        <div className=' flex flex-wrap second' key={index}>
                            <div className='postInfo flex mb-5 '>
                                {/*for videos*/}
                                <video controls src={`${completePath}${post.path}`} className='vid' />
                                {/*Another Info*/}
                                <div className='w-[50%]'>
                                    {/*for doctor name*/}
                                    <div className='font-mono text-md mt-3 pl-3 doctorInfo'>
                                        <img src={doctor} height={2} width={30} className='img'></img>
                                        <div className='pl-[60px] mt-[-22px]'>Shared By : {post.doctor_name} </div>
                                    </div>
                                    <br></br>
                                    <div className='font-mono pl-3 mt-3 flex flex-wrap'>
                                        <div className=''>
                                            <img src={report} height={2} width={50} className='pl-3'></img>
                                            <div className='pl-[60px] mt-[-20px]'>{post.report}</div>
                                        </div>
                                        <div className='pl-[80px]'>
                                            <img src={hand} height={2} width={50} className='pl-3'></img>
                                            <div className='pl-[60px] mt-[-20px]'>{post.like}</div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className='font-mono pl-[90px] mt-1 flex flex-wrap per'>
                                        <img src={per} height={20} width={80} className='img'></img>
                                        <div className='mt-[20px] pl-3'>{((post.report) / (post.like + post.report)) * 100}%</div>
                                    </div>
                                    <div className='font-mono pl-[27%] mt-[30px] del'>
                                        <button className='btnnn text-xl'
                                        onClick={() => handleDeletePostAlert(post.id)}
                                        >Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))) : (
                    <div className='font-mono text-xl font-weight-bold mt-[200px] pl-[200px]'> No Post Available Yet .</div>
                )}

                {visiblePosts < posts.length && (
                    <button className='load ml-[29.5%] mt-5' onClick={handleLoadMore}>
                        Load More
                    </button>
                )}

            </div>





            {/*just for divide*/}
            <div className='w-[5%]'></div>
        </div>
    )
}

export default AdminPost
