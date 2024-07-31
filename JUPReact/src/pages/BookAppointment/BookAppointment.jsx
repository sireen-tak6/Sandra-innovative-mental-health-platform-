import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./BookAppointment.css";
import axiosClient from "../../axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import CircularLoading from "../../Components/loadingprogress/loadingProgress";
import PatientInfo from "../../Components/PatientInfo/PatientInfo";
import BanksDetails from "../../Components/BanksDetails/BanksDetails";
import PayForm from "../../Components/Forms/PayForm/PayForm";
/* 
 waiting{'patientID'=>'waiting','doctor'=>'waiting','secretary'=>'waiting','patient'=>'available'}
reserved{'patientID'=>'approved','patient'=>reserved,'doctor'=>'reserved','secretary'=>'reserved'}
available{'all'=>'available'}
}
  */
const generateEvents = (
    availableTimes,
    reservedTimes,
    left,
    weeksToShow = 8
) => {
    const events = [];
    const today = new Date();
    const todayTimestamp = today.getTime();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set date to tomorrow
    const tomorrowTimestamp = tomorrow.getTime();

    for (let week = 0; week < weeksToShow; week++) {
        availableTimes.forEach(({ day, times }) => {
            times.forEach((time) => {
                const [hour, minute] = time.split(":").map(Number);

                // Set event date to the correct day of the week and adjust for multiple weeks
                const eventDate = new Date(tomorrow);
                eventDate.setDate(
                    tomorrow.getDate() - tomorrow.getDay() + day + week * 7
                );

                eventDate.setHours(hour, minute, 0, 0);
                if (eventDate.getTime() >= tomorrowTimestamp) {
                    const reserved = reservedTimes.find(
                        (s) =>
                            (s.date === eventDate.toISOString() &&
                                s.time === time &&
                                !left &&
                                s.state == "onsite") ||
                            (s.date === eventDate.toISOString() &&
                                s.time === time &&
                                left &&
                                s.state == "online")
                    );
                    if (reserved) {
                        if (reserved.type == "approved") {
                            events.push({
                                title: "reserved",
                                start: eventDate,
                                end: new Date(
                                    eventDate.getTime() + 60 * 60 * 1000
                                ), // Assume each slot is 1 hour
                                extendedProps: {
                                    day,
                                    time,
                                    patientId: reserved.patientID,
                                    state: reserved.type, // Add patientId for reserved events
                                },
                            });
                        } else {
                            events.push({
                                title: "available",
                                start: eventDate,
                                end: new Date(
                                    eventDate.getTime() + 60 * 60 * 1000
                                ), // Assume each slot is 1 hour
                                extendedProps: {
                                    day,
                                    time,
                                    patientId: reserved.patientID,
                                    state: reserved.type, // Add patientId for reserved events
                                },
                            });
                        }
                    } else {

                        events.push({
                            title: "available",
                            start: eventDate,
                            end: new Date(eventDate.getTime() + 60 * 60 * 1000), // Assume each slot is 1 hour
                            extendedProps: {
                                day,
                                time,
                            },
                        });
                    }
                }
            });
        });
    }
    return events;
};

