import React, { useState } from 'react';
import './SharePost.css';
import uploadImg from '../../../public/assetss/uploadvid.png';
import axiosClient from '../../axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



const SharePost = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [description, setDescription] = useState('');
  const navigate = useNavigate() ;

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    if (value.length <= 150) {
      setDescription(value);
    }
  };

  const handleError = () => {
    Swal.fire(
      {
        'title': "OPPS...",
        'icon': "error",
        'text': "Something went wrong",
      }
    );
  }

   const handleSuccess = (name) => {
    Swal.fire(
      {
        'title': `Great DR ${name}`,
        'icon': "success",
        'text': "The Post Sharing successfully",
      }
    );
   }

  const handleShareButton = () => {
    if (selectedVideo && description && selectedOption) {
      const formData = new FormData();
      formData.append('path', selectedVideo);
      formData.append('description', description);
      formData.append('doctor_id', localStorage.getItem('user-id')); 
      formData.append('category', selectedOption.value);

      axiosClient
        .post('/posts', formData)
        .then(response => {
          console.log(response.data);
          handleSuccess(localStorage.getItem('user-name'));
          setSelectedVideo(null);
          setDescription('');
          setSelectedOption(null);
          navigate('/posts')
        })
        .catch(error => {
          handleError(error)
          console.log(error)
        });
    } else {
      console.log('Please fill in all the required fields.');
    }
  };



  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    setSelectedVideo(file);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: 'depression', label: 'depression' },
    { value: 'anxiety', label: 'anxiety' },
    { value: 'bipolar', label: 'bipolar' },
    { value: 'schizophrenia', label: 'schizophrenia' },
    { value: 'feeding_eating', label: 'feeding_eating' },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div>
      <div className='main mt-[150px] mr-auto ml-auto'>
        <div className='font-mono text-xl font-weight-bold mt-[5%]'>
          <h1>Share Post</h1>
        </div>

        <div className='flex flex-wrap mb-[70px]'>
          <label htmlFor="videoUpload" className="cursor-pointer mt-4 mr-[200px]">

            <div className="h-[200px] w-64 iimg bg-gray-200 flex items-center justify-center">

              {selectedVideo ? (
                <video
                  src={URL.createObjectURL(selectedVideo)}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <>
                  <img
                    src={uploadImg}
                    alt="Upload Icon"
                    className="w-32 h-32"
                  />
                  <p className='font-mono text-[18px] font-weight-bold'>Upload Video</p>
                </>
              )}

            </div>
          </label>
          <input
            id="videoUpload"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoChange}
          />

          <div className='mt-5'>

            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md focus:outline-none"
              onClick={toggleDropdown}
            >
              {selectedOption ? selectedOption.label : 'Select an option'}
              <svg
                className={`w-4 h-[15px] ml- ${isOpen ? 'transform rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 10 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 7.293a1 1 0 0 1 1.414 0L10 9.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"
                />
              </svg>
            </button>
            {isOpen && (
              <ul className="absolute z-10 w-40 py-2 mt-2">
                {options.map((option) => (
                  <li
                    key={option.value}
                    className="px-4 py-2 h-12 mt-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}



          </div>

        </div>

        <div className='mt-[-5%]'>
        <textarea
        className="h-[100px] w-[450px] bg-body-secondary text-xl"
        rows={4}
        placeholder="Add a description..."
        value={description}
        onChange={handleDescriptionChange}
        />
        <p className="text-gray-500 text-right">{150 - description.length} characters remaining</p>
        </div>

        <div>
        <button
        className="h-[50px] w-[100px] py-2 font-mono text-xl btttn text-white rounded mt-[-5.5%] mr-[300px]"
        onClick={handleShareButton}>
        Share
      </button>
        </div>

      </div>
    </div>
  );
};

export default SharePost;