import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./Appointments.css";
import AppointmentsTypes from "../../Components/Appointments/AppointmentsTypes/AppointmentsTypes";
import Appointmentsprov from "../../Providers/Appointmentsprov";
import CircularLoading from "../../Components/loadingprogress/loadingProgress";
import AppointmentCard from "../../Components/Appointments/AppointmentCard/AppointmentCard";
import PatientInfo from "../../Components/PatientInfo/PatientInfo";
import PayForm from "../../Components/Forms/PayForm/PayForm";
import AppointmentInfo from "../../Components/Appointments/AppointmentInfo/AppointmentInfo";

//components

const Appointments = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [appointment, setAppointment] = useState(null);
    const [doctorBanks, setdoctorBanks] = useState(false);
    const [showPayContainer, setShowPayContainer] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [userName, setUserName] = useState(null);
    const [isLoadingInfo, setIsLoadingInfo] = useState(false);
    const navigate = useNavigate();
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const userID = localStorage.getItem("user-id");
    const userType = localStorage.getItem("user-type");
    const [Appointments, setAppointments] = useState([]);
    const [Type, setType] = useState(0);
    const [patientID, setPatientID] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [editable, setEditable] = useState(false);

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
    useEffect(() => {
        if (!localStorage.getItem("user-info")) {
            navigate("/login");
        } else {
            fetchAppointments();
        }
    }, [navigate]);
    useEffect(() => {
        if (
            localStorage.getItem("user-type") == "patient" &&
            localStorage.getItem("hasInfo") == "true"
        ) {
            setEditable(true);
        } else if (localStorage.getItem("user-type") == "patient") {
            setEditable(true);
        }
    }, []);

    const fetchAppointments = async () => {
        setIsloading(true);
        const formData = new FormData();
        formData.append("userID", parseInt(userID));
        formData.append("userType", userType);
        formData.append("type", Type);

        try {
            const response = await axiosClient.post(
                "getReservedAppointments",
                formData
            );
            console.log(response);
            console.log(response.data.onsiteappointments);
            if (response.data.status == 200) {
                setAppointments(response.data.onsiteappointments);
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);
            console.error("Error fetching doctors:", error.message);
        }
        setIsloading(false);
    };
    useEffect(() => {
        console.log(Type);
        fetchAppointments();
    }, [Type]);
    const cancel = () => {
        setShowPayContainer(false);
    };
    
    return (
        <div className="Appointments">
            <Appointmentsprov value={Type} onUpdate={setType}>
                <div className="TypesPart">
                    <AppointmentsTypes />
                </div>
                {isLoading ? (
                    <CircularLoading />
                ) : (
                    <div className="AppointmentsPart">
                        <AppointmentCard
                            item={{
                                patient: { user_name: "Patient" },
                                doctor: { user_name: "Doctor" },
                                time: "Time",
                                day: 7,
                                date: "Date",
                                state: "State",
                                cost: "Cost",
                                type: "Type",
                                duration: "Duration",
                                paid: "Paid",
                                now: true,
                            }}
                            last={false}
                            first={true}
                        />
                        {Appointments.map((appointment, index) => (
                            <AppointmentCard
                                item={appointment}
                                last={index === Appointments.length - 1}
                                setPatientId={setPatientID}
                                setModalOpen={setModalOpen}
                                formData={formData}
                                setFormData={setFormData}
                                setIsLoadingInfo={setIsLoadingInfo}
                                setUserName={setUserName}
                                setShowPayContainer={setShowPayContainer}
                                setAppointment={setAppointment}
                                setBanks={setdoctorBanks}
                                showPayContainer={showPayContainer}
                                Banks={doctorBanks}
                                setShowInfo={setShowInfo}
                            />
                        ))}
                    </div>
                )}{" "}
            </Appointmentsprov>
            {showInfo && (
                <AppointmentInfo
                    appointment={appointment}
                    setShowInfo={setShowInfo}
                    setPatientId={setPatientID}
                    setModalOpen={setModalOpen}
                    setAppointment={setAppointment}
                    setBanks={setdoctorBanks}
                    setShowPayContainer={setShowPayContainer}
                />
            )}
                {showPayContainer && (
                    <PayForm
                        doctorBanks={doctorBanks}
                        appointment={appointment}
                        setShowPayContainer={setShowPayContainer}
                        cancelBank={cancel}
                        editable={false}
                    />
                )}
            {modalOpen && (
                <PatientInfo
                    setModalOpen={setModalOpen}
                    editable={editable}
                    setFormData={setFormData}
                    formData={formData}
                    isLoading={isLoadingInfo}
                    userName={userName}
                />
            )}
           
        </div>
    );
};
export default Appointments;
