import React, { useState, useEffect } from "react";
import "./ComplaintCard.css";
import axiosClient from "../../../axios";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
const ComplaintCard = ({ item, OpenContent, first }) => {
    const [date, setDate] = useState(null);

    useEffect(() => {
        if (item.created_at == "Date") {
            setDate("Date");
        } else {
            const date2 = new Date(item.created_at);
            setDate(date2);
        }
    }, [item]);
    const openContent = () => {
        OpenContent(item);
    };
    
    const deleteItem = async (event) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        event.preventDefault();

        swalWithBootstrapButtons
            .fire({
                title: "Are you sure?",
                text: "Do you want to delete this complaint?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {

                    const userID = localStorage.getItem("user-id");
                    const userType = localStorage.getItem("user-type");

                    const formData = new FormData();

                    formData.append("userID", parseInt(userID));
                    formData.append("userType", userType);
                    formData.append("complaintID", item.id);
                    try {
                        const response = await axiosClient.post(
                            "/deleteComplaint",
                            formData
                        );
                        console.log(response);
                        if (!response.data.status == 200) {
                            throw new Error(
                                `Error submitting form: ${response.data.message}`
                            );
                        }

                        swalWithBootstrapButtons
                            .fire(
                                "Complaint Deleted.",
                                "The complaint has been deleted successfully.",
                                "success"
                            )
                            .then(() => {
                                window.location.reload(); // Refresh the page after success
                            });
                    } catch (error) {
                        console.error("Error submitting form:", error);
                        swalWithBootstrapButtons.fire(
                            error.response.data.message,
                            "error"
                        );
                    } 
                }
            });
    };

    return (
        <div
            className={`ComplaintCard ${item.status} ${first ? "first" : null}`}
        >
            <div className={`imageContainer ${first ? "first image" : null} `}>
                {first ? "Images" : null}
                {item.firstImage && (
                    <div>
                        {" "}
                        <img
                            src={"http://localhost:8000/" + item.firstImage}
                            alt=""
                        />
                    </div>
                )}
                {item.secondImage && (
                    <div>
                        {" "}
                        <img
                            src={"http://localhost:8000/" + item.secondImage}
                            alt=""
                        />
                    </div>
                )}
                {item.thirdImage && (
                    <div>
                        {" "}
                        <img
                            src={"http://localhost:8000/" + item.thirdImage}
                            alt=""
                        />
                    </div>
                )}
            </div>

            <div className={`name ${first ? "first " : null}`}>
                {item.doctor && item.doctor.user_name}
                {item.patient && item.patient.user_name}
            </div>
            <div className={`userType ${first ? "first " : null} `}>
                {item.userType}
            </div>
            <div className={`description ${first ? "first " : null} `}>
                {item.description.length>40?`${item.description.slice(0,40)}...`:item.description} 
            </div>
            <div className={`date ${first ? "first " : null}`}>
                {date && date !== "Date"
                    ? ` ${
                          date.getHours() < 12
                              ? `0${date.getHours()}`
                              : date.getHours()
                      }:${date.getMinutes()}  ${date.getDate()}/${
                          date.getMonth() + 1
                      }/${date.getFullYear()} `
                    : "Date"}
            </div>
            <div
                className={`${first ? " first ContentText" : "ContentButton"} `}
            >
                {!first &&( localStorage.getItem('user-type')==item.userType &&( localStorage.getItem("user-id")==item.doctorID||localStorage.getItem("user-id")==item.patientID))||(localStorage.getItem("user-type")=="admin")? (
                    <button type="button" onClick={openContent}>
                        Content
                    </button>
                ) : (
                    <div className={` ${first ? "Notfirst" : null}`}>
                        Content
                    </div>
                )}
            </div>
            <div className={`${first ? " first DeleteText" : "DeleteButton"} `}>
                {!first && localStorage.getItem('user-type')!="admin" && item.status!="deleted"? (
                    <button type="button" onClick={deleteItem}>
                        Delete
                    </button>
                ) :first? (
                    <div className={` ${first ? "Notfirst" : null}`}>
                        Delete
                    </div>
                ):<div className="notback"></div>}
            </div>
        </div>
    );
};

export default ComplaintCard;
