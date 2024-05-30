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

    for (let week = 0; week < weeksToShow; week++) {
        availableTimes.forEach(({ day, times }) => {
            times.forEach((time) => {
                const [hour, minute] = time.split(":").map(Number);

                // Set event date to the correct day of the week and adjust for multiple weeks
                const eventDate = new Date(today);
                eventDate.setDate(
                    today.getDate() - today.getDay() + day + week * 7
                );
                eventDate.setHours(hour, minute, 0, 0);
                const reserved = reservedTimes.find(
                    (s) =>
                        s.date === eventDate.toISOString() &&
                        s.time === time &&
                        ((left && s.state == "online") ||
                            (!left && s.state == "onsite"))
                );
                if (reserved) {
                    if (reserved.type == "approved") {
                        events.push({
                            title: "reserved",
                            start: eventDate,
                            end: new Date(eventDate.getTime() + 60 * 60 * 1000), // Assume each slot is 1 hour
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
                            end: new Date(eventDate.getTime() + 60 * 60 * 1000), // Assume each slot is 1 hour
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
            });
        });
    }
    console.log(events);
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
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const [onLineSchedule, setOnLineSchedule] = useState([]);
    useEffect(() => {
        console.log(localStorage.getItem("Schedule"));
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
    }, []);

    useEffect(() => {
        console.log(localStorage.getItem("hasInfo"))
        if (!localStorage.getItem("user-info")) {
            navigate("/login");
        } else if (
            localStorage.getItem("user-type") == "patient" &&
            localStorage.getItem("hasInfo")=="false"
        ) {
            setModalOpen(true);
        } else {
            fetchSchedule();
            fetchAppointments();
        }
    }, [localStorage]);
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
            console.log(response.data);
            console.log(response.data.onsiteappointments);
            if (response.data.status == 200) {
                setreservedTimes(response.data.onsiteappointments);
                setDoctor(response.data.doctor);
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
            console.log(response);
            console.log(response.data.onlinsechedules);
            if (response.data.status == 200) {
                setOnLineSchedule(response.data.onlinsechedules);
                setOnSiteSchedule(response.data.onsitesechedules);
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
                    confirmButtonText: "Yes, add!",
                    cancelButtonText: "No, cancel!",
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
                            console.log(response);
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
                            console.log(error);
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
                p
                    ? setonlineSelectedSlots([...onlineselectedSlots, slot])
                    : setonsiteSelectedSlots([...onsiteselectedSlots, slot]);
            }
        }
        console.log(onlineselectedSlots);
        console.log(onsiteselectedSlots);
    };
    const swap = () => {
        setLeft(!left);
    };

    const saveSchedule = async () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
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

            console.log(onlineSelectedData);
            console.log(onsiteSelectedData);

            formData.append("onsite", JSON.stringify(onsiteSelectedData)); // Convert to string before appending
            formData.append("online", JSON.stringify(onlineSelectedData)); // Convert to string before appending
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            formData.append("doctorID", parseInt(id));

            const response = await axiosClient.post(
                "/AddAppointment",
                formData
            );
            if (response.data.status == 200) {
                swalWithBootstrapButtons
                    .fire(
                        "changes saved successfully",
                        "Your schedule has been updated.",
                        "success"
                    )
                    .then(() => {
                        window.location.reload(); // Refresh the page after success
                    });
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
            console.log(response);
        } catch (error) {
            console.error("Error saving schedule:", error);
        }
        setIsSaving(false);
    };
    const editopen = async () => {
        setModalOpen(true);
    }
    return (
        <div className="AppointmentPage">
            <div className="Title">
                <div className="EditInfoButton">
                    <button type="button" onClick={editopen}>

                    Edit Info
                    </button>
                </div>
                <h1 className="Titletext">Set Schedule</h1>
                <div className="form-box">
                    <div className="button-box">
                        <div className={`btn ${left ? "left" : ""}`}></div>
                        <button
                            type="button"
                            className={`toggle-btn ${left ? "" : "selected"}`}
                            onClick={swap}
                        >
                            Onsite
                        </button>
                        <button
                            type="button"
                            className={`toggle-btn ${left ? "selected" : ""}`}
                            onClick={swap}
                        >
                            Online
                        </button>
                    </div>
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
                                                : ""
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
                                                            ? false
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
                                                            ? false
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
                    <button onClick={saveSchedule}>Save Schedule</button>
                </div>
            ) : (
                <></>
            )}
            {modalOpen && <PatientInfo setModalOpen={setModalOpen}  />}
        </div>
    );
};

export default PatientBooking;
