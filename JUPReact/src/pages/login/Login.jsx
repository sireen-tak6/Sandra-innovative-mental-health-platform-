import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./Login.css";

//components
import SignUpLoginForm from "../../Components/Forms/SignUpLoginForm/SignUpLoginForm";

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user-info")) {
            if (localStorage.getItem("user-type") === "patient") {
                navigate("/Home");
            } else if (localStorage.getItem("user-type") === "doctor") {
                navigate("/Home");
            } else if (localStorage.getItem("user-type") === "secertarie") {
                navigate("/Home");
            } else if (localStorage.getItem("user-type") === "admin") {
                navigate("/Home");
            }
        }
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ __html: "" });
    const [isloading, setloading] = useState(false);

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

        //first parameter for the url of the api second for databases
        axiosClient
            .post("/login", {
                email,
                password,
            })
            .then((response) => {
                console.log(response);
                //this values comes from the AuthController

                if (response.data.token) {
                    localStorage.setItem("user-info", response.data.user);
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user-id", response.data.user_id);
                    localStorage.setItem("user-type", response.data.user_type);
                    localStorage.setItem(
                        "user-name",
                        response.data.user.user_name
                    );
                    localStorage.setItem("email", response.data.user.email);
                    if (response.data.user_type == "doctor") {
                        if (response.data.user.isVerfiy == 1) {
                            localStorage.setItem("doctor-verify", true);
                        } else {
                            localStorage.setItem("doctor-verify", false);
                        }
                    }
                    console.log(response.data.user);
                    console.log(response.data.token);
                    console.log(response.data.user_id);
                    console.log(response.data.user_type);
                    console.log("Login successfully");

                    navigate("/Home");
                } else {
                    swalWithBootstrapButtons.fire(
                        "something went wrong",
                        response.data.message,
                        "error"
                    );
                }
            })
            .catch((error) => {
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
        <div className="bod">
            <div className="Login">
                <div className="pic"></div>
                <div className="right">
                    <div className="title">Login</div>
                    {error.__html && (
                        <div
                            className="error"
                            dangerouslySetInnerHTML={error}
                        ></div>
                    )}
                    <SignUpLoginForm
                        onsubmit={onsubmit}
                        email={email}
                        password={password}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        Type="Login"
                        setloading={setloading}
                        isloading={isloading}
                    />
                </div>
            </div>
        </div>
    );
};
export default Login;
