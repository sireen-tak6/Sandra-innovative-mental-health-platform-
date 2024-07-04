import React, { useEffect, useState, useContext } from "react";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import axiosClient from "../../../axios";
import { useNavigate } from "react-router-dom";

//css
import "./ProfilePatientInfo.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//components
import CircularLoading from "../../loadingprogress/loadingProgress";
import LikeButton from "../../likeButton/likeButton";
import PayForm from "../../Forms/PayForm/PayForm";
import BanksDetails from "../../BanksDetails/BanksDetails";
import PatientInfo from "../../PatientInfo/PatientInfo";

const ProfilePatientInfo = ({ id, downloadPDF, setTopPatientInfo,notesSummarization,summarizationLoad }) => {
    const [patientInfo, setPatientInfo] = useState(null);
    const [bankModalOpen, setBankModalOpen] = useState(false);
    const [countt, setCountt] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [editable, setEditable] = useState(false);
    const [isLoadingInfo, setIsLoadingInfo] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        phoneNumber: "",
        gender: "Male",
        age: "", // Initial age as an empty string
        maritalStatus: "Married",
        education: "School",
        children: "",
        employmentStatus: "Employed",
        occupation: "",
        parentsStatus: "Married",
        pastConditions: "",
        medications: "",
        professionals: "",
        notes: "",
    });
    const [startBank, setstartBankAccount] = useState({
        BanqueBemoSaudiFransi: "",
        AlBarakaSyria: "",
        Cham: "",
        InterNationalIslamicBank: "",
        ByblosBankSyria: "",
        SyrianArab: "",
        BankofJordan: "",
        BankofSyriaandOverseas: "",
        QatarNationalBank: "",
        Fransabank: "",
    });
    const [BankAccounts, setBankAccount] = useState({
        BanqueBemoSaudiFransi: "",
        AlBarakaSyria: "",
        Cham: "",
        InterNationalIslamicBank: "",
        ByblosBankSyria: "",
        SyrianArab: "",
        BankofJordan: "",
        BankofSyriaandOverseas: "",
        QatarNationalBank: "",
        Fransabank: "",
    });
    const navigate = useNavigate();

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const userType = localStorage.getItem("user-type") ?? "none";


    useEffect(() => {
        const fetchData = async () => {
            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            const formData2 = new FormData();

            formData2.append("patientID", id);

            formData2.append("userID", parseInt(userID));
            formData2.append("userType", userType);
            try {
                const response = await axiosClient.post("/getInfo", formData2);
               
                if (response.status == 200) {
                    setPatientInfo(response.data.Info);
                    setTopPatientInfo(response.data.Info);
                    setFormData(response.data.Info.data);

                    console.log(BankAccounts);
                    if (response.data.hasBank) {
                        setBankAccount(JSON.parse(response.data.Info.Banks));
                    }
                    console.log(BankAccounts);
                    if (localStorage.getItem("user-type") == "patient") {
                        setEditable(true);
                    }
                } else {
                    swalWithBootstrapButtons.fire(
                        response.data.message,
                        "Something went wrong",
                        "error"
                    );
                }
                
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    const ShowBanks = () => {
        setBankModalOpen(true);
    };
    const cancel = () => {
        setBankModalOpen(false);
    };
    const bankAdded = async () => {
        saveBanks();
        setBankModalOpen(false);
    };

    const saveBanks = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        console.log(countt);

        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const formData = new FormData();

        formData.append("Banks", JSON.stringify(BankAccounts)); // Convert to string before appending

        formData.append("userID", parseInt(userID));
        formData.append("userType", userType);
        formData.append("doctorID", parseInt(id));

        const response = await axiosClient.post("/setBanks", formData);
        console.log(response);
        if (response.data.status == 200) {
            swalWithBootstrapButtons.fire(
                "changes saved successfully",
                "Your Bank information has been updated.",
                "success"
            );
            setstartBankAccount(BankAccounts);
        } else {
            swalWithBootstrapButtons.fire(
                response.data.message,
                "Something went wrong",
                "error"
            );
        }
    };
    const cancelBank = () => {
        setCountt(0);
        setBankAccount(startBank);
        setBankModalOpen(false);
    };
    const handleChange = (event) => {
        const { id, value } = event.target;

        // Handle number input for age, ensuring positive values
        console.log(countt);
        setBankAccount((prevData) => ({ ...prevData, [id]: value }));
        const c = Object.values(BankAccounts).filter(
            (value) => value !== ""
        ).length;
        setCountt(c);

        console.log(BankAccounts);
        console.log(c);
    };
    const infoOpen = async () => {
        setModalOpen(true);
    };
   
    if (patientInfo === null) {
        return (
            <div className="data infoPart">
                <div className="data mainInfo">
                    <div className="data imageframe"> </div>
                    <CircularLoading />
                </div>

                <div className="data secondaryInfo">
                    {" "}
                    <CircularLoading />
                </div>
            </div>
        );
    } else {
        return (
            <div className="infoPart">
                <div className="mainInfo">
                    <div className="imageframe">
                        <img src="../images/maleDoctor.jpg" alt="" />
                    </div>

                    <div className="info">
                        <div className="userName">
                            {patientInfo.patient.user_name}
                        </div>
                        <div className="data Name">
                            <span className="Key">Name:</span>
                            {patientInfo.data.firstName}{" "}
                            {patientInfo.data.lastName}
                        </div>
                        <div className="data Age">
                            <span className="Key">Age :</span>
                            {patientInfo.data.age} Years.
                        </div>
                        <div className="data Gender">
                            <span className="Key">Gender :</span>
                            {patientInfo.data.gender}
                        </div>
                        <div className="data Marital">
                            <span className="Key">Marital Status :</span>
                            {patientInfo.data.maritalStatus}
                        </div>
                        <div className="data Phone">
                            <span className="Key">Phone :</span>
                            {patientInfo.data.phoneNumber}
                        </div>
                        <div className="data employmentStatus">
                            <span className="Key">Employment Status :</span>
                            {patientInfo.data.employmentStatus}
                        </div>
                        <div className="data Address">
                            <span className="Key">Address :</span>
                            {patientInfo.data.address}
                        </div>
                    </div>
                </div>

                <div className="secondaryInfo">
                    <div className="title">Informations :</div>
                    <div className="data Education">
                        <span className="Key">Education :</span>

                        {patientInfo.data.education}
                    </div>{" "}
                    <div className="data Children">
                        <span className="Key">children :</span>

                        {patientInfo.data.children}
                    </div>{" "}
                    <div className="data Occupation ">
                        <span className="Key">Occupation :</span>

                        {patientInfo.data.occupation}
                    </div>
                    <div className="data ParentStatus">
                        <span className="Key">Parents Status :</span>

                        {patientInfo.data.parentsStatus
                            ? patientInfo.data.parentsStatus
                            : "none"}
                    </div>{" "}
                    <div className="data pastConditions">
                        <span className="Key">Past Conditions :</span>

                        {patientInfo.data.pastConditions
                            ? patientInfo.data.pastConditions
                            : "none"}
                    </div>
                    <div className="data professionals">
                        <span className="Key">Professionals :</span>

                        {patientInfo.data.professionals
                            ? patientInfo.data.professionals
                            : "none"}
                    </div>
                    <div className="data medications">
                        <span className="Key">Medications :</span>

                        {patientInfo.data.medications
                            ? patientInfo.data.medications
                            : "none"}
                    </div>
                    <div className="data ">
                        <span className="Key">Notes :</span>

                        {patientInfo.data.notes
                            ? patientInfo.data.notes
                            : "none"}
                    </div>
                    <div className="data Buttons">
                        <div className="button Banks">
                            <button type="button" onClick={() => ShowBanks()}>
                                Banks
                            </button>
                        </div>
                        {localStorage.getItem("user-type") === "patient" &&
                        localStorage.getItem("user-id") == id ? (
                            <div className="button Edit">
                                <button
                                    type="button"
                                    onClick={() => infoOpen()}
                                >
                                    Edit Info
                                </button>
                            </div>
                        ) : null}
                        <div className="button Print">
                            <button type="button" onClick={() => downloadPDF()}>
                                Print as pdf
                            </button>
                        </div>
                    </div>
                </div>

                <div className="secondaryInfo">
                    <div className="title">Notes Summarization :</div>
                    <div className="data Education">{summarizationLoad? <CircularLoading/> : notesSummarization}</div>{" "}
                </div>
                {bankModalOpen &&
                localStorage.getItem("user-type") === "patient" &&
                localStorage.getItem("user-id") == id ? (
                    <BanksDetails
                        BankAccounts={BankAccounts}
                        handleChange={handleChange}
                        bankAdded={bankAdded}
                        cancelBank={cancelBank}
                    />
                ) : (
                    bankModalOpen && (
                        <PayForm
                            doctorBanks={BankAccounts}
                            setShowPayContainer={setBankModalOpen}
                            cancelBank={cancel}
                            editable={
                                localStorage.getItem("user-type") ===
                                    "patient" &&
                                localStorage.getItem("user-id") == id
                                    ? true
                                    : false
                            }
                            notUser={true}
                        />
                    )
                )}
                {modalOpen && (
                    <PatientInfo
                        setModalOpen={setModalOpen}
                        editable={editable}
                        setEditable={setEditable}
                        formData={formData}
                        setFormData={setFormData}
                        isLoading={isLoadingInfo}
                    />
                )}
            </div>
        );
    }
};
export default ProfilePatientInfo;
