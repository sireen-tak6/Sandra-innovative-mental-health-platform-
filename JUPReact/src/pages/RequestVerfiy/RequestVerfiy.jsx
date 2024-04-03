import React, { useEffect, useState } from "react";
import axiosClient from "../../axios";

//css
import Swal from "sweetalert2";
import "./RequestVerfiy.css";

export default function RequestVerfiy() {
    const [doctorsInfo, setDoctorsInfo] = useState([]);
    const admin = "../assetss/adminicon.png";
    const doctorss = "../assetss/doctoricon.png";
    const medalia = "../assetss/medaliaicon.png";
    const Filee = "../assetss/upload-file.png";
    const sad = "../assetss/sadface.png";
    const sandralogo = "../assetss/sandralogo.png";
    useEffect(() => {
        // Fetch the doctors' information and images from the API
        fetchDoctorsInfo();
    }, []);

    const fetchDoctorsInfo = async () => {
        try {
            const response = await axiosClient.get("/admin/file-info");
            console.log(response);
            const { doctors } = response.data;
            const data = response.data;
            setDoctorsInfo(
                doctors.map((doctor) => ({
                    ...doctor,
                }))
            );
        } catch (error) {
            handleErrorShow();
            console.log(error);
        }
    };

    const handleCompleteSuccessfully = () => {
        Swal.fire({
            title: "Completed",
            text: "Thanks for your time admin sandra",
            icon: "success",
        });
    };

    const AcceptOrRejectDoctorRequest = async (doctorId, action) => {
        try {
            await axiosClient.post(`/AcceptOrReject/${doctorId}`, {
                action: action,
            });
            
            handleCompleteSuccessfully();
        } catch (error) {
            handleErrorShow();
        }
    };

    const handleShowImage = (doctor) => {
        Swal.fire({
            icon: "warning",
            imageUrl: `http://localhost:8000/${doctor.Document}`,
            imageHeight: "300px",
            imageWidth: "400px",
        });
    };

    const handleErrorShow = () => {
        Swal.fire({
            icon: "Error",
            title: "OPPS..",
            text: "Something went wrong",
        });
    };

    const handleImageError = (doctorId) => {
        console.log(`Image failed to load for doctor with ID: ${doctorId}`);
    };

    return (
        <div className="RequestVerfiy">
            <div className="main mt-[30px] ml-[11%]">
                <span className="drc mt-4">Verify Request</span>
                <div className="w-[90%]">
                    <div className="w-[20%]">
                        <div className="flex mt-9 ">
                            <img src={admin} width={40} alt="Admin Icon" />
                            <p className="mt-[60px] mt-8 ml-7 flex adminsection">
                                {localStorage.getItem("user-name")}
                            </p>
                        </div>
                    </div>

                    <div className="w-[80%] mt-[-25px]">
                        {doctorsInfo.length === 0 ? (
                            <div className="ml-[60%] mt-[8%]">
                                <img
                                    className="mb-2 ml-[19%]"
                                    src={sad}
                                    alt="sad-icon"
                                    style={{ width: "70px", height: "70px" }}
                                />
                                <p className="messagee mr-[40%] text-lg">
                                    <span className="text-xl">Opps..</span>No
                                    requests
                                </p>
                            </div>
                        ) : (
                            <ul
                                className="h-[370px] w-[130%]"
                                style={{ overflowX: "hidden" }}
                            >
                                {doctorsInfo.map((doctor) => (
                                    <li
                                        key={doctor.id}
                                        className="itemm mb-12 h-[150px] flex items-center ml-[230px]"
                                    >
                                        <div>
                                            <img
                                                src={doctorss}
                                                className="doctorRequest"
                                                alt="Doctor Icon"
                                            />
                                        </div>
                                        <img
                                            src={medalia}
                                            className="medaliaicon ml-[-33px] mb-[90px]"
                                            alt="Medalia Icon"
                                        />
                                        <div className="ml-4 verfiyinfo">
                                            <p align="left" className="mb-2">
                                                Name: dr.{doctor.user_name}
                                            </p>
                                            <p align="left" className="mb-2">
                                                Request: verify
                                            </p>
                                        </div>
                                        <div className="ml-[70px]">
                                            <p>See File</p>
                                            {doctor.Document && (
                                                <img
                                                    src={Filee}
                                                    onClick={() => {
                                                        handleShowImage(doctor);
                                                    }}
                                                    className="file cursor-pointer"
                                                    alt="File Icon"
                                                    onError={() =>
                                                        handleImageError(
                                                            doctor.id
                                                        )
                                                    }
                                                />
                                            )}
                                            {!doctor.Document && (
                                                <img
                                                    src={Filee}
                                                    className="file"
                                                    alt="File Icon"
                                                />
                                            )}
                                        </div>
                                        <div className="ml-[70px] flex buttons">
                                            <button
                                                className="mr-12 acceptbutton w-[80px]"
                                                onClick={() => {
                                                    AcceptOrRejectDoctorRequest(
                                                        doctor.id,
                                                        "accept"
                                                    );
                                                }}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="rejectbutton w-[80px]"
                                                onClick={() => {
                                                    AcceptOrRejectDoctorRequest(
                                                        doctor.id,
                                                        "reject"
                                                    );
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="flex mr-[900px] signture">
                    <p className="mt-2">
                        Admin {localStorage.getItem("user-name")}
                    </p>
                    <img src={sandralogo} width={40} alt="Sandra Logo" />
                </div>
            </div>
        </div>
    );
}
