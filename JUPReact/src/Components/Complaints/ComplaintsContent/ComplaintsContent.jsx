import React, { useState } from "react";
import "./ComplaintsContent.css";
import axiosClient from "../../../axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
const ComplaintsContent = ({ item, setOpenContent }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userType = localStorage.getItem("user-type");

    const handleSubmit = async (event) => {
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
                text: "Do you want to mark this complaint as managed!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                cancelButtonText: "No, Cancel!",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    setIsSubmitting(true);

                    const userID = localStorage.getItem("user-id");
                    const formData = new FormData();

                    formData.append("userID", parseInt(userID));
                    formData.append("userType", userType);
                    formData.append("complaintID", item.id);
                    try {
                        const response = await axiosClient.post(
                            "/markComplaintAsDone",
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
                                "Complaint Done.",
                                "The complaint has been managed successfully.",
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
                    } finally {
                        setIsSubmitting(false);
                    }
                }
            });
    };

    const handleImageClick = (imageUrl) => {
        if (!imageUrl) {
          return; // Handle case where no image URL is provided
        }
    
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          const width = window.innerWidth * 0.8; // Adjust width as needed
          const height = img.height * (width / img.width);
          const newWindow = window.open('', 'image');
          newWindow.document.body.innerHTML = `<img src="${imageUrl}" style="width: ${width}px; height: ${height}px;" />`;
        };
      };
    const exitHandle = () => {
        setOpenContent(false);
    };
    return (
        <div className="ComplaintsContent">
            <div className="ComplaintContentBody">
                <div className="Title">
                    <h2>
                        {item.doctor && item.doctor.user_name}
                        {item.patient && item.patient.user_name}
                    </h2>
                    <div className="exitButton">
                        <button type="button" onClick={exitHandle}>
                            X
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <div className="inputLabel">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={item.firstName}
                            disabled={true}
                        />
                    </div>
                    <div className="inputLabel">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={item.lastName}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="inputLabel">
                        <label htmlFor="number">Phone Number:</label>
                        <input
                            type="number"
                            id="number"
                            name="number"
                            value={item.number}
                            disabled={true}
                        />
                    </div>
                    <div className="inputLabel">
                        <label htmlFor="email">Email Address:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={item.email}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="inputLabel">
                        <label htmlFor="description">
                            Problem Description:
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={item.description}
                            rows={4}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className="photo-preview">
                    <div className="inputLabel">
                        <h4>Selected Photos:</h4>
                        <div className="photoContent">
                            {item.firstImage && (
                                <div>
                                    {" "}
                                    <img
                                        src={
                                            "http://localhost:8000/" +
                                            item.firstImage
                                        }
                                        alt=""
                                        onClick={() => handleImageClick("http://localhost:8000/" + item.firstImage)}

                                    />
                                </div>
                            )}
                            {item.secondImage && (
                                <div>
                                    {" "}
                                    <img
                                        src={
                                            "http://localhost:8000/" +
                                            item.secondImage
                                        }
                                        alt=""
                                        onClick={() => handleImageClick("http://localhost:8000/" + item.secondImage)}

                                    />
                                </div>
                            )}{" "}
                            {item.thirdImage && (
                                <div>
                                    {" "}
                                    <img
                                        src={
                                            "http://localhost:8000/" +
                                            item.thirdImage
                                        }
                                        alt=""
                                        onClick={() => handleImageClick("http://localhost:8000/" + item.thirdImage)}

                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>{" "}
                {localStorage.getItem("user-type") == "admin" && item.status!=="deleted" && item.status!=="managed"? (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className={"done"}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "..." : "Mark as managed"}
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default ComplaintsContent;
