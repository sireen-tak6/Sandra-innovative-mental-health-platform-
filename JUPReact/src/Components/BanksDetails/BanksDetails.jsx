import React, { useState, useEffect } from "react";
import axiosClient from "../../axios";
import "./BanksDetails.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import SessionDetailsForm from "../Forms/SessionDetailsForm/SessionDetailsForm";
import BankAccountsForm from "../Forms/BankAccountsForm/BankAccountsForm";
const hasEmptyRequiredField = (sessionTime, sessionCost, sessionTimeType) => {
    if (
        sessionTime == "" ||
        sessionCost == "" ||
        (sessionTimeType !== "Hours" && sessionTimeType !== "Minutes")
    ) {
        return true;
    }
    return false; // No empty required fields found
};
const BanksDetails = ({
    BankAccounts,
    handleChange,
    bankAdded,
    cancelBank,
    sessionTime,
    sessionCost,
    sessionTimeType,
    setSessionCost,
    setSessionTime,
    setSessionTimeType,
}) => {
    const userType = localStorage.getItem("user-type");
    const [currentStep, setCurrentStep] = useState(1); // Track the current step
    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            console.warn("Please fill in all required fields for this step.");
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const savedisplayDetails = () => {
        bankAdded(
            sessionCost,
            sessionTime,
            sessionTimeType,
            hasEmptyRequiredField(sessionTime, sessionCost, sessionTimeType)
        );
    };
    return (
        <div className="Bankmodal">
            <div className="Bankmodal-content">
                {userType == "doctor" ? (
                    currentStep == 1 ? (
                        <BankAccountsForm
                            BankAccounts={BankAccounts}
                            handleChange={handleChange}
                            cancel={cancelBank}
                        />
                    ) : (
                        <SessionDetailsForm
                            sessionCost={sessionCost}
                            sessionTime={sessionTime}
                            sessionTimeType={sessionTimeType}
                            setSessionCost={setSessionCost}
                            setSessionTime={setSessionTime}
                            setSessionTimeType={setSessionTimeType}
                            cancel={cancelBank}
                        />
                    )
                ) : (
                    <BankAccountsForm
                        BankAccounts={BankAccounts}
                        handleChange={handleChange}
                        cancel={cancelBank}

                    />
                )}
                {userType == "doctor" ? (
                    currentStep == 1 ? (
                        <div className="BankButtons">
                            <button
                                onClick={cancelBank}
                                type="button"
                                className="cancelButton"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleNext}
                                type="button"
                                className="okButton"
                            >
                                next
                            </button>
                        </div>
                    ) : (
                        <div className="BankButtons">
                            <button
                                onClick={handlePrevious}
                                type="button"
                                className="cancelButton"
                            >
                                Back
                            </button>
                            <button
                                onClick={savedisplayDetails}
                                type="button"
                                className="okButton"
                            >
                                Save
                            </button>
                        </div>
                    )
                ) : (
                    <div className="BankButtons">
                        <button
                            onClick={cancelBank}
                            type="button"
                            className="cancelButton"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={ userType!="patient"&&
                                hasEmptyRequiredField(
                                    sessionTime,
                                    sessionCost,
                                    sessionTimeType
                                )
                                    ? ""
                                    : savedisplayDetails
                            }
                            type="button"
                            className={"okButton"}
                            disabled={
                                userType !== "patient" &&
                                hasEmptyRequiredField(
                                    sessionTime,
                                    sessionCost,
                                    sessionTimeType
                                )
                            }
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BanksDetails;
