import React from "react";
import { Link } from "react-router-dom";

//css
import "sweetalert2/src/sweetalert2.scss";
import "./SignUpLoginForm.css";
import CircularLoading from "../../loadingprogress/loadingProgress";

const SignUpLoginForm = ({
    onsubmit,
    setUser_name,
    setEmail,
    setPassword,
    setConfirmPassword,
    Type,
    user_name,
    email,
    password,
    confirmpassword,
    setloading,
    isloading,

}) => {
    return (
        <form onSubmit={onsubmit}>
            {Type === "SignUp" || Type == "SecretaryLogin" ? (
                <div className="div">
                    <div className="label">user name :</div>
                    <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        className="form-control form-control-lg"
                        placeholder="Your User Name"
                        value={user_name}
                        onChange={(ev) => setUser_name(ev.target.value)}
                    />
                    <label htmlFor="email"></label>
                </div>
            ) : null}
            {Type !== "SecretaryLogin" ? (
                <div className="div">
                    <div className="label">email :</div>
                    <input
                        type="email"
                        id="email"
                        className="form-control form-control-lg"
                        placeholder="Your Email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <label htmlFor="password"></label>
                </div>
            ) : null}
            <div className="div">
                <div className="label">Password :</div>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                />
                <label htmlFor="password"></label>
                {Type !== "SignUp" ? <a>forgot password?</a> : null}
            </div>{" "}
            {Type === "SignUp" ? (
                <>
                    {" "}
                    <div className="div">
                        <div className="label">confirm Password :</div>
                        <input
                            type="password"
                            id="confirmpassword"
                            name="confirmpassword"
                            className="form-control form-control-lg "
                            placeholder="Confirm Password"
                            value={confirmpassword}
                            onChange={(ev) =>
                                setConfirmPassword(ev.target.value)
                            }
                        />
                        <label htmlFor="password"></label>
                    </div>
                    {isloading ? (
                        <CircularLoading />
                    ) : (
                        <>
                            <div className="submitPart">
                                <button type="submit" className="button">
                                    Sign Up
                                </button>
                            </div>
                            <div className="LoginButton">
                                you already have an account ?{" "}
                                <Link to="/login">Login</Link>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    {isloading ? (
                        <CircularLoading />
                    ) : (
                        <>
                            <div className="submitPart">
                                <button type="submit" className="button">Login</button>
                            </div>
                            <div className="signupButton">
                                you don't have an account :{" "}
                                <Link to="/signup">Sign Up</Link>
                            </div>
                        </>
                    )}
                </>
            )}
        </form>
    );
};
export default SignUpLoginForm;
