import React, { useRef, useState } from 'react';
import axiosClient from '../../axios';

//css
import './UploadDocument.css';
import Swal from 'sweetalert2'

export default function UploadDocument() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSentMessage, setSentMessage] = useState(false);
  const triggerItem = useRef(null);
  const upload = '../assetss/upload-file.png';
  const avatar = '../assetss/avatar.png';
  const medalia = '../assetss/medaliaicon.png';
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    //setShowSuccessMessage(true);
    handleCompleteAlert(); 
    console.log('Selected file:', file.name);
  };

  const handleCancelAlert = () =>
  {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Try To Upload Another File",
    });
  }

  const handleCancel = () => {
    setSelectedFile(null);
    setShowSuccessMessage(false);
    handleCancelAlert();
    fileInputRef.current.value = null;
  };

  const handleErrorAlert = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!"
    });
  }

  const handleCompleteAlert = () => {
    Swal.fire({
      title: "Good Job!",
      text: "To complete uploading press on submit",
      icon: "question",
    });
  }

  const handleSuccessAlert = () =>
  {
    Swal.fire({
      title: "Good job!",
      text: "You Uploaded The File Successfully Wait To Accept it!",
      icon: "success"
    });
  }

  const handleSubmit = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const doctorId = localStorage.getItem('user-id');
      axiosClient
        .post(`/verfiy/${doctorId}`, formData)
        .then((response) => {
          console.log('API response:', response);
          handleSuccessAlert();
          setSentMessage(false);
          setTimeout(() => {
            setSentMessage(false);
          }, 3000);
          resetForm();
        })
        .catch((error) => {
          console.log(error)
          handleErrorAlert();
          console.error('API error:', error);
        });
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setShowSuccessMessage(false);
    fileInputRef.current.value = null;
  };

  return (
    <div className='UploadDocument'>
      <div className='u w-screen flex mt-[10%]'>
        <div className='w-[10%]'></div>
        <span className='w-[30%] pl-3'>
          <div className='flex'>
            <img className='ml-[-10%]' src={avatar} width={90} alt='Avatar' />
            <p className='ml-3 mt-4'> Note:</p>
            <img src={medalia} className='verfiyIcon ml-[250px] mt-4' />
          </div>
          <div className='opacity-90'>
            If you want to make your account more reliable and objective and have a greater chance of reaching more cases and spreading your articles among users, you must verify your account by inserting your certificate here
          </div>
          <p className='mt-3 ml-3 mb-3 opacity-75'>Sandra Team</p>
        </span>

        <div className='w-[10%]'></div>

        <div className='mainForm'>
          <p className='mb-[-9%]'>Upload File Here</p>
          <form className='w-[40%] mt-12'>
            <input
              type='file'
              accept='image/*'
              className='input-field'
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <div className='w-[200px]'>
                {selectedFile.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt={selectedFile.name}
                    className='selected-image'
                  />
                ) : (
                  <p className='selected-file-name'>{selectedFile.name}</p>
                )}
              </div>
            ) : (
              <img
                src={upload}
                alt='Not-Available'
                height={70}
                width={120}
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
              />
            )}
          </form>
          <div className='mt-2 mb-2'>
            <button className='mr-[100px] text-white px-2 py-1 rounded-md BUTTON' onClick={handleSubmit}>
              Submit
            </button>
            <button className='text-white px-2 py-1 rounded-md BUTTON' onClick={handleCancel}>
              Cancel
            </button>
          </div>
          {showSuccessMessage && (
            <div className='success-message' style={{ animation: 'fade-in 0.5s forwards' }}>
              <p>Press Submit Button To complete Verfiy!</p>
            </div>
          )}
          {showSentMessage && (
            <div className='success-message' style={{ animation: 'fade-in 0.5s forwards' }}>
              <p>File Sent Successfully!</p>
            </div>
          )}

        </div>
        <div className='w-[10%]'></div>
      </div>
    </div>
  );
}