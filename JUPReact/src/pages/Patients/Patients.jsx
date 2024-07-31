import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../axios";

//css
import "./Patients.css";
import Swal from "sweetalert2";

export default function Patients() {
    const patientImg = "../images/MaleUser.jpg";
    const FpatientImg = "../images/FemaleUser.jpg";

    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [visiblePatients, setVisiblePatients] = useState(8);
    const userType = localStorage.getItem("user-type");
    const userId = localStorage.getItem("user-id");

    useEffect(() => {
        if (!localStorage.getItem("user-info")) {
            navigate("/login");
        } else {
            fetchPatients();
        }
    }, [navigate]);
    const handleError = () => {
        Swal.fire({
            title: "OPPS...",
            icon: "error",
            text: "Something went wrong",
        });
    };

    const fetchPatients = async () => {
        try {
            const response = await axiosClient.get("/get/patients");
            console.log(response);
            const data = response.data;
            setPatients(data.patients);
            console.log(data);
            const patientIds = data.patients.map((patient) => patient.id);
        } catch (error) {
            console.log(error);
            console.error("Error fetching patiens:", error);
            handleError();
        }
    };
    //section here for open chat with patient
    const openChatWithPatient = async (patientId) => {
        try {
            const userId = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type"); // Add this line to get the user type
            const response = await axiosClient.post(
                `/open-chat/${userType}/${userId}/${patientId}`
            );
            const data = response.data;
            // Handle the response data as needed
            console.log(data);
            // Navigate to the chat page
            navigate("/chats");
        } catch (error) {
            console.error("Error opening chat:", error);
            handleError();
        }
    };

    // here section for load more patient
    const showProfile = (id) => {
        navigate(`/patientProfile/${id}`);
    };

    // here section for load more patient
    const loadMorePatients = () => {
        setVisiblePatients((prevVisiblePatients) => prevVisiblePatients + 5);
    };

    return (
        <div className="Patients">
            {/* Cards section */}
            <div className="p-3 mt-5 ml-5">
                <div className="max-h-[480px]" style={{ overflowX: "hidden" }}>
                    <div className="flex flex-wrap -mx-1 mt-0">
                        {patients.slice(0, visiblePatients).map((patient) =>
                            patient.id != userId ? (
                                <div
                                    key={patient.id}
                                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 h-3/5 px-4 pl-1"
                                >
                                    <div className="flex flex-col rounded-xl mt-4 cards p-2">
                                        {/* Image section */}
                                        <div className="flex justify-content-between">
                                            <img
                                                className="object-fit-cover rounded-full border border-secondary border-3 border-info-subtle"
                                                src={patient?.information?.data?.gender=="Female"?FpatientImg:patientImg}
                                                alt=""
                                                height="90"
                                                width="90"
                                            />
                                        </div>
                                        <div className="p-2 patientInfo">
                                            {/* patient Name */}
                                            <div className="font-bold text-black text-lg-center">
                                                {patient.user_name}
                                            </div>
                                        </div>
                                        <div className="buttons">
                                            <div className="m-2">
                                                <button
                                                    className="text-white botton px-2 py-1 rounded-md"
                                                    onClick={() =>
                                                        showProfile(patient.id)
                                                    }
                                                >
                                                    Profile
                                                </button>
                                            </div>
                                            {userType == "doctor" ? (
                                                <div className="m-2">
                                                    <button
                                                        className=" text-white botton px-2 py-1 rounded-md cursor-pointer"
                                                        onClick={() =>
                                                            openChatWithPatient(
                                                                patient.id
                                                            )
                                                        }
                                                    >
                                                        Message{" "}
                                                        <FontAwesomeIcon
                                                            icon={faMessage}
                                                        />
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
                {visiblePatients < patients.length && (
                    <div className="text-center mt-2">
                        <button
                            className="text-white botton px-1 py-1 rounded-md"
                            onClick={loadMorePatients}
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