const PatientBooking = () => {
    const { id } = useParams();

    const [reservedTimes, setreservedTimes] = useState([]);

    const [left, setLeft] = useState(false);
    const [onlineselectedSlots, setonlineSelectedSlots] = useState([]);
    const [onsiteselectedSlots, setonsiteSelectedSlots] = useState([]);
    const [doctor, setDoctor] = useState(null);
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsloading] = useState(false);

    const userID = localStorage.getItem("user-id");
    const userType = localStorage.getItem("user-type");
    const [onSiteSchedule, setOnSiteSchedule] = useState([]);
    const [bankModalOpen, setBankModalOpen] = useState(false);
    const [time, setTime] = useState(null);
    const [cost, setCost] = useState(null);
    const [type, setType] = useState(null);
    const [isClicked, setIsClicked] = useState(false);
    const [countt, setCountt] = useState(0);
    const [editable, setEditable] = useState(false);
    const [isLoadingInfo, setIsLoadingInfo] = useState(false);
    const [userName, setUserName] = useState("");
    const [showPayContainer, setShowPayContainer] = useState(false);
    const [doctorBankAccounts, setDoctorBankAccount] = useState({});
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
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const [onLineSchedule, setOnLineSchedule] = useState([]);
    useEffect(() => {
        if (localStorage.getItem("Schedule") == "false") {
            swalWithBootstrapButtons
                .fire({
                    title: "you first need to add your Schedule",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonText: "Add Schedule!",
                    reverseButtons: false,
                })
                .then(navigate("/Schedule"));
        }
        if (
            localStorage.getItem("user-type") == "patient" &&
            localStorage.getItem("hasInfo") == "true"
        ) {
            getInfo();
            setEditable(true);
        } else if (localStorage.getItem("user-type") == "patient") {
            setEditable(true);
        }
    }, []);

    useEffect(() => {
        if (!localStorage.getItem("user-info")) {
            navigate("/login");
        } else if (
            localStorage.getItem("user-type") == "patient" &&
            localStorage.getItem("hasInfo") == "false"
        ) {
            setModalOpen(true);
        } else {
            fetchSchedule();
            fetchAppointments();
        }
    }, [localStorage]);
    const hasReserved = (userID) => {
        return (
            reservedTimes.some(
                (s) =>
                    s.patientID == userID &&
                    s.type != "past" &&
                    s.type != "done"
            ) ||
            onlineselectedSlots.length > 0 ||
            onsiteselectedSlots.length > 0
        );
    };

    const getInfo = async (patientID) => {
        setIsLoadingInfo(true);
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        // Use HTML5 form validation (automatic)
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const formData2 = new FormData();

        if (patientID) {
            formData2.append("patientID", patientID);
        }
        formData2.append("userID", parseInt(userID));
        formData2.append("userType", userType);
        const response = await axiosClient.post("/getInfo", formData2);
        if (response.status == 200) {
            setFormData(response.data.Info.data);
            if (response.data.Info.patient.id) {
                setUserName(response.data.Info.patient.user_name);
            }
            if (response.data.hasBank) {
                setBankAccount(JSON.parse(response.data.Info.Banks));
                setstartBankAccount(JSON.parse(response.data.Info.Banks));
            }
      
        } else {
            swalWithBootstrapButtons.fire(
                response.data.message,
                "Something went wrong",
                "error"
            );
        }
        setIsLoadingInfo(false);
    };

    const [modalOpen, setModalOpen] = useState(false);
    const fetchAppointments = async () => {
        const formData = new FormData();
        formData.append("userID", parseInt(userID));
        formData.append("doctorID", parseInt(id));
        formData.append("userType", userType);
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        try {
            const response = await axiosClient.post(
                "getReservedAppointments",
                formData
            );
                    console.log(response)

            if (response.data.status == 200) {
                setreservedTimes(response.data.onsiteappointments);
                setDoctor(response.data.doctor);
                setDoctorBankAccount(JSON.parse(response.data.doctor.Banks));
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
        } catch (error) {
        
           console.error("Error fetching doctors:", error.message);
        }
        setIsloading(false);
    };

    const fetchSchedule = async () => {
        setIsloading(true);

        const formData = new FormData();
        formData.append("userID", parseInt(userID));
        formData.append("doctorID", parseInt(id));
        formData.append("userType", userType);
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        try {
            const response = await axiosClient.post("getSchedules", formData);
            console.log(response)
            if (response.data.status == 200) {
                setOnLineSchedule(response.data.onlinsechedules);
                setOnSiteSchedule(response.data.onsitesechedules);
                setCost(response.data.doctor.cost);
                setTime(response.data.doctor.time);
                setType(response.data.doctor.timeType);
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
        } catch (error) {
           console.error("Error fetching doctors:", error);
        }
    };
    const handleEventClick = (info) => {
        const p = left;
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        const { start } = info.event;
        const slot = {
            date: start.toISOString(),
            time: info.event.extendedProps.time,
            day: info.event.extendedProps.day,
        };
        const isReserved = p
            ? reservedTimes.some(
                  (s) =>
                      s.date === slot.date &&
                      s.time === slot.time &&
                      s.state == "online" &&
                      s.patientID == userID
              )
            : reservedTimes.some(
                  (s) =>
                      s.date === slot.date &&
                      s.time === slot.time &&
                      s.state == "onsite" &&
                      s.patientID == userID
              );
        if (isReserved) {
            swalWithBootstrapButtons
                .fire({
                    title: "Are you sure?",
                    text: "Do you want to delete this appointment!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Delete!",
                    cancelButtonText: "No, Cancel!",
                    reverseButtons: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const formData = new FormData();

                        formData.append("userID", parseInt(userID));
                        formData.append("doctorID", parseInt(id));
                        formData.append("userType", userType);
                        formData.append("date", slot.date);
                        formData.append("time", slot.time);
                        formData.append("state", left ? "online" : "onsite");
                        try {
                            const response = await axiosClient.post(
                                "/DeleteAppointment",
                                formData
                            );
                            if (response.data.status === 200) {
                                swalWithBootstrapButtons
                                    .fire(
                                        "Appointment Deleted.",
                                        "The appointment has been deleted successfully.",
                                        "success"
                                    )
                                    .then(() => {
                                        window.location.reload(); // Refresh the page after success
                                    });
                            } else {
                                swalWithBootstrapButtons.fire(
                                    response.data.message,
                                    "Your changes has not been saved",
                                    "error"
                                );
                            }
                        } catch (error) {
                            swalWithBootstrapButtons.fire(
                                error.response.data.message,
                                "error"
                            );
                        }
                    }
                });
        } else {
            const isSelected = p
                ? onlineselectedSlots.some(
                      (s) => s.date === slot.date && s.time === slot.time
                  )
                : onsiteselectedSlots.some(
                      (s) => s.date === slot.date && s.time === slot.time
                  );

            if (isSelected) {
                p
                    ? setonlineSelectedSlots(
                          onlineselectedSlots.filter(
                              (s) =>
                                  !(
                                      s.date === slot.date &&
                                      s.time === slot.time
                                  )
                          )
                      )
                    : setonsiteSelectedSlots(
                          onsiteselectedSlots.filter(
                              (s) =>
                                  !(
                                      s.date === slot.date &&
                                      s.time === slot.time
                                  )
                          )
                      );
            } else {
                if (!hasReserved(userID)) {
                    p
                        ? setonlineSelectedSlots([...onlineselectedSlots, slot])
                        : setonsiteSelectedSlots([
                              ...onsiteselectedSlots,
                              slot,
                          ]);
                }
            }
        }
 
    };
    const swap = () => {
        setLeft(!left);
    };
    const displayPayment = () => {
        if (userType == "patient") {
            if (onlineselectedSlots.length > 0) {
                setShowPayContainer(true);
            } else {
                AddAppointment("cash");
            }
        } else {
            AddAppointment("cash");
        }
    };
    const AddAppointment = async (pay) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        if (
            isClicked &&
            ((onlineselectedSlots.length > 0 &&
                Object.values(BankAccounts).filter((value) => value !== "")
                    .length > 0) ||
                onlineselectedSlots.length == 0)
        ) {
            setIsSaving(true);
            try {
                const userID = localStorage.getItem("user-id");
                const userType = localStorage.getItem("user-type");
                const formData = new FormData();
                const onlineSelectedData = JSON.parse(
                    JSON.stringify(onlineselectedSlots)
                ); // Convert to string and parse
                const onsiteSelectedData = JSON.parse(
                    JSON.stringify(onsiteselectedSlots)
                ); // Convert to string and parse

        

                formData.append("onsite", JSON.stringify(onsiteSelectedData));
                formData.append("online", JSON.stringify(onlineSelectedData));
                formData.append("userID", parseInt(userID));
                formData.append("userType", userType);
                formData.append("doctorID", parseInt(id));
                formData.append("pay", pay);

                const response = await axiosClient.post(
                    "/AddAppointment",
                    formData
                );
                console.log(response)
                if (response.data.status == 200) {
                    swalWithBootstrapButtons
                        .fire(
                            "changes saved successfully",
                            "Your schedule has been updated.",
                            "success"
                        )
                        .then(() => {
                            window.location.reload();
                        });
                } else {
                    swalWithBootstrapButtons.fire(
                        response.data.message,
                        "Something went wrong",
                        "error"
                    );
                }
            } catch (error) {
               Error("Error saving schedule:", error);
            }
        }
        setIsSaving(false);
    };
    const editopen = async () => {
        setModalOpen(true);
    };

    const bankAdded = async () => {
        if (isClicked) {
            saveBanks();
            setBankModalOpen(false);
            checkBanks();
        } else {
            saveBanks();
            setBankModalOpen(false);
        }
    };
    const saveBanks = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
  
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const formData = new FormData();

        formData.append("Banks", JSON.stringify(BankAccounts)); // Convert to string before appending

        formData.append("userID", parseInt(userID));
        formData.append("userType", userType);
        formData.append("doctorID", parseInt(id));

        const response = await axiosClient.post("/setBanks", formData);
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
        setIsClicked(false);
        setBankModalOpen(false);
    };
    const handleChange = (event) => {
        const { id, value } = event.target;

        // Handle number input for age, ensuring positive values
        setBankAccount((prevData) => ({ ...prevData, [id]: value }));
        const c = Object.values(BankAccounts).filter(
            (value) => value !== ""
        ).length;
        setCountt(c);

      
    };

    const checkBanks = () => {
        setIsClicked(true);
        if (
            (onlineselectedSlots.length > 0 &&
                Object.values(BankAccounts).filter((value) => value !== "")
                    .length > 0) ||
            onlineselectedSlots.length == 0
        ) {
            displayPayment();
        } else if (onlineselectedSlots.length > 0) {
            setBankModalOpen(true);
        }
    };

    const openBanks = (event) => {
        setBankModalOpen(true);
    };
    return (
        <div className="AppointmentPage">
            <div className="Title">
                {userType == "patient" ? (
                    <>
                        <div className="EditInfoButton">
                            <button type="button" onClick={editopen}>
                                Edit Info
                            </button>
                        </div>
                        <div className="AddBankButton">
                            <button type="button" onClick={openBanks}>
                                Banks Account
                            </button>
                        </div>
                    </>
                ) : null}

                <h1 className="Titletext">New Appointment</h1>
                <div className="form-box">
                    {userType == "patient" ? (
                        <div className="button-box">
                            <div className={`btn ${left ? "left" : ""}`}></div>
                            <button
                                type="button"
                                className={`toggle-btn ${
                                    left ? "" : "selected"
                                }`}
                                onClick={swap}
                            >
                                Onsite
                            </button>
                            <button
                                type="button"
                                className={`toggle-btn ${
                                    left ? "selected" : ""
                                }`}
                                onClick={swap}
                            >
                                Online
                            </button>
                        </div>
                    ) : (
                        <div className={`btnText`}>Onsite</div>
                    )}
                </div>
            </div>
            <div className="calendar">
                {isLoading ? (
                    <CircularLoading />
                ) : (
                    <>
                        {left ? (
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                initialView="dayGridWeek"
                                headerToolbar={{
                                    left: "customTitle",
                                    center: "title",
                                }}
                                customButtons={{
                                    customTitle: {
                                        text: `${
                                            doctor !== null
                                                ? doctor.user_name
                                                : userName
                                        }`,
                                    },
                                }}
                                events={generateEvents(
                                    onLineSchedule,
                                    reservedTimes,
                                    left
                                )}
                                eventContent={(info) => {
                                    const isSelected = onlineselectedSlots.some(
                                        (slot) =>
                                            new Date(slot.date).getTime() ===
                                            info.event.start.getTime()
                                    );
                                    const State = info.event.title;
                                    const patientID =
                                        info.event.extendedProps.patientId;
                                    const type =
                                        info.event.extendedProps.state ?? null;
                                    return (
                                        <div
                                            className={`checkboxContainter ${
                                                type == "waiting"
                                                    ? patientID != userID &&
                                                      userType == "patient"
                                                        ? "available"
                                                        : "waiting"
                                                    : type == "approved"
                                                    ? patientID == userID ||
                                                      (patientID == null &&
                                                          (userType ==
                                                              "doctor" ||
                                                              userType ==
                                                                  "secretary"))
                                                        ? "approved"
                                                        : "reserved"
                                                    : isSelected
                                                    ? "selected"
                                                    : "available"
                                            }Container                                                              
                                    `}
                                        >
                                            <div
                                                onClick={
                                                    type == "waiting" ||
                                                    patientID == userID ||
                                                    State == "available"
                                                        ? () =>
                                                              handleEventClick(
                                                                  info
                                                              )
                                                        : () => {}
                                                }
                                                className={`checkbox 
                                        ${
                                            type == "waiting"
                                                ? patientID != userID &&
                                                  userType == "patient"
                                                    ? "available"
                                                    : "waiting"
                                                : type == "approved"
                                                ? patientID == userID ||
                                                  (patientID == null &&
                                                      (userType == "doctor" ||
                                                          userType ==
                                                              "secretary"))
                                                    ? "approved"
                                                    : "reserved"
                                                : isSelected
                                                ? "selected"
                                                : "available"
                                        }             
                                       `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="check"
                                                    checked={
                                                        isSelected ||
                                                        patientID == userID ||
                                                        (patientID == null &&
                                                            type &&
                                                            (userType ==
                                                                "doctor" ||
                                                                userType ==
                                                                    "secretary"))
                                                    }
                                                    readOnly
                                                    disabled={
                                                        type != "approved" ||
                                                        patientID == userID
                                                            ? !hasReserved(
                                                                  userID
                                                              ) ||
                                                              (hasReserved(
                                                                  userID
                                                              ) &&
                                                                  type !=
                                                                      "available" &&
                                                                  type != null)
                                                                ? false
                                                                : true
                                                            : true
                                                    }
                                                />
                                                {info.timeText}m
                                            </div>
                                            {type == "waiting"
                                                ? patientID != userID &&
                                                  userType == "patient"
                                                    ? ""
                                                    : "pending"
                                                : type == "approved"
                                                ? patientID == userID ||
                                                  (patientID == null &&
                                                      (userType == "doctor" ||
                                                          userType ==
                                                              "secretary"))
                                                    ? "approved"
                                                    : "reserved"
                                                : ""}
                                        </div>
                                    );
                                }}
                            />
                        ) : (
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                initialView="dayGridWeek"
                                events={generateEvents(
                                    onSiteSchedule,
                                    reservedTimes,
                                    left
                                )}
                                headerToolbar={{
                                    left: "customTitle",
                                    center: "title",
                                }}
                                customButtons={{
                                    customTitle: {
                                        text: `${
                                            doctor !== null
                                                ? doctor.user_name
                                                : ""
                                        }`,
                                    },
                                }}
                                eventContent={(info) => {
                                    const isSelected = onsiteselectedSlots.some(
                                        (slot) =>
                                            new Date(slot.date).getTime() ===
                                            info.event.start.getTime()
                                    );
                                    const State = info.event.title;
                                    const patientID =
                                        info.event.extendedProps.patientId;
                                    const type = info.event.extendedProps.state;

                                    return (
                                        <div
                                            className={`checkboxContainter ${
                                                type == "waiting"
                                                    ? patientID != userID &&
                                                      userType == "patient"
                                                        ? "available"
                                                        : "waiting"
                                                    : type == "approved"
                                                    ? patientID == userID ||
                                                      (patientID == null &&
                                                          (userType ==
                                                              "doctor" ||
                                                              userType ==
                                                                  "secretary"))
                                                        ? "approved"
                                                        : "reserved"
                                                    : isSelected
                                                    ? "selected"
                                                    : "available"
                                            }Container 
                                             
                                      
                                                             
                                    `}
                                        >
                                            <div
                                                onClick={
                                                    type == "waiting" ||
                                                    patientID == userID ||
                                                    State == "available"
                                                        ? () =>
                                                              handleEventClick(
                                                                  info
                                                              )
                                                        : () => {}
                                                }
                                                className={`checkbox 
                                        ${
                                            type == "waiting"
                                                ? patientID != userID &&
                                                  userType == "patient"
                                                    ? "available"
                                                    : "waiting"
                                                : type == "approved"
                                                ? patientID == userID ||
                                                  (patientID == null &&
                                                      (userType == "doctor" ||
                                                          userType ==
                                                              "secretary"))
                                                    ? "approved"
                                                    : "reserved"
                                                : isSelected
                                                ? "selected"
                                                : "available"
                                        }             
                                        `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="check"
                                                    checked={
                                                        isSelected ||
                                                        patientID == userID ||
                                                        (patientID == null &&
                                                            type &&
                                                            (userType ==
                                                                "doctor" ||
                                                                userType ==
                                                                    "secretary"))
                                                    }
                                                    readOnly
                                                    disabled={
                                                        type != "approved" ||
                                                        patientID == userID
                                                            ? !hasReserved(
                                                                  userID
                                                              ) ||
                                                              (hasReserved(
                                                                  userID
                                                              ) &&
                                                                  type !=
                                                                      "available" &&
                                                                  type != null)
                                                                ? false
                                                                : true
                                                            : true
                                                    }
                                                />
                                                {info.timeText}m
                                            </div>
                                            {type == "waiting"
                                                ? patientID != userID &&
                                                  userType == "patient"
                                                    ? ""
                                                    : "pending"
                                                : type == "approved"
                                                ? patientID == userID ||
                                                  (patientID == null &&
                                                      (userType == "doctor" ||
                                                          userType ==
                                                              "secretary"))
                                                    ? "approved"
                                                    : "reserved"
                                                : ""}
                                        </div>
                                    );
                                }}
                            />
                        )}
                    </>
                )}
            </div>

            {isSaving ? (
                <CircularLoading />
            ) : !isLoading ? (
                <div className="SaveButton">
                    <button type="button" onClick={checkBanks}>
                        Add Appointment
                    </button>
                </div>
            ) : (
                <></>
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
            {bankModalOpen && (
                <BanksDetails
                    BankAccounts={BankAccounts}
                    handleChange={handleChange}
                    bankAdded={bankAdded}
                    cancelBank={cancelBank}
                />
            )}
            {showPayContainer && (
                <PayForm
                    doctorBanks={doctorBankAccounts}
                    appointment={onlineselectedSlots[0]}
                    setShowPayContainer={setShowPayContainer}
                    AddAppointment={AddAppointment}
                    time={time}
                    type={type}
                    cost={cost}
                    cancelBank={cancelBank}
                    editable={true}
                />
            )}
        </div>
    );
};

export default PatientBooking;
