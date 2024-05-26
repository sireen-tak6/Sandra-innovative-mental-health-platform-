import React, { useState, useEffect } from "react";
import axiosClient from "../../axios";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//components
import CircularLoading from "../loadingprogress/loadingProgress";
import PasswordCheck from "./PasswordCheck/PasswordCheck";
const SecretaryInfo = () => {
    const [userName, setUsername] = useState(null);
    const [Password, setPassword] = useState(null);
    const [ConfirmPassword, setConfirmPassword] = useState(null);

    const [OpenPassword, setOpenPassword] = useState(null);
    const [olduserName, setoldUsername] = useState(null);
    const [event, setEvent] = useState(null);

    const userID = localStorage.getItem("user-id");
    const userType = localStorage.getItem("user-type");
    useEffect(() => {
        const fetchData = async () => {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
            const formData = new FormData();
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            try {
                const response = await axiosClient.post(
                    `Settings/getSecretaryInfo`,
                    formData
                );
                if (response.data.status === 200) {
                    console.log(response);
                    setUsername(response.data.secretary.user_name);
                    setoldUsername(response.data.secretary.user_name);
                } else {
                    swalWithBootstrapButtons.fire(
                        response.data.message,
                        "error"
                    );
                }
            } catch (error) {
                swalWithBootstrapButtons.fire(
                    error.response.statusText,
                    "error"
                );
            }
        };
        fetchData();
    }, [userID]);

    const handleCloseModal = () => {
        setOpenPassword(false);
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

        if (userName) {
            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            const formData = new FormData();
            if (Password&&ConfirmPassword) {
                if(ConfirmPassword == Password){

                    setEvent(event);
                    setOpenPassword(true);
                }
                else{
                    swalWithBootstrapButtons.fire(
                        "password and confirmation not match",
                        "Your info can not been updated",
                        "error"
                    );
                }
            } else {
                formData.append("changePassword", 0);
                if (olduserName !== userName) {
                    formData.append("changeUserName", 1);
                } else {
                    formData.append("changeUserName", 0);
                }
                formData.append("userName", userName);
                formData.append("userID", parseInt(userID));
                formData.append("userType", userType);
                try {
                    const response = await axiosClient.post(
                        "Settings/SecretaryInfo",
                        formData
                    );
                    console.log(response);
                    if (response.data.status === 200) {
                        setoldUsername(userName)
                        swalWithBootstrapButtons.fire(
                            "your info have been updated.",
                            "success"
                        );
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
            }
        } else {
            console.log(Password);
            console.log(userName);
            console.log(olduserName);
            swalWithBootstrapButtons.fire(
                "User name is required",
                "Please fill all required fields",
                "error"
            );
        }
    };
    if (userName !== null) {
        return (
            <div>
                <div className="title">Secretary Information</div>
                <form onSubmit={handleSubmit}>
                    <div className="j">
                        <div className="labelInput">
                            <label>User-Name :</label>
                            <input
                                placeholder="User Name"
                                type="text"
                                value={userName ?? ""}
                                name="userName"
                                required
                                onChange={(e) => setUsername(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className="labelInput">
                            <label>Password :</label>
                            <input
                                placeholder="*******"
                                type="Password"
                                value={Password ?? ""}
                                name="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                            />
                        </div><div className="labelInput">
                            <label> Confirm Password :</label>
                            <input
                                placeholder="*******"
                                type="Password"
                                value={ConfirmPassword ?? ""}
                                name="ConfirmPassword"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="saveButton"
                        disabled={
                            Password == "" || Password==null && ConfirmPassword=="" ||ConfirmPassword==null && olduserName === userName
                        }
                    >
                        {" "}
                        save
                    </button>
                    {OpenPassword && (
                        <PasswordCheck
                            onClose={handleCloseModal}
                            event={event}
                            userName={userName}
                            Password={Password}
                            olduserName={olduserName}
                            ConfirmPassword={ConfirmPassword}
                            type="Secretary"
                        />
                    )}
                </form>
            </div>
        );
    } else {
        return (
            <div className="j">
                <div className="title">Account Information</div>
                <div className="loading">
                    <CircularLoading />
                </div>
            </div>
        );
    }
};
export default SecretaryInfo;
