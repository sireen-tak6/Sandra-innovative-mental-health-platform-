// src/components/PatientBooking.js
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const PatientBooking = () => {
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState([
        { day: 1, times: ["12:00", "15:00"] },
        { day: 4, times: ["13:00", "14:00", "15:00"] },
        { day: 5, times: ["15:00"] },
    ]);
    useEffect(() => {fetchSchedules()}, []);

    const fetchSchedules = async () => {
        try {
            const events = schedules.flatMap((schedule) => {
                console.log(schedule)
                return schedule.times.map((time) => ({
                    title: "Available",
                    start: moment()
                        .day(schedule.day)
                        .hour(parseInt(time.split(":")[0]))
                        .minute(0)
                        .toDate(),
                    end: moment()
                        .day(schedule.day)
                        .hour(parseInt(time.split(":")[0]))
                        .minute(59)
                        .toDate(),
                }));
            });
            setEvents(events);
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    };

    const handleSelectSlot = async ({ start, end }) => {
        const confirm = window.confirm("Do you want to book this appointment?");
        if (confirm) {
            try {
                console.log(start)
                console.log(end)
                await axios.post("/api/appointments", {
                    user_id: 1, // Replace with actual user ID from authentication context
                    start,
                    end,
                });
                alert("Appointment booked successfully!");
            } catch (error) {
                console.error("Error booking appointment:", error);
            }
        }
    };

    return (
        <div>
            <h1>Book Appointment</h1>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                views={["week"]}
                defaultView="week"
                onSelectSlot={handleSelectSlot}
                slotPropGetter={(date) => {
                    const day = date.getDay();
                    if (![1, 5].includes(day)) {
                        return {
                            style: {
                                backgroundColor: "#f0f0f0",
                                pointerEvents: "none",
                            },
                        };
                    }
                    return {};
                }}
            />
        </div>
    );
};

export default PatientBooking;
