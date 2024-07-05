import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";
import { useTranslation } from "react-i18next";

//css
import "./DoctorsPart.css";
import DoctorCard from "../DoctorCard/DoctorCard";
import CircularLoading from "../../loadingprogress/loadingProgress";
import NoData from "../../NoData/NoData";
export default function DoctorsPart() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const {t } = useTranslation();

    useEffect(() => {
        fetchDoctor();
    }, []);

    const fetchDoctor = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post("/best/doctor");
            const data = response.data;
            console.log(response);
            if (data && data.doctors) {
                setDoctors(data.doctors);
            } else {
                console.log("Error fetching data:", error);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    const ShowDoctor = () => {
        navigate("/doctor");
    };
    return (
        <div className="section DoctorsSection">
            <div className="DoctorsTitle">{t('HomeDoctorsTitle')}</div>
            <div className="Doctorstext">
            {t('HomeDoctorsDes')}
            </div>
            <div className="TopDoctors">
                {loading ? (
                    <CircularLoading />
                ) : doctors.length == 0 ? (
                    <NoData content={t('HomeDoctorsNoData')} />
                ) : (
                    <>
                        {doctors.slice(0, 3).map((doctor) => (
                            <DoctorCard
                                name={doctor.user_name}
                                point={doctor.points}
                                id={doctor.id}
                                speciality={
                                    doctor.category !== null
                                        ? doctor.category.name
                                        : ""
                                }
                                gender={doctor.gender ?? 1}
                                like={doctor.likesCount}
                            />
                        ))}
                    </>
                )}
            </div>
            <div className="Doctorsbutton">
                <button type="button" onClick={() => ShowDoctor()}>
                    
                    {t('HomeDoctorsAll')}   
                </button>
            </div>
        </div>
    );
}
