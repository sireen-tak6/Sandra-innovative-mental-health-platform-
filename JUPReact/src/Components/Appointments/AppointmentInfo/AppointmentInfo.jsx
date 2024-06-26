import React, { useRef } from "react";
import { BsBookmark } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../../axios";
import {
    subHours,
    subMinutes,
    parseISO,
    isBefore,
    isAfter,
    formatISO,
} from "date-fns";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./AppointmentInfo.css";
import CircularLoading from "../../loadingprogress/loadingProgress";
import PayForm from "../../Forms/PayForm/PayForm";
import { useNavigate } from "react-router-dom";

const AppointmentInfo = ({
    appointment,
    setShowInfo,
    setPatientId,
    setModalOpen,
    setAppointment,
    setBanks,
    setShowPayContainer,
}) => {
    console.log(appointment.date);
    const date = useRef(null);
    const date2 = new Date(appointment.date);
    date.current = date2;
    console.log(appointment.date);
    const userType = localStorage.getItem("user-type");
    const userID = localStorage.getItem("user-id");
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const infoPic = "../images/info.svg";
    const BankPic = "../images/BankIcon.svg";
    console.log(appointment);
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
    const openInfo = (id) => {
        setPatientId(id);
        setModalOpen(true);
        console.log(id);
    };
    const openBank = (appointment, type) => {
        setAppointment(appointment);
        if (type == "patient") {
            setBanks(JSON.parse(appointment.PatientBanks));
        } else {
            setBanks(JSON.parse(appointment.DoctorBanks));
        }
        setShowPayContainer(true);
    };
    const exitHandle = () => {
        setShowInfo(false);
    };
    const markDone = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        setIsSaving(true);
        try {
            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            const formData = new FormData();
            // Convert to string before appending
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            formData.append("appointmentId", parseInt(appointment.id));

            const response = await axiosClient.post(
                "/DoneAppointment",
                formData
            );
            if (response.data.status == 200) {
                swalWithBootstrapButtons
                    .fire(
                        "changes saved successfully",
                        "This appointment has been marked as Done .",
                        "success"
                    )
                    .then(() => {
                        window.location.reload(); // Refresh the page after success
                    });
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);
            console.error("Error saving schedule:", error);
        }
        setIsSaving(false);
    };

    const approve = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        setIsSaving(true);
        try {
            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            const formData = new FormData();
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            formData.append("appointmentId", parseInt(appointment.id));
            const response = await axiosClient.post(
                "/ApproveAppointment",
                formData
            );
            console.log(response)
            if (response.data.status == 200) {
                swalWithBootstrapButtons
                    .fire(
                        "changes saved successfully",
                        "Your schedule has been updated.",
                        "success"
                    )
                    .then(() => {
                        window.location.reload(); // Refresh the page after success
                    });
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);
            console.error("Error saving schedule:", error);
        }
        setIsSaving(false);
    };

    const Pay = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        setIsSaving(true);
        try {
            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            const formData = new FormData();
            // Convert to string before appending
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            formData.append("appointmentId", parseInt(appointment.id));

            const response = await axiosClient.post(
                "/PaidAppointment",
                formData
            );
            if (response.data.status == 200) {
                swalWithBootstrapButtons
                    .fire(
                        "changes saved successfully",
                        "Your schedule has been updated.",
                        "success"
                    )
                    .then(() => {
                        window.location.reload(); // Refresh the page after success
                    });
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);
            console.error("Error saving schedule:", error);
        }
        setIsSaving(false);
    };
    const remove = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        setIsSaving(true);
        try {
            const formData = new FormData();
            // Convert to string before appending
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            formData.append("appointmentId", parseInt(appointment.id));

            const response = await axiosClient.post(
                "/DeleteAppointment",
                formData
            );
            console.log(response)
            if (response.data.status == 200) {
                swalWithBootstrapButtons
                    .fire(
                        "changes saved successfully",
                        "Your schedule has been updated.",
                        "success"
                    )
                    .then(() => {
                        window.location.reload(); // Refresh the page after success
                    });
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
            console.log(response);
        } catch (error) {
            console.log(error);
            console.error("Error saving schedule:", error);
        }
        setIsSaving(false);
    };

    const isNow = (appointment) => {
        const now = new Date();
        const now2 = new Date(now.getTime() );
        let beforeTime;

        if (appointment.timeType === "Hours") {
            beforeTime = new Date(
                now2.getTime() - parseInt(appointment.duration) * 60 * 60 * 1000
            );
        } else {
            beforeTime = new Date(
                now2.getTime() - parseInt(appointment.duration) * 60 * 1000
            );
        }
        const appointmentDate = new Date(appointment.date);
        console.log(appointmentDate)
        console.log(now2)

        console.log(beforeTime)
        if (appointmentDate <= now2 && appointmentDate >= beforeTime) {
            // Mark as now
            console.log("Appointment is now");
            return true;
        } else {
            console.log("Appointment is not now");
            return false;
        }
    };
    return (
        <div className="appointmentInfo">
            <div className="modal">
                <div className="modal-content">
                    <div className="InfoTitle">
                        <h2 className={"hasexit"}>Appointment Informations</h2>

                        <div className="exitButton">
                            <button type="button" onClick={exitHandle}>
                                X
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="rowData">
                            <div className="doctorNAme">
                                Doctor Name :
                                <div className="data">
                                    {appointment.doctor != null
                                        ? appointment.doctor.user_name
                                        : "unknown"}{" "}
                                </div>
                            </div>
                            <div className="patientName">
                                Patient Name :
                                <div className="data">
                                    {appointment.patient != null
                                        ? appointment.patient.user_name
                                        : "unknown"}
                                </div>
                            </div>
                        </div>
                        <div className="rowData three">
                            <div>
                                Time :
                                <div className="data">{appointment.time}</div>
                            </div>
                            <div>
                                Date :
                                <div className="data">
                                    {date.current == "Date"
                                        ? date.current
                                        : `${date.current.getDate()} / ${
                                              date.current.getMonth() + 1
                                          } /
                                    ${date.current.getFullYear()}`}
                                </div>
                            </div>
                            <div>
                                Day :
                                <div className="data">
                                    {daysOfWeek[appointment.day]}
                                </div>
                            </div>
                        </div>
                        <div className="rowData">
                            <div>
                                Cost :
                                <div className="data">{appointment.cost}</div>
                            </div>
                            <div>
                                Duration :
                                <div className="data">
                                    {appointment.duration}{" "}
                                    {appointment.timeType}
                                </div>
                            </div>
                        </div>
                        <div className="rowData">
                            <div>
                                Type :
                                <div className="data">{appointment.type}</div>
                            </div>
                            <div>
                                State :
                                <div className="data">{appointment.state}</div>
                            </div>
                        </div>
                        {userType == "admin" ? (
                            <>
                                <div className="rowData">
                                    <div>
                                        Patient Duration :
                                        <div className="data">
                                            {appointment.realPatientDuration}{" "}
                                            minutes
                                        </div>
                                    </div>
                                    <div>
                                        Doctor Duration :
                                        <div className="data">
                                            {appointment.realDuration} minutes
                                        </div>
                                    </div>
                                </div>
                                <div className="rowData">
                                    <div>
                                        End User :
                                        <div className="data">
                                            {appointment.endUser}
                                        </div>
                                    </div>
                                    <div>
                                        Auto Close :
                                        <div className="data">
                                            {appointment.autoClose == 1
                                                ? "yes"
                                                : "no"}
                                        </div>{" "}
                                    </div>
                                </div>
                            </>
                        ) : null}
                        <div className="rowData">
                            {appointment.doctorID !== null ? (
                                <div className="infoButton">
                                    Doctor Banks :
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openBank(appointment, "doctor")
                                        }
                                        className={"BankButton"}
                                    >
                                        <img src={BankPic} />
                                    </button>
                                </div>
                            ) : null}
                            {appointment.patientID !== null ? (
                                <div className="infoButton">
                                    Patient Banks :
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openBank(appointment, "patient")
                                        }
                                        className={"BankButton"}
                                    >
                                        <img src={BankPic} />
                                    </button>
                                </div>
                            ) : null}
                            {appointment.patientID !== null ? (
                                <div className={`infoButton`}>
                                    Patient Information :
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openInfo(appointment.patientID)
                                        }
                                        className={"infoButton2"}
                                    >
                                        <img src={infoPic} />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                        <div className=" rowData buttons">
                            {appointment.type == "waiting" &&
                            userType !== "admin" &&
                            userType != "patient" ? (
                                <div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            approve(appointment.id);
                                        }}
                                        type="button"
                                        className={`approveButton`}
                                    >
                                        {isSaving ? "..." : "Approve"}
                                    </button>
                                </div>
                            ) : null}
                            {(appointment.type == "waiting" ||
                                appointment.type == "approved") &&
                            userType !== "admin" &&
                            userType != "patient" ? (
                                <div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            Pay(appointment.id);
                                        }}
                                        type="button"
                                        className={`paidButton`}
                                    >
                                        {isSaving ? "..." : "Paid"}
                                    </button>
                                </div>
                            ) : null}
                            {appointment.type == "paid" ? (
                                <div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            markDone(appointment);
                                        }}
                                        type="button"
                                        className={`doneButton 
                                        `}
                                    >
                                        {isSaving ? "..." : "Done"}
                                    </button>
                                </div>
                            ) : null}
                            {appointment.type == "paid" &&
                            isNow(appointment) &&
                            (userID == appointment.doctor.id ||
                                userType == "patient") &&
                            appointment.patient ? (
                                <div>
                                    <button
                                        onClick={() => {
                                            navigate("/intro", {
                                                state: {
                                                    doctorID:
                                                        appointment.doctor.id,
                                                    patientID:
                                                        appointment.patient.id,
                                                },
                                            });
                                        }}
                                        type="button"
                                        className={`doneButton 
                                        `}
                                    >
                                        {isSaving ? "..." : "Call"}
                                    </button>
                                </div>
                            ) : null}
                            {appointment.type != "Canceled" && appointment.type!="done"? (
                                <div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            remove(appointment.id);
                                        }}
                                        type="button"
                                        className={`deleteButton 
                                        `}
                                    >
                                        {isSaving ? "..." : "Cancel"}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AppointmentInfo;
