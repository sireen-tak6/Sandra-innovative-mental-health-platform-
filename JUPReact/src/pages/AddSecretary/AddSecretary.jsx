// src/components/PatientBooking.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios";
import AddSecretaryForm from "../../Components/Forms/AddSecretaryForm/AddSecretaryForm";
import "./AddSecretary.css";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2/dist/sweetalert2.js";

const Secretary = () => {
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("user-Secretary"))) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
            swalWithBootstrapButtons.fire(
                "you already have a secretary account",
                "",
                "warning"
            );

            navigate("/home");
        }
    }, [localStorage.getItem("user-Secretary")]);
    const [user_name, setUser_name] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({ __html: "" });
    const [isloading, setloading] = useState(false);
    const navigate = useNavigate();

    const onsubmit = async (ev) => {
        setloading(true);
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        ev.preventDefault();
        setError({ __html: "" });
        const userType = localStorage.getItem("user-type");
        const userId = localStorage.getItem("user-id");
        axiosClient
            .post("/AddSecretary", {
                userID: userId,
                userType: userType,
                user_name,
                password,
                password_confirmation: confirmpassword,
            })
            .then((response) => {
                console.log(response);
                if (response.data.status === 200) {
                    JSON.stringify(response);
                    localStorage.setItem("user-Secretary", JSON.stringify(response.data.user));
                    console.log("data added successfully");
                    swalWithBootstrapButtons.fire(
                        "New Secretary account added successfully",
                        response.data.message,
                        "success"
                    );
                    navigate("/home");
                } else {
                    swalWithBootstrapButtons.fire(
                        response.data.message,
                        "Your changes has not been saved",
                        "error"
                    );
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    const finalErrors =
                        error.response.data.errors &&
                        Object.values(error.response.data.errors).reduce(
                            (accum, next) => [...accum, ...next],
                            []
                        );
                    const joinedErrors =
                        finalErrors && finalErrors.join("<br>");
                    setError({ __html: joinedErrors });
                }
                console.error(error);
            });
        setloading(false);
    };

    return (
        <div className="AddSecretary">
            <div className="AddSecretaryForm">
                <div className={`pic`}></div>

                <div className="right">
                    <div className="title">Add Secretary</div>
                    {error.__html && (
                        <div
                            className="error"
                            dangerouslySetInnerHTML={error}
                        ></div>
                    )}

                    <AddSecretaryForm
                        onsubmit={onsubmit}
                        setUser_name={setUser_name}
                        setPassword={setPassword}
                        setConfirmPassword={setConfirmPassword}
                        user_name={user_name}
                        password={password}
                        confirmpassword={confirmpassword}
                        isloading={isloading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Secretary;
