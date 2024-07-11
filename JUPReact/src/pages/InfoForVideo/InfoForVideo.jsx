import React, { useEffect ,useState} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./InfoForVideo.css";
import axiosClient from "../../axios";
import { useTranslation } from "react-i18next";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
const InfoForVideo = () => {
    
    const maleDoctor = "../images/maleDoctor.jpg";
    const femaleDoctor = "../images/femaleDoctor.jpg";
    const patient = "../images/MaleUser.jpg";
    const [appointment, setAppointment] = useState(null);
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();
    const doctorID = location.state?.doctorID;
    const patientID = location.state?.patientID;
    useEffect(() => {
        if (doctorID !== null && patientID !== null) {
            appointmentCheck();
            if(appointment==false){
                navigate(`newAppointment/${doctorID}`);
            }
        }
    }, [doctorID, patientID]);
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const appointmentCheck = async () => {
        const formData = new FormData();

        formData.append("patientID", parseInt(patientID));
        formData.append("doctorID", parseInt(doctorID));

        const response = await axiosClient.post(`/haveAppointment`, formData);
        if (response.data.status == 200) {
            setAppointment(response.data.haveAccount);
            console.log(response.data.haveAccount);
        }

    };
    const AgreePage = () => {
        swalWithBootstrapButtons
            .fire({
                title: "Have you read and agree to the rules?",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "Agree",
                cancelButtonText: "No",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Done!", "", "success");
                    navigate("/Session", {
                        state: { doctorID: doctorID, patientID: patientID },
                    });
                } else {
                    Swal.fire(
                        "Not sure!",
                        "You have to accept all the term to make video call",
                        "info"
                    );
                }
            });
    };
    const info=JSON.parse(localStorage.getItem('user-info'));
    return (
        <div className="InfoForVideo">
            <div className="InfoForVideoBody">
                <div className="namePart">
                    <div className="image">
                        {localStorage.getItem("user-type")=="doctor"?info.gender==1?<img src={femaleDoctor}></img>:
                        <img src={maleDoctor}></img>:<img src={patient}></img>}
                    </div>
                    <div className="name">
                       {localStorage.getItem("user-type")=="doctor"?"DR. ":""}{localStorage.getItem("user-name")}
                    </div>
                </div>
                <div className="rulesPart">
                    <div className="ruleTitle">{t('ConfRulesTitle')}</div>
                    <div className="rules">
                        <div>
                        {t('ConfRules1')}
                        </div>
                        <div>
                        {t('ConfRules2')}
                        </div>
                        <div>
                        {t('ConfRules3')}
                            
                        </div>
                        <div>
                        {t('ConfRules4')}
                            
                        </div>
                    </div>
                    <div className="rulesButton">
                        <button onClick={AgreePage}>{t('ConfContinue')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoForVideo;
