import React, { useEffect ,useState} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./InfoForVideo.css";
import axiosClient from "../../axios";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
const InfoForVideo = () => {
    
    const doctor = "../assetss/doctoricon.png";
    const [appointment, setAppointment] = useState(null);

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
    return (
        <div className="InfoForVideo">
            <div className="InfoForVideoBody">
                <div className="namePart">
                    <div className="image">
                        <img src={doctor}></img>
                    </div>
                    <div className="name">
                       {localStorage.getItem("user-type")=="doctor"?"DR. ":""}{localStorage.getItem("user-name")}
                    </div>
                </div>
                <div className="rulesPart">
                    <div className="ruleTitle">Rules:</div>
                    <div className="rules">
                        <div>
                            - You must share the session link with only one
                            patient.{" "}
                        </div>
                        <div>
                            - The session link is activated only once to
                            maintain security.
                        </div>
                        <div>
                            - If the page is updated or refreshed , the session
                            link will be canceled and you must create another
                            session.
                        </div>
                    </div>
                    <div className="rulesButton">
                        <button onClick={AgreePage}>Continue</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoForVideo;
