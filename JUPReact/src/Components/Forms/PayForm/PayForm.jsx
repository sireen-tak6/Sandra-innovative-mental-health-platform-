import React, { useState, useEffect } from "react";
import axiosClient from "../../../axios";
import "./PayForm.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

const PayForm = ({
    doctorBanks,
    appointment,
    setShowPayContainer,
    AddAppointment,
    time,
    type,
    cost,
    cancelBank,
    editable,
    notUser,
}) => {
    console.log("hiiiii");
    const userType = localStorage.getItem("user-type");
    const [selectedPayment, setSelectedPayment] = useState("cash");
    const [dayBefore, setdayBefore] = useState(null);
    const [DisplayBanks, setDisplayBanks] = useState(false);
    console.log(appointment);
    useEffect(() => {
        if (appointment) {
          const referenceDate = new Date(appointment.date);
          const day = new Date(referenceDate.getTime() - 1 * 24 * 60 * 60 * 1000);
          setdayBefore(day);
        }
      }, [appointment]);
  
    const Banks = [
        {
            id: "Cham",
            name: "Cham Bank",
            short: "",
            icon: "../images/Banks/cham.jpg",
        },
        {
            id: "ByblosBankSyria",
            name: "Byblos Bank Syria",
            short: "BBS",
            icon: "../images/Banks/Byblos.jpg",
        },
        {
            id: "SyrianArab",
            name: "Syrian Arab Bank",
            short: "SAB",
            icon: "../images/Banks/arab.jpg",
        },
        {
            id: "AlBarakaSyria",
            name: "Al Baraka Syria",
            short: "",
            icon: "../images/Banks/Baraka.png",
        },
        {
            id: "Fransabank",
            name: "Fransabank",
            short: "",
            icon: "../images/Banks/Francbank.jpg",
        },

        {
            id: "BankofJordan",
            name: "Bank of Jordan",
            short: "",
            icon: "../images/Banks/jordan.png",
        },
        {
            id: "BanqueBemoSaudiFransi",
            name: "Banque Bemo Saudi Fransi",
            short: "BBSF",
            icon: "../images/Banks/Bemo.png",
        },
        {
            id: "BankofSyriaandOverseas",
            name: "Bank of Syria and Overseas",
            short: "BSO",
            icon: "../images/Banks/bso.jpg",
        },
        {
            id: "QatarNationalBank",
            name: "Qatar National Bank",
            short: "QNB",
            icon: "../images/Banks/qatar.jpg",
        },
        {
            id: "InterNationalIslamicBank",
            name: "International Islamic Bank",
            short: "",
            icon: "../images/Banks/islamic.jpg",
        },
    ];

    const handleChange = (event) => {
        setSelectedPayment(event.target.value);
        setIsChoosen(true);
    };
    const cancel = () => {
        setShowPayContainer(false);
        cancelBank();
    };

    const choose = () => {
        if (selectedPayment == "bankAccount") {
            setDisplayBanks(true);
        } else {
            setShowPayContainer(false);
            AddAppointment(selectedPayment);
        }
    };
    const Back = () => {
        setDisplayBanks(false);
    };

    const Done = () => {
        setShowPayContainer(false);
        AddAppointment(selectedPayment);
    };
    return (
        <div className="Paymodal">
            <div className="Paymodal-content">
                <div className="PayTitle">
                    <div className="title">Pay Now</div>{" "}
                    {editable == true ? (
                        <div className="exit">
                            <button onClick={cancel} type="button">
                                X
                            </button>
                        </div>
                    ) : null}
                </div>
                {(DisplayBanks && selectedPayment == "bankAccount") ||
                editable == false ? (
                    <>
                        {notUser != true ? (
                            <div className="notesPart">
                                <>
                                    { dayBefore!==null  && (
                                        <div className="danger">
                                            - **Payment Required!** Appointment
                                            will be deleted if payment is not
                                            received before [
                                            {dayBefore.getDate()}-
                                            {dayBefore.getMonth() + 1}-
                                            {dayBefore.getFullYear()} /{" "}
                                            {dayBefore.getHours()}:
                                            {dayBefore.getMinutes()}
                                            {"0"}].
                                        </div>
                                    )}
                                    {editable == true ? (
                                        <div>
                                            - The session fee is ({cost} SYP)
                                            and will provide you with ({time}{" "}
                                            {type}) of service.
                                        </div>
                                    ) : null}
                                </>
                            </div>
                        ) : null}
                        <div className="grid2 ">
                            {Banks.map((Bank, index) =>
                                doctorBanks[Bank["id"]] !== "" ? (
                                    <div className="Bank">
                                        <div className="BankName">
                                            {Bank.name}{" "}
                                            {Bank.short !== ""
                                                ? `(${Bank.short}) `
                                                : ""}
                                            :
                                        </div>
                                        <div className="BankInfo">
                                            <div className="BankLogo">
                                                <img
                                                    src={Bank.icon}
                                                    className="BankImage"
                                                ></img>
                                            </div>
                                            <div className="BankInput">
                                                {doctorBanks[Bank.id]}
                                            </div>{" "}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                        <div className="BankButtons">
                            {editable == true ? (
                                <>
                                    <button
                                        type="button"
                                        className="cancelButton"
                                        onClick={Back}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        className="SaveButton"
                                        onClick={Done}
                                    >
                                        Done
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="SaveButton"
                                    onClick={cancel}
                                >
                                    Done
                                </button>
                            )}
                        </div>
                    </>
                ) : editable == true ? (
                    <>
                        <div className="notesPart">
                            <>
                            {dayBefore &&
                                <div className="danger">
                                    - **Payment Required!** Appointment will be
                                    deleted if payment is not received before [
                                    {dayBefore.getDate()}-
                                    {dayBefore.getMonth() + 1}-
                                    {dayBefore.getFullYear()} /{" "}
                                    {dayBefore.getHours()}:
                                    {dayBefore.getMinutes()}
                                    {"0"}].
                                </div>}
                                <div>
                                    - The session fee is ({cost} SYP) and will
                                    provide you with ({time} {type}) of service.
                                </div>
                                <div>
                                    - You can choose to pay by cash or by bank
                                    account.
                                </div>
                            </>
                        </div>
                        <div className="PayOptions">
                            <div className="radioButtonDiv">
                                <input
                                    type="radio"
                                    name="pay"
                                    id="cash"
                                    className="radioButton"
                                    value="cash"
                                    onChange={handleChange}
                                    checked={selectedPayment == "cash"}
                                />
                                Cash
                            </div>
                            <div className="radioButtonDiv">
                                <input
                                    type="radio"
                                    name="pay"
                                    id="Bank"
                                    className="radioButton"
                                    value="bankAccount"
                                    onChange={handleChange}
                                    checked={selectedPayment == "bankAccount"}
                                />
                                Bank Account
                            </div>
                        </div>
                        {selectedPayment == "cash" ? (
                            <div>
                                <button
                                    type="button"
                                    className="SaveButton"
                                    onClick={choose}
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div>
                                <button
                                    type="button"
                                    className="SaveButton"
                                    onClick={choose}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default PayForm;
