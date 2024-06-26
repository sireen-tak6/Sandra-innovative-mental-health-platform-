import React, { useState } from "react";
import "./CustomerService.css";
import axiosClient from "../../axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useNavigate } from "react-router-dom";

const CustomerService = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [photos, setPhotos] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "firstName":
                setFirstName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
            case "number":
                setNumber(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "description":
                setDescription(value);
                break;
            default:
                break;
        }
    };

    const handlePhotoUpload = (event) => {
        const selectedPhotos = event.target.files;
        if (selectedPhotos.length > 3) {
            setErrorMessage("Please select a maximum of 3 photos.");
            return;
        }

        const validPhotos = [];
        for (let i = 0; i < selectedPhotos.length; i++) {
            const photo = selectedPhotos[i];
            if (!photo.type.match("image/*")) {
                setErrorMessage(
                    "Invalid file type. Please upload only images."
                );
                return;
            }
            validPhotos.push(photo);
        }
        setPhotos(validPhotos);
        setErrorMessage(""); // Clear any previous error messages
    };

    const handleSubmit = async (event) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        event.preventDefault();

        if (!firstName || !lastName || !number || !email || !description) {
            setErrorMessage(
                "Please fill out all required fields and upload photos."
            );
            return;
        }
        swalWithBootstrapButtons
            .fire({
                title: "Are you sure?",
                text: "Do you want to add this complaint!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Add!",
                cancelButtonText: "No, Cancel!",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    setIsSubmitting(true);

                    const userID = localStorage.getItem("user-id");
                    const userType = localStorage.getItem("user-type");
                    const formData = new FormData();
                    formData.append("firstName", firstName);
                    formData.append("lastName", lastName);
                    formData.append("number", number);
                    formData.append("email", email);
                    formData.append("description", description);

                    formData.append("userID", parseInt(userID));
                    formData.append("userType", userType);
                    formData.append("photo0", photos[0]);
                    formData.append("photo1", photos[1]);
                    formData.append("photo2", photos[2]);

                    try {
                        const response = await axiosClient.post(
                            "/AddComplaint",
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
                            "Complaint Added.",
                            "The complaint has been added successfully.",
                            "success"
                        )
                        .then(() => {
                            navigate("/complaints");
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

    return (
        <div className="CustomerService">
            <form >
                <div className="Title">
                    <h2>Report a Problem</h2>
                </div>
                <div className="form-group">
                    <div className="inputLabel">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={handleInputChange}
                            required
                            style={{
                                display: "inline-block",
                                marginRight: "10px",
                            }}
                        />
                    </div>
                    <div className="inputLabel">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={handleInputChange}
                            required
                            style={{ display: "inline-block" }}
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
                            value={number}
                            onChange={handleInputChange}
                            required
                            style={{
                                display: "inline-block",
                                marginRight: "10px",
                            }}
                        />
                    </div>
                    <div className="inputLabel">
                        <label htmlFor="email">Email Address:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            required
                            style={{ display: "inline-block" }}
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
                            value={description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="inputLabel">
                        <label htmlFor="photos">Photos (Max 3):</label>
                        <input
                            type="file"
                            id="photos"
                            name="photos"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUpload}
                        />

                        {errorMessage && (
                            <p className="error-message">{errorMessage}</p>
                        )}
                    </div>
                </div>
                {/* Display chosen photos above the uploader button */}
                {photos.length > 0 && (
                    <div className="photo-preview">
                        <div className="inputLabel">
                            <h4>Selected Photos:</h4>
                            <div className="photoContent">
                                {photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(photo)}
                                        alt="Preview"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Report Problem"}
                </button>
            </form>
        </div>
    );
};

export default CustomerService;
