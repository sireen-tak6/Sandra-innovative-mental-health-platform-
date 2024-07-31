import React, { useState, useEffect } from 'react';
import './PostsSession.css';
import report from '../../../public/assetss/reporticon.png'
import post2 from '../../../public/assetss/imagepost.png';
import doctor from '../../../public/assetss/doctoricon.png';
import hand from '../../../public/assetss/hand.png';
import axiosClient from "../../axios";
import novid from '../../../public/assetss/noVideoIcon.png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


function PostsSession() {


  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No selected file");
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();
  const [suggestVideo, setSuggestVideo] = useState([]);
  const completePath = 'http://localhost:8000/';
  const [postDoctor, setPostDoctor] = useState([]);
  const [reports, setReports] = useState({});


  const fetchReportCount = async (post_id) => {
    try {
      const response = await axiosClient.get(`/get/post/dlike/${post_id}`);
      const data = response.data;
      setReports(prevReports => ({
        ...prevReports,
        [post_id]: data.report
      }));
    } catch (error) {
      console.log('Error fetching reports:', error);
    }
  };

  useEffect(() => {
    if (postDoctor.length > 0) {
      postDoctor.forEach(post => {
        fetchReportCount(post.id);
      });
    }
  }, [postDoctor]);

  const fetchData = async () => {
    if (localStorage.getItem('user-type') == 'doctor') {
      try {
        const response = await axiosClient.get('/get/posts');
        const data = response.data;
        setPosts(data.posts);
        console.log(response)
        console.log(posts.path)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    else {
      fetch('http://localhost:5000/api/get/posts')
        .then(response => response.json())
        .then(data => {
          const sortedPosts = data.posts;
          setPosts(sortedPosts);
        })
        .catch(error => {
          console.error('Error:', error);
        });

    }
  };

  const deletePost = async (postId) => {
    try {
      const confirmDelete = await Swal.fire({
        title: 'Confirmation',
        text: 'Are you sure you want to delete this post?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      });

      if (confirmDelete.isConfirmed) {
        await axiosClient.get(`/delete/post/${postId}`);
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        Swal.fire({
          title: 'Success',
          text: 'Post deleted successfully',
          icon: 'success',
        });
        fetchPostByDoctorId();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to delete post',
        icon: 'error',
      });
    }
  };

  const fetchSuggetstionPost = async () => {
    try {
      const response = await axiosClient.get(
        `/get/suggestion/post/${localStorage.getItem('user-id')}`);
      const data = response.data;
      setSuggestVideo(data.posts)
    }
    catch (error) {
      console.log("error fetching suggestion video", error);
      handleError(error)
    }
  }

  const fetchPostByDoctorId = async () => {
    try {
      const response = await axiosClient.get(`/doctor/post/${localStorage.getItem('user-id')}`);
      const data = response.data;
      setPostDoctor(data.posts);
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchSuggetstionPost();
    fetchPostByDoctorId();
  }, []);

  const fetchLikeCount = async (post_id) => {
    try {
      const response = await axiosClient.get(`/get/post/like/${post_id}`);
      const data = response.data;
      setLikes(prevLikes => ({
        ...prevLikes,
        [post_id]: data.likes
      }));
    } catch (error) {
      console.log('Error fetching likes:', error);
    }
  };



  useEffect(() => {
    if (posts.length > 0) {
      const visiblePostsSlice = posts.slice(0, visiblePosts);
      visiblePostsSlice.forEach(post => {
        fetchLikeCount(post.id);
      });
    }
  }, [posts, visiblePosts]);



  const handleDlikeButtonClick = async (post_id) => {
    try {
      if (localStorage.getItem('user-type') === 'patient') {
        const patientId = localStorage.getItem('user-id')
        await axiosClient.post(`/add/post/dlike/${post_id}/${patientId}`);
      }
      else {
        handleErrorDoctor()
      }

    } catch (error) {
      handleErrorDoctor();
    }
  };




  const handleLikeButtonClick = async (post_id) => {
    try {
      if (localStorage.getItem('user-type') === 'patient') {
        const patientId = localStorage.getItem('user-id')
        await axiosClient.post(`/add/post/like/${post_id}/${patientId}`);
      }
      else {
        handleErrorDoctor()
      }
      fetchLikeCount(post_id);
    } catch (error) {
      handleErrorDoctor();
    }
  };

  const handleErrorDoctor = () => {
    Swal.fire(
      {
        'title': "OPPS...",
        'icon': "error",
        'text': "You are not allowed to rate the video",
      }
    );
  }


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

  const handleSeeItClick = (postCategory) => {
    localStorage.setItem('post-category', postCategory);
    navigate('/see/post');
  };


  return (
    <div className='w-screen flex postsession'>


      <div className='mt-[50px] w-[75%]'>
        {localStorage.getItem('user-type') === 'doctor' ?
          <div className='mt-5 ml-[14%] cont'>
            <button onClick={() => navigate('/share/post')}>
              <img src={post2} height={1} width={45} className='post2 mr-3' />
            </button>
            <button
              className='w-[75%] p-2 border-0 shadow-md input rounded-full mr-3 font-mono focus:ring-0 focus:border-0 outline-none inpp text-xl text-white'
              onClick={() => navigate('/share/post')}
            >
              Sharing Post
            </button>
          </div>
          :
          <div className='mt-5 ml-[14%] cont'>
            <button onClick={() => navigate('/suggest/videos')}>
              <img src={post2} height={1} width={45} className='post2 mr-3' />
            </button>
            <button
              className='w-[75%] p-2 border-0 shadow-md input rounded-full mr-3 font-mono focus:ring-0 focus:border-0 outline-none inpp text-xl text-white'
              onClick={() => navigate('/suggest/videos')}
            >
              Suggestion
            </button>
          </div>
        }

        <div className='mt-5 ml-[5%] flex flex-wrap max-h-[450px]' style={{ overflowX: 'hidden' }}>
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
                      <video controls
                        src={`${completePath}${post.path}`}
                        className='video' />
                    ) : (
                      <img src={novid} alt='Post' className='pimage mr-auto ml-auto mb-auto mt-[50px]' />
                    )}
                  </div>
                </div>
                <div className='flex flex-wrap'>
                  <img
                    src={hand}
                    height={1}
                    width={30}
                    className='ml-[46%] mt-2.5'
                    onClick={() => handleLikeButtonClick(post.id)}
                  />
                  <p className='font-mono ml-2 mt-4 text-sm font-weight-bold'>
                    {likes[post.id] !== undefined ? likes[post.id] : 'Like'}
                  </p>
                  <img src={report} width={30} className='mt-2 ml-4'
                    onClick={() => handleDlikeButtonClick(post.id)} />
                </div>
              </div>
            ))
          ) : (
            <p className='m-auto font-mono bold font-weight-bold'>No posts available</p>
          )}
        </div>
        {visiblePosts < posts.length && (
          <button className='load ml-[29.5%] mt-5' onClick={handleLoadMore}>
            Load More
          </button>
        )}
      </div>


      <div className='mt-[14%] w-[30%]'>
        <div className='ml-5'>
          {localStorage.getItem('user-type') == 'patient' ?
            <button className='font-mono text-xl forYou'>For You {localStorage.getItem('user-name')}</button>
            :
            <button className='font-mono text-xl forYou2'>Post You Shared {localStorage.getItem('user-name')}</button>
          }
        </div>
        <div className='mt-1'>
          {localStorage.getItem('user-type') == 'patient' ?
            <ul className='max-h-[450px]' style={{ overflowX: 'hidden' }}>
              {localStorage.getItem('user-type') === 'patient' &&
                suggestVideo.map((post, index) => (
                  <li className='ml-5 mt-4 flex' key={index}>
                    {post.path != null ?
                      <video src={`${completePath}${post.path}`} controls className='w-[50%] vidd' />
                      :
                      <p>No Post available</p>
                    }
                    <div>
                      <p className='ml-[20px] mt-[20px]'>{post.category}</p>
                      {/*when i press here */}
                      <button
                        className='load2 mt-3 ml-3'
                        onClick={() => handleSeeItClick(post.category)}
                      >See It</button>
                    </div>
                  </li>
                ))}
            </ul>
            :
            <ul className='max-h-[450px]' style={{ overflowX: 'hidden' }}>

              {localStorage.getItem('user-type') == 'doctor' &&
                postDoctor.map((post, index) => (
                  <li className='ml-1 mt-4 flex w-[350px] h-[150px]' key={index}>
                    <video src={`${completePath}${post.path}`} controls className='w-[50%] h-full vidd' />
                    <div className='w-[50%]'>
                      <p className='ml-[24px] mt-3'>{post.category}</p>
                      <div className='flex flex-wrap ml-4'>
                        <img src={hand} height={1} width={30} className='mt-2' />

                        <p className='font-mono text-sm mt-4 ml-2'>{likes[post.id] !== undefined ? likes[post.id] : 0}</p>
                        <img src={report} height={1} width={25} className='mt-2 ml-4' />
                        <p className='font-mono text-sm mt-4 ml-2'>
                          {reports[post.id] !== undefined ? reports[post.id] : 0}
                        </p>
                      </div>

                      <button
                        className='button mt-3 ml-10 w-20 h-[35px] dbutton'
                        onClick={() => deletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          }
        </div>
      </div>
    </div>
  );
}

export default PostsSession;
