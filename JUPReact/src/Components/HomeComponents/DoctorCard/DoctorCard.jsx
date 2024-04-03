import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//css
import "./DoctorCard.css";
export default function DoctorCard({
    name,
    point,
    id,
    gender,
    speciality,
    like,
}) {
    const navigate = useNavigate();
    const medalia = "../assetss/medaliaicon.png";
    const showDoctorProfile = () => {
        navigate(`/doctorProile/${id}`);
    };
    return (
        <div className="DoctorCard">
            <div className="Information">
                <div className="DoctorInfo">
                    <div className="DoctorImage">
                        <img
                            src={
                                gender == 1
                                    ? "../images/femaleDoctor.jpg"
                                    : "../images/maleDoctor.jpg"
                            }
                        />
                    </div>
                    <div className="DoctorName">
                        {name}
                        <img className="medalia" src={medalia} />
                    </div>
                    <div className="DoctorSpeciality">{speciality}</div>
                    <div className="DoctorRate">
                        <div className="DoctorPoints"> points : {point}</div>
                        <div className="DoctorLikes">likes : {like}</div>
                    </div>

                    <div className="profileButton">
                        <button
                            type="button"
                            onClick={() => showDoctorProfile()}
                        >
                            profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
