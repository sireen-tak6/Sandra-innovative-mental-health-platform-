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

const AppointmentCard = ({ item, last, first }) => {
    console.log(last);
    console.log(item);
    const [date, setdate] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "day",
    ];
    useEffect(() => {
        if (item.date == "date") {
            setdate("date");
        } else {
            const date2 = new Date(item.date);
            setdate(date2);
        }
    }, [item]);
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
 // Convert to string before appending
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            formData.append("appointmentId", parseInt(id));

            const response = await axiosClient.post(
                "/ApproveAppointment",
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
            console.log(response);
        } catch (error) {
            console.log(error)
            console.error("Error saving schedule:", error);
        }
        setIsSaving(false);
    }
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
            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            const formData = new FormData();
 // Convert to string before appending
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            formData.append("appointmentId", parseInt(id));

            const response = await axiosClient.post(
                "/DeleteAppointment",
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
            console.log(response);
        } catch (error) {
            console.log(error)
            console.error("Error saving schedule:", error);
        }
        setIsSaving(false);
    };
    return (
        <Link to={`${item.id}`} key={item.id}>
            {date === null ? (
                <div>
                    <CircularLoading />
                </div>
            ) : (
                <div className={`AppointmentCard ${last ? "none" : "none"} `}>
                    <div className="CardInfo">
                        <div className={`info ${first ? "first" : ""}`}>
                            info
                        </div>
                        <div className={`name ${first ? "first" : ""}`}>
                            {item.patient ? item.patient.user_name : "unknown"}
                        </div>
                        <div className={`time ${first ? "first" : ""}`}>
                            {item.time}
                        </div>
                        <div className={`day ${first ? "first" : ""}`}>
                            {daysOfWeek[item.day]}
                        </div>
                        <div className={`date ${first ? "first" : ""}`}>
                            {date == "date"
                                ? date
                                : `${date.getDate()} / ${date.getMonth() + 1} /
                            ${date.getFullYear()}`}
                        </div>
                        <div className={`state ${first ? "first" : ""}`}>
                            <div className={item.state}>{item.state}</div>
                        </div>
                        <div className={`type ${first ? "first" : ""}`}>
                            <div className={item.type}>{item.type}</div>
                        </div>
                    </div>
                    {first ? (
                        <div className="buttons">
                            <div onClick={()=>{}} className={`approveButton ${first ? "first" : ""}`}>Approve</div>
                            <div onClick={()=>{}} className={`deleteButton ${first ? "first" : ""}`}>Delete</div>
                        </div>
                    ) : null}
                    {item.type == "waiting" ? (
                        <>
                            <div className={`approveButton ${first ? "first" : ""}`}>
                                <button  onClick={(e) => {e.preventDefault(); approve(item.id)}} type="button" className={`approveButton ${first ? "first" : ""}`}>Approve</button>{" "}
                            </div>
                            <div className="">
                                <button onClick={(e) => {e.preventDefault(); remove(item.id)}}
                                 type="button" className={`deleteButton ${first ? "first" : ""}`}>Delete</button>{" "}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={`approveButton none2 ${first ? "first" : ""}`}></div>
                            <div className={`deleteButton none2 ${first ? "first" : ""}`}></div>
                        </>
                    )}
                </div>
            )}
        </Link>
    );
};
export default AppointmentCard;
