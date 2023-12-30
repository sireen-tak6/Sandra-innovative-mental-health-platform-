import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../axios";

//css
import "./User.css";

export default function User() {
    //images
    const doctorImg = "../assetss/doctoricon.png";
    const crown = "../assetss/crown.png";
    const email = "../assetss/email.png";
    const vid = "../assets/intro.mp4";

    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);

    const fetchDoctor = async () => {
        try {
            const response = await axiosClient.post("/best/doctor");
            const data = response.data;

            if (data && data.doctors) {
                setDoctors(data.doctors);
            } else {
                console.log("Error fetching data:", error);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("user-info")) {
            navigate("/login");
        } else {
            fetchDoctor();
        }
    }, []);

    const goToDoctors = () => {
        navigate("/doctor");
    };

    return (
        <div className="user">
            <div className="h-screen whole" style={{ overflowX: "hidden" }}>
                <div class="w-full ml-auto flex flex-wrap mt-[100px]">
                    {/*this section for animation and paragraph written */}
                    <section className="mr-auto w-[30%] text-center mt-[11.5%]">
                        <button
                            className="doctor rounded-2 h-[25%] w-[40%] border-3 text-light"
                            onClick={goToDoctors}
                        >
                            Doctors
                        </button>
                    </section>

                    {/*this section for the cards of best three doctors */}
                    <section className="w-[65%] ml-auto">
                        <div className="text-center best cursor-pointer text-dark-emphasis ml-[273px]">
                            Best Doctors
                        </div>

                        {/*here i want to show best three doctors*/}
                        <ul className="flex space-x-[20px] m-2 p-2">
                            {doctors && doctors.length > 0 ? (
                                doctors.map((doctor) => {
                                    return (
                                        <li key={doctor.id}>
                                            <div>
                                                <div className="w-60 p-2 rounded-4 car">
                                                    <img
                                                        src={doctorImg}
                                                        className="w-[50%] m-auto text-center object-fit-cover rounded-full border border-secondary border-3 border-info"
                                                    ></img>
                                                    <div className="text-center text-black mt-2">
                                                        Dr.{doctor.user_name}
                                                    </div>
                                                    <div className="flex mt-3 mb-3">
                                                        <div className=" mr-auto text-black">
                                                            {doctor.email}
                                                        </div>
                                                        <div className="ml-auto ">
                                                            <img
                                                                src={email}
                                                                alt="mail"
                                                                height={40}
                                                                width={40}
                                                                className="ml-auto e-mail"
                                                            />
                                                        </div>
                                                    </div>
                                                    <img
                                                        src={crown}
                                                        alt="crown"
                                                        height={40}
                                                        width={40}
                                                        className="m-auto"
                                                    />
                                                    <div className="text-center  mt-2">
                                                        <button className="profile rounded-2 h-[25%] w-[50%] border-3 text-light">
                                                            Profile
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <li>
                                    <div>
                                        <div className="w-60 p-2 rounded-4 car">
                                            <img
                                                src={doctorImg}
                                                className="w-[50%] m-auto text-center object-fit-cover rounded-full border border-secondary border-3 border-info"
                                            ></img>
                                            <div className="text-center mt-2">
                                                Doctor Name
                                            </div>
                                            <div className="flex mt-3 mb-3">
                                                <div className=" mr-auto text-black">
                                                    Doctor Email
                                                </div>
                                                <div className="ml-auto text-primary">
                                                    <FontAwesomeIcon
                                                        className="email"
                                                        icon={faEnvelope}
                                                    ></FontAwesomeIcon>
                                                </div>
                                            </div>
                                            <img
                                                src={crown}
                                                alt="crown"
                                                width={40}
                                                className="ml-[40%]"
                                            />
                                            <div className="text-center  mt-2">
                                                <button className="profile rounded-2 h-[25%] w-[50%] border-3 text-light">
                                                    Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </section>
                </div>
                <div className="mb-[100px] ml-[28%] vv">
                    <video
                        src={vid}
                        controls
                        autoPlay
                        loop
                        type="video/mp4"
                        className="video"
                    />
                </div>
            </div>
        </div>
    );
}
