import React, { useState, useEffect } from "react";
import "./SessionDetailsForm.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

const SessionDetailsForm = ({
    sessionCost,
    sessionTime,
    sessionTimeType,
    setSessionCost,
    setSessionTime,
    setSessionTimeType,
    cancel,
}) => {
    const userType = localStorage.getItem("user-type");
    console.log(sessionCost);
    const handleDetailsChange = (event) => {
        const { id, value } = event.target;
        if (id == "sessionCost") {
            setSessionCost(value);
        } else {
            setSessionTime(value);
        }
    };
    const handleTimeChange = (event) => {
        const { id, value } = event.target;
        setSessionTimeType(value);
    };

    return (
        <div className="Details">
            <div className="detailTitle">
                <div className="title">Session details</div>{" "}
                <div className="exit">
                    <button onClick={cancel} type="button">
                        X
                    </button>
                </div>
            </div>
            <div className="detailsDiv">
                <div className="DetailName">
                    Time : <span className="required">(required)</span>
                </div>
                <input
                    id="sessionTime"
                    name="sessionTime"
                    value={sessionTime}
                    onChange={handleDetailsChange}
                    className="SessionInput"
                    placeholder={`1 hour , 30 minutes`}
                    required={true}
                    type="number"
                />
                <div className="radioDiv">
                    <input
                        type="radio"
                        name="Cost"
                        id="Minutes"
                        className="radioButton"
                        value="Minutes"
                        onChange={handleTimeChange}
                        checked={sessionTimeType == "Minutes"}
                    />
                    Minutes
                </div>
                <div className="radioDiv">
                    <input
                        type="radio"
                        name="Cost"
                        id="Hours"
                        className="radioButton"
                        value="Hours"
                        onChange={handleTimeChange}
                        checked={sessionTimeType == "Hours"}
                    />
                    Hours{" "}
                </div>
            </div>
            <div className="detailsDiv">
                <div className="DetailName">
                    Cost : <span className="required">(required)</span>
                </div>
                <input
                    id="sessionCost"
                    name="sessionCost"
                    value={sessionCost}
                    onChange={handleDetailsChange}
                    className="SessionInput"
                    type="number"
                    placeholder={`40000`}
                    required={true}
                />
                <span className="syp">( SYP )</span>
            </div>
        </div>
    );
};

export default SessionDetailsForm;
