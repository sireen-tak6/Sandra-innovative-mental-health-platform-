import React, { useState, useEffect } from "react";
import axiosClient from "../../axios";
import TimePicker from "react-time-picker";
import "./Schedule.css";
import { useNavigate } from "react-router-dom";
import CircularLoading from "../../Components/loadingprogress/loadingProgress";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
const daysOfWeek = [
    { name: "Sunday", value: 0 },
    { name: "Monday", value: 1 },
    { name: "Tuesday", value: 2 },
    { name: "Wednesday", value: 3 },
    { name: "Thursday", value: 4 },
    { name: "Friday", value: 5 },
    { name: "Saturday", value: 6 },
];

const SecretarySchedule = () => {
    const [onSiteSchedule, setOnSiteSchedule] = useState([]);
    const [onLineSchedule, setOnLineSchedule] = useState([]);
    const [left, setLeft] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isloading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newTime, setNewTime] = useState("07:00");
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("user-info")) {
            navigate("/login");
        } else {
            fetchSchedule();
        }
    }, [navigate]);
    const fetchSchedule = async () => {
        setIsLoading(true);
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const formData = new FormData();
        formData.append("userID", parseInt(userID));
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
            if(response.data.status==200){

                setOnLineSchedule(response.data.onlinsechedules);
                setOnSiteSchedule(response.data.onsitesechedules);
            }
            else{
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
        setIsLoading(false);
    };
    const handleDayChange = (day, time, checked) => {
        const newSchedule = left ? [...onLineSchedule] : [...onSiteSchedule];
        const daySchedule = newSchedule.find((item) => item.day === day) || {
            day,
            times: [],
        };

        if (checked) {
            daySchedule.times.push(time);
        } else {
            daySchedule.times = daySchedule.times.filter((t) => t !== time);
        }

        const updatedSchedule = newSchedule.filter((item) => item.day !== day);
        if (daySchedule.times.length > 0) {
            updatedSchedule.push(daySchedule);
        }

        if (left) {
            setOnLineSchedule(updatedSchedule);
        } else {
            setOnSiteSchedule(updatedSchedule);
        }
        console.log(onLineSchedule);
        console.log(onSiteSchedule);
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
            const onlineScheduleData = JSON.parse(
                JSON.stringify(onLineSchedule)
            ); // Convert to string and parse
            const onsiteScheduleData = JSON.parse(
                JSON.stringify(onSiteSchedule)
            ); // Convert to string and parse

            console.log(onlineScheduleData);
            console.log(onsiteScheduleData);

            formData.append("onsite", JSON.stringify(onsiteScheduleData)); // Convert to string before appending
            formData.append("online", JSON.stringify(onlineScheduleData)); // Convert to string before appending
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            const response = await axiosClient.post(
                "/recurringSchedules",
                formData
            );
            if(response.data.status==200){
                swalWithBootstrapButtons.fire(
                    "changes saved successfully",
                    "Your schedule has been updated.",
                    "success"
                );
                if(onsiteScheduleData.length==0&&onlineScheduleData.length==0){
                    localStorage.setItem(
                        "Schedule","false"
                    );
                }
                else{
                    localStorage.setItem(
                        "Schedule",
                        "true" 
                    );
                }
            }
            else{
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
        setIsSaving(false)
    };

    const renderTimeCheckboxes = (day) => {
        const times = Array.from(
            { length: 18 },
            (_, i) => `${i + 7 < 10 ? "0" : ""}${7 + i}:00`
        );
        const schedule = left ? onLineSchedule : onSiteSchedule;
        const daySchedule = schedule.find((item) => item.day === day.value) || {
            times: [],
        };

        return times
            .concat(daySchedule.times)
            .filter((time, index, self) => self.indexOf(time) === index)
            .map((time) => (
                <div
                    key={`${time}`}
                    className={`time ${
                        daySchedule.times.includes(time) ? "checked" : ""
                    }`}
                >
                    <input
                        type="checkbox"
                        className={`checkbox `}
                        id={`${day.name}-${time}-${left ? "online" : "onsite"}`}
                        checked={daySchedule.times.includes(time)}
                        onChange={(e) =>
                            handleDayChange(day.value, time, e.target.checked)
                        }
                    />
                    <label
                        htmlFor={`${day.name}-${time}-${
                            left ? "online" : "onsite"
                        }`}
                    >
                        {time}
                    </label>
                </div>
            ));
    };

    const swap = () => {
        setLeft(!left);
    };

    const handleAddTimeClick = (day) => {
        setSelectedDay(day);
        setModalOpen(true);
    };

    const handleTimeSelect = () => {
        if (newTime) {
            handleDayChange(selectedDay.value, newTime, true);
            setModalOpen(false);
            setNewTime("07:00");
        }
    };

    return (
        <div className="Schedule">
            <div className="Title">
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
            {isloading?<div className="loader"> <CircularLoading/> </div>:<>
            <div className="days grid3">
                {daysOfWeek.map((day) => (
                    <div key={day.value}>
                        <div className="day">
                            <h3>{day.name}</h3>
                        </div>
                        <div className="grid4">
                            {renderTimeCheckboxes(day)}
                            <div className="time add">
                                <button
                                    type="button"
                                    onClick={() => handleAddTimeClick(day)}
                                >
                                    + Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isSaving?<CircularLoading/>:
            <div className="SaveButton">
                <button onClick={saveSchedule}>Save Schedule</button>
            </div>}
            </>}
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="timeTitle">
                            <h2>Select a time</h2>
                        </div>
                        <div className="timePicker">
                            <TimePicker
                                onChange={setNewTime}
                                value={newTime}
                                disableClock={true}
                                clearIcon={null}
                            />
                        </div>
                        <div className="timeButtons">
                            <button
                                onClick={handleTimeSelect}
                                type="button"
                                className="okButton"
                            >
                                OK
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                type="button"
                                className="cancelButton"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecretarySchedule;
