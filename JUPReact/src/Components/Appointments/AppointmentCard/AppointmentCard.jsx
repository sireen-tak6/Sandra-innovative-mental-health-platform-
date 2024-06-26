import React from "react";
import { BsBookmark } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../../axios";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./AppointmentCard.css";
import CircularLoading from "../../loadingprogress/loadingProgress";
import PayForm from "../../Forms/PayForm/PayForm";

const AppointmentCard = ({
    item,
    last,
    first,
    setPatientId,
    setModalOpen,
    formData,
    setFormData,
    setIsLoadingInfo,
    setUserName,
    setAppointment,
    setBanks,
    showPayContainer,
    setShowPayContainer,
    Banks,
    setShowInfo,
}) => {
    const infoPic = "../images/info.svg";
    const BankPic = "../images/BankIcon.svg";

    const userID = localStorage.getItem("user-id");
    const userType = localStorage.getItem("user-type");
    const [date, setdate] = useState(null);
    const [patientbank, setpatientbank] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Day",
    ];
    useEffect(() => {
        if (item.date == "Date") {
            setdate("Date");
        } else {
            const date2 = new Date(item.date);
            setdate(date2);
        }
    }, [item]);

    useEffect(() => {
        if (item.patientID) {
            getInfo();
        }
    }, [item.patientID]);

    const getInfo = async () => {
        setIsLoadingInfo(true);
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        // Use HTML5 form validation (automatic)
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const formData2 = new FormData();

        if (item.patientID) {
            console.log(item.patientID);
            formData2.append("patientID", item.patientID);
        }
        formData2.append("userID", parseInt(userID));
        formData2.append("userType", userType);
        const response = await axiosClient.post("/getInfo", formData2);
        console.log(response);
        if (response.status == 200) {
            console.log(formData);
            setFormData(response.data.Info.data);
            setUserName(item.patient ? item.patient.user_name : "unknown");
            if (userType != "patient") {
                setpatientbank(JSON.parse(response.data.Info.Banks));
            }
            console.log(formData);
        } else {
            swalWithBootstrapButtons.fire(
                response.data.message,
                "Something went wrong",
                "error"
            );
        }
        setIsLoadingInfo(false);
    };
    const openInfos = (item) => {
        setAppointment(item);
        setShowInfo(true);
        console.log(showPayContainer);
    };

    return (
        <Link key={item.id}>
            {date === null ? (
                <div>
                    <CircularLoading />
                </div>
            ) : (
                <div className={`AppointmentCard none `}>
                    <div className="CardInfo">
                        <div className={`name ${first ? "first" : ""}`}>
                            <Link
                                to={
                                    item.patient
                                        ? `/patientProfile/${item.patient.id}`
                                        : null
                                }
                                key={item.patient ? item.patient.id : null}
                            >
                                {item.patient
                                    ? item.patient.user_name
                                    : "unknown"}
                            </Link>
                        </div>
                        <div className={`name ${first ? "first" : ""}`}>
                            {item.doctor ? (
                                <Link
                                    to={
                                        item.doctor.id
                                            ? `/doctorProile/${item.doctor.id}`
                                            : null
                                    }
                                    key={item.doctor.id ? item.doctor.id : null}
                                >
                                    {item.doctor ? item.doctor.user_name : ""}
                                </Link>
                            ) : null}
                        </div>
                        <div className={`time ${first ? "first" : ""}`}>
                            {item.time}
                        </div>
                        <div className={`day ${first ? "first" : ""}`}>
                            {daysOfWeek[item.day]}
                        </div>
                        <div className={`date ${first ? "first" : ""}`}>
                            {date == "Date"
                                ? date
                                : `${date.getDate()} / ${date.getMonth() + 1} /
                            ${date.getFullYear()}`}
                        </div>
                        <div className={`state ${first ? "first" : ""}`}>
                            <div className={item.state}>{item.state}</div>
                        </div>

                        <div className={`duration ${first ? "first" : ""}`}>
                            <div className={item.duration}>
                                {item.duration} {item.timeType}
                            </div>
                        </div>
                        <div className={`cost ${first ? "first" : ""}`}>
                            <div className={item.cost}>{item.cost}</div>
                        </div>
                        <div className={`Type ${first ? "first" : ""}`}>
                            <div className={item.type}>{item.type}</div>
                        </div>
                    </div>
                    <div className="buttons">
                        <div>
                            {first ? (
                                <div
                                    className={`deleteButton ${
                                        first ? "first" : ""
                                    }`}
                                >
                                    Info
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openInfos(item);
                                    }}
                                    type="button"
                                    className={`deleteButton ${
                                        first ? "first" : ""
                                    }`}
                                >
                                    Info
                                </button>
                            ) }
                        </div>
                    </div>
                </div>
            )}
        </Link>
    );
};
export default AppointmentCard;
