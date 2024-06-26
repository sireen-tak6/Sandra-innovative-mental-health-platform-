import React, { useState, useEffect } from "react";
import "./BankAccountsForm.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

const BankAccountsForm = ({ BankAccounts, handleChange, cancel }) => {
    const userType = localStorage.getItem("user-type");

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
    return (
        <>
            <div className="BankTitle">
                <div className="title">Bank information</div>{" "}
                <div className="exit">
                    <button onClick={cancel} type="button">
                        X
                    </button>
                </div>
            </div>
            <div className="notesPart">
                <>
                    <div>
                        - Please enter your bank account number for this
                        payment. This will help us track down the payment
                        quickly and resolve any problems that may arise.
                    </div>
                    <div>
                        - Your acounts will be seen to all{" "}
                        {userType == "doctor" || userType == "secretary"
                            ? "patients."
                            : userType == "patient"
                            ? "doctors."
                            : ""}
                    </div>
                </>
            </div>

            <form>
                <div className="grid2 ">
                    {Banks.map((Bank, index) => (
                        <div className="Bank">
                            <div className="BankName">
                                {Bank.name}{" "}
                                {Bank.short !== "" ? `(${Bank.short}) ` : ""}:
                            </div>
                            <div className="BankInfo">
                                <div className="BankLogo">
                                    <img
                                        src={Bank.icon}
                                        className="BankImage"
                                    ></img>
                                </div>
                                <input
                                    id={Bank.id}
                                    name={Bank.name}
                                    value={BankAccounts[Bank.id]}
                                    onChange={handleChange}
                                    className="BankInput"
                                    placeholder={`${Bank.name} account`}
                                    required={false}
                                />{" "}
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </>
    );
};

export default BankAccountsForm;
