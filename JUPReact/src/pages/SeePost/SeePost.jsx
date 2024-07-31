import React, { useState, useEffect } from 'react';
import './SeePost.css';
import { useNavigate } from 'react-router-dom';
import hand from '../../../public/assetss/hand.png';
import report from '../../../public/assetss/reporticon.png';
import axiosClient from '../../axios';

function SeePost() {
  const navigate = useNavigate();
  const [post, setPost] = useState([]);
  const completePath = 'http://localhost:8000/';
  const [likes, setLikes] = useState({});
  const [reports, setReports] = useState({});

  const fetchPost = async () => {
    try {
      const response = await axiosClient.get(
        `/get/post/by/category/${localStorage.getItem('post-category')}`
      );
      const data = response.data;
      setPost(data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReportCount = async (post_id) => {
    try {
      const response = await axiosClient.get(`/get/post/dlike/${post_id}`);
      const data = response.data;
      setReports((prevReports) => ({
        ...prevReports,
        [post_id]: data.report,
      }));
    } catch (error) {
      console.log('Error fetching reports:', error);
    }
  };


  const fetchLikeCount = async (post_id) => {
    try {
      const response = await axiosClient.get(`/get/post/like/${post_id}`);
      const data = response.data;
      setLikes((prevLikes) => ({
        ...prevLikes,
        [post_id]: data.likes,
      }));
    } catch (error) {
      console.log('Error fetching likes:', error);
    }
  };

  useEffect(() => {
    post.forEach((pos) => {
      fetchLikeCount(pos.id);
      fetchReportCount(pos.id);
    });
  }, [post]);

  useEffect(() => {
    fetchPost();
  }, []);

  const handleTypeSelection = (type) => {
    localStorage.setItem('post-category', type);
    fetchPost();
  };

  const handleLikeButtonClick = async (post_id) => {
    try {
      if (localStorage.getItem('user-type') === 'patient') {
        const patientId = localStorage.getItem('user-id');
        await axiosClient.post(`/add/post/like/${post_id}/${patientId}`);
      } else {
        handleErrorDoctor();
      }
      fetchLikeCount(post_id);
    } catch (error) {
      handleErrorDoctor();
    }
  };

  const handleDlikeButtonClick = async (post_id) => {
    try {
      if (localStorage.getItem('user-type') === 'patient') {
        const patientId = localStorage.getItem('user-id');
        await axiosClient.post(`/add/post/dlike/${post_id}/${patientId}`);
      } else {
        handleErrorDoctor();
      }
      fetchReportCount(post_id);
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

  return (
    <div className="flex flex-wrap mt-[140px] ml-[7%]">
      <div className="cont22 mt-[100px] ml-[-50px]">
        <ul>
          <li className="cont2222">
            <p className="font-mono text-xl text-center">Choose Type of Post</p>
          </li>
          <li className="cont222" onClick={() => handleTypeSelection('depression')}>
            <p className="font-mono text-xl text-center">depression</p>
          </li>
          <li className="cont222" onClick={() => handleTypeSelection('anxiety')}>
            <p className="font-mono text-xl text-center">anxiety</p>
          </li>
          <li className="cont222" onClick={() => handleTypeSelection('feeding_eating')}>
            <p className="font-mono text-xl text-center">feeding_eating</p>
          </li>
          <li className="cont222" onClick={() => handleTypeSelection('bipolar')}>
            <p className="font-mono text-xl text-center">bipolar</p>
          </li>
          <li className="cont222" onClick={() => handleTypeSelection('schizophrenia')}>
            <p className="font-mono text-xl text-center">schizophrenia</p>
          </li>
        </ul>
      </div>
      <div className="ml-[170px]">
        <button
          className="contt ml-[30px] p-2 border-0 shadow-md input rounded-full mr-3 font-mono focus:ring-0 focus:border-0 outline-none inpp text-xl text-white"
          onClick={() => navigate('/posts')}
        >
          Back To The Post Session
        </button>
        <button className="conttt ml-[34%] p-2 border-0 shadow-md input rounded-full mr-3 font-mono focus:ring-0 focus:border-0 outline-none inpp text-xl text-white mt-3">
          Post You Might Like
        </button>
        <div className="mt-4 " style={{ overflowX: 'hidden' }}>
          <ul className="max-h-[400px]" style={{ overflowX: 'hidden' }}>
            {post.length === 0 ? (
              <li className="cont23 flex flex-row">
                <p className="font-mono text-2xl m-auto font-weight-bold text-secondary">No post available</p>
              </li>
            ) : (
              post.map((pos) => (
                <li className="cont23 flex flex-row mb-4" key={pos.id}>
                  <video src= {pos.path} controls className="viddeo"></video>
                  <div>
                    <p className="mt-5 ml-5 font-mono text-xl">Description</p>
                    <p className="font-mono text-md mt-4 ml-3 mr-1">{pos.description}</p>
                    <div className="flex flex-wrap mt-[180px] pl-[100px]">
                      <img
                        src={hand}
                        className="ml-5 cursor-pointer " width={30} height={1}
                        onClick={() => handleLikeButtonClick(pos.id)}
                      />
                      <p className="font-mono text-md mt-3 ml-2">
                        {likes[pos.id] ? likes[pos.id] : 0}
                      </p>
                      <img className="ml-5 cursor-pointer" src={report} width={30} height={1}
                        onClick={() => handleDlikeButtonClick(pos.id)} />
                      <p className="font-mono text-md mt-3 ml-2">
                        {reports[pos.id] ? reports[pos.id] : 0}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SeePost;