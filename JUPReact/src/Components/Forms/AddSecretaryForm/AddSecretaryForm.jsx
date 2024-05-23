import React from "react";
import { Link } from "react-router-dom";

//css
import "sweetalert2/src/sweetalert2.scss";
import "./AddSecretaryForm.css";
import CircularLoading from "../../loadingprogress/loadingProgress";

const AddSecretaryForm = ({
    onsubmit,
    setUser_name,
    setPassword,
    setConfirmPassword,
    user_name,
    password,
    confirmpassword,
    isloading,
}) => {
    return (
            <form onSubmit={onsubmit}>
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
                    <label htmlFor="password"></label>{" "}
                </div>{" "}
                <div className="div">
                    <div className="label">confirm Password :</div>
                    <input
                        type="password"
                        id="confirmpassword"
                        name="confirmpassword"
                        className="form-control form-control-lg "
                        placeholder="Confirm Password"
                        value={confirmpassword}
                        onChange={(ev) => setConfirmPassword(ev.target.value)}
                    />
                    <label htmlFor="password"></label>
                </div>
                {isloading ? (
                    <CircularLoading />
                ) : (
                    <>
                        <div className="submitPart">
                            <button type="submit" className="button">
                                Add Secretary{" "}
                            </button>
                        </div>
                    </>
                )}{" "}
            </form>
    );
};
export default AddSecretaryForm;
