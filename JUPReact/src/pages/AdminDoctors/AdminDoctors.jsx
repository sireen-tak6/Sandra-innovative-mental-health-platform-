import React, { useState, useEffect } from 'react';
import axiosClient from '../../axios';

//css
import './AdminDoctors.css';
import Swal from 'sweetalert2';

export default function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [likes, setLikes] = useState([]);
    const [resportCount, setReportCount] = useState(0);
    const [sure, setSure] = useState(false);
    const adminicon = "../assetss/adminicon.png";
    const emailicon = "../assetss/email.png";
    const doctorss = "../assetss/doctorteam.png";
    const like = "../assetss/heart.png";
    const report = "../assetss/reporticon.png";
    const doc = "../assetss/doctoricon.png";
    const ourLogo = "../assetss/sandralogo.png";
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axiosClient.get('/show/doctor');
            setDoctors(response.data.doctors);
            DoctorLikes(response.data.doctors.map(doctor => doctor.id)); // Call DoctorLikes to fetch and update likes
        } catch (error) {
            console.log(error);
        }
    };

    const name = localStorage.getItem('user-name');
    const email = localStorage.getItem('email');

    const handleDeleteDoctorAlert = (doctorId) => {
        Swal.fire({
            title: "Do you want to delete this doctor?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            denyButtonText: "No",
        }).then((result) => {
            setSure(false);
            if (result.isConfirmed) {
                Swal.fire("Done!", "", "success");
                handleDeleteDoctor(doctorId);
            } else if (result.isDenied) {
                Swal.fire("give him another chance", "", "info");
                setSure(false);
            }
        });
    }

    const handleDeleteDoctor = async (doctorId) => {
        try {
            await axiosClient.delete(`/delete/doctor/${doctorId}`);
            fetchDoctors(); // Fetch doctors again to update the list
        } catch (error) {
            console.log(error);
        }
    };

    //section here for display the doctor likes 
    const DoctorLikes = async (doctorIds) => {
        try {
            const updatedLikes = {};

            for (let i = 0; i < doctorIds.length; i++) {
                const doctorId = doctorIds[i];
                const response = await axiosClient.post(`show/likes/${doctorId}`);
                const data = response.data;

                if (data && data.likes !== undefined) {
                    const likeCount = data.likes;
                    updatedLikes[doctorId] = likeCount;
                } else {
                    updatedLikes[doctorId] = 0; // Set default like count to 0 if data is missing
                }
            }

            setLikes(updatedLikes);
        } catch (error) {
            console.error('Error fetching Likes:', error);
        }
    };


    return (
        <div className='AdminDoctors'>
            <div className='mainform ml-[11%] mt-5'>
                <span className='drc mt-4'>Doctors Control</span>
                <div className='secondform w-[90%] flex mt-9'>
                    <div className='admininfo w-[30%]'>
                        <div className='flex'>
                            <img src={adminicon} width={50} />
                            <admininfo className='mt-4 ml-4'>Admin Information</admininfo>
                        </div>
                        <p className='mt-3'>
                            <br></br>
                            <div className='item'> Admin : {name} </div>
                            <br></br>
                            <div className='item flex'>
                                <img src={emailicon} width={50} />
                                <p className='mt-2 ml-1'> : {email}</p>
                            </div>
                            <br></br>
                            <div className='item'>Specialized : need to real doctor</div>
                        </p>
                        <div className='flex mt-[115px]'>
                            <p className='mt-3'>
                                Sandra Admin {localStorage.getItem('user-name')}
                            </p>
                            <img className='sandralogo' src={ourLogo} width={50}></img>
                        </div>
                    </div>

                    <div className='w-[20%]'>
                        <img className='doctors ml-[30px]' width={150} src={doctorss}></img>
                    </div>

                    <div className='w-[50%] ml-2 mb-6'>
                        <ul className='max-h-[410px] lists' style={{ overflowX: 'hidden' }}>
                            {doctors.map((doctor) => (
                                <li className='items mt-3 mb-7 mr-2' key={doctor.id}>
                                    <img src={doc} width={20} className='ml-2 mt-1 mr-2 doc'></img>
                                    <div className='mt-1 w-[20%]'>{doctor.user_name}</div>
                                    <img src={like} width={20} className='ml-4 mt-1'></img>
                                    <div className='mt-1 ml-2'>{likes[doctor.id] || 0}</div>
                                    <img src={report} width={20} className='ml-4 mt-1'></img>
                                    <div className='mt-1 ml-2'>{resportCount}</div>
                                    <button
                                        className='ml-auto mr-2 w-[20%] button'
                                        onClick={() => handleDeleteDoctorAlert(doctor.id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}