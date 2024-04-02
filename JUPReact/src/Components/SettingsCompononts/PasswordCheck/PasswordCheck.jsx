import React, { useState } from "react";
import axiosClient from "../../../axios";
import { useNavigate } from "react-router-dom";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./PasswordCheck.css";

const PasswordCheck = ({
    onClose,
    event,
    userName,
    Email,
    olduserName,
    oldEmail,
}) => {
    const [password, setPassword] = useState(null);
    const navigate = useNavigate();
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

        if (Email && userName && password) {
            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            const formData = new FormData();
            if (oldEmail !== Email) {
                formData.append("changeEmail", 1);
                formData.append("password", password);
            } else {
                formData.append("changeEmail", 0);
            }
            if (olduserName !== userName) {
                formData.append("changeUserName", 1);
            } else {
                formData.append("changeUserName", 0);
            }
            formData.append("email", Email);
            formData.append("userName", userName);
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            try {
                const response = await axiosClient.post(
                    "Settings/AccountInfo",
                    formData
                );
                console.log(response);
                if (response.data.status === 200) {
                    swalWithBootstrapButtons.fire({
                        title: "Please verify your email to save changes.",
                        icon: "warning",
                    });
                    window.location.reload();
                } else {
                    swalWithBootstrapButtons.fire(
                        response.data.message,
                        "Your info can not been updated",
                        "error"
                    );
                }
            } catch (error) {
                console.log(error);
                swalWithBootstrapButtons.fire(
                    error.response.data.message,
                    "error"
                );
            }
        } else {
            console.log(Email);
            console.log(userName);
            console.log(oldEmail);
            console.log(olduserName);
            swalWithBootstrapButtons.fire(
                "All fields are required",
                " Please fill all fields",
                "error"
            );
        }
    };
    const handleContentChange = (e) => {
        setPassword(e.target.value);
    };
    return (
        <div className="passwordOverlay">
            <div className="passwordContainer">
                <div className="titlePart">
                    <p>Enter your password here please..</p>
                    <button
                        type="button"
                        className="closeButton"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>

                <form className="passwordForm">
                    <div className="passwordArea">
                        <input
                            placeholder="Password"
                            type="password"
                            value={password}
                            name="password"
                            required
                            onChange={handleContentChange}
                            className="input"
                        />
                    </div>
                    <div>
                        <button
                            type="button"
                            className="saveButton"
                            onClick={handleSubmit}
                            disabled={!password}
                        >
                            save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordCheck;
