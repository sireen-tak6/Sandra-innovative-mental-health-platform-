import React, { useState } from "react";

//css
import "sweetalert2/src/sweetalert2.scss";
import "./Settings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

//components
import CircularLoading from "../../Components/loadingprogress/loadingProgress";
import ContactUs from "../../Components/SettingsCompononts/ContactUs";
import DeleteAcount from "../../Components/SettingsCompononts/DeleteAccount";
import AccountInfo from "../../Components/SettingsCompononts/AccountInfo";
import PersonalInfo from "../../Components/SettingsCompononts/PersonalInfo";
import ChangePassword from "../../Components/SettingsCompononts/ChangePassowrd";
import SecretaryInfo from "../../Components/SettingsCompononts/SecretaryInfo";

const Settings = () => {
    const userID = localStorage.getItem("user-id");
    const userType = localStorage.getItem("user-type");
    const [part, setpart] = useState(
        userType === "doctor"
            ? "Personal"
            : userType === "admin"
            ? "Password"
            : userType === "secretary"
            ? "Password"
            : "Account"
    );
    const [isLoaded, setIsLoaded] = useState(false);

    function onUpdate(value) {
        setpart(value);
        setIsLoaded(true);
        setIsLoaded(false);
    }

    return (
        <div className="profileInfo">
            <div className="bodyContainer">
                <div className="partsPart">
                    <div className="partTitle">
                        {" "}
                        <FontAwesomeIcon
                            icon={faCog}
                            className="settingsicon"
                        />
                        Settings{" "}
                    </div>
                    <div className="Titles">
                        {userType === "doctor" ? (
                            <button
                                className={`part f ${
                                    part === "Personal" ? "chossen" : ""
                                }`}
                                onClick={() => onUpdate("Personal")}
                            >
                                Personal Information
                            </button>
                        ) : null}
                        {userType !== "admin" && userType!=="secretary"? (
                            <button
                                className={`part ${
                                    part === "Account" ? "chossen" : ""
                                }`}
                                onClick={() => onUpdate("Account")}
                            >
                                Account Information{" "}
                            </button>
                        ) : null}
                        {userType=="secretary"?null:
                        <button
                            className={`part ${
                                part === "Password" ? "chossen" : ""
                            }`}
                            onClick={() => onUpdate("Password")}
                        >
                            Change Password
                        </button>}
                        {localStorage.getItem("user-Secretary") && userType=="doctor"? (
                            <button
                                className={`part ${
                                    part === "Secretary" ? "chossen" : ""
                                }`}
                                onClick={() => onUpdate("Secretary")}
                            >
                                Secretary Information
                            </button>
                        ) : null}
                        {userType !== "admin" && userType!=="secretary" ? (
                            <button
                                className={`part ${
                                    part === "Delete" ? "chossen" : ""
                                }`}
                                onClick={() => onUpdate("Delete")}
                            >
                                Delete Account
                            </button>
                        ) : null}
                        <button
                            className={`part Contact ${
                                part === "Contact" ? "chossen" : ""
                            }`}
                            onClick={() => onUpdate("Contact")}
                        >
                            Contact us
                        </button>
                    </div>
                </div>
                <div className="div"></div>
                <div className="fieldsPart">
                    {isLoaded ? (
                        <CircularLoading />
                    ) : part === "Personal" ? (
                        <PersonalInfo />
                    ) : part === "Account" ? (
                        <AccountInfo />
                    ) : part === "Password" ? (
                        <ChangePassword />
                    ) : part === "Delete" ? (
                        <DeleteAcount />
                    ) : part == "Secretary" ? (
                        <SecretaryInfo />
                    ) : (
                        <ContactUs />
                    )}
                </div>
            </div>
        </div>
    );
};
export default Settings;
