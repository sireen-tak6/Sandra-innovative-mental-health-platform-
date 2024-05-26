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

//components

const Appointments = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const navigate = useNavigate();

    const userID = localStorage.getItem("user-id");
    const userType = localStorage.getItem("user-type");
    const [Appointments, setAppointments] = useState([]);
    const [Type, setType] = useState(0);
    useEffect(() => {
        if (!localStorage.getItem("user-info")) {
            navigate("/login");
        } else {
            fetchAppointments();
        }
    }, [navigate]);
    const fetchAppointments = async () => {
        setIsloading(true);
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
                                patient: { user_name: "name" },
                                time: "time",
                                day: 7,
                                date: "date",
                                state: "state",
                                type: "type",
                            }}
                            last={false}
                            first={true}
                        />
                        {Appointments.map((appointment, index) => (
                            <AppointmentCard
                                item={appointment}
                                last={index === Appointments.length - 1}
                            />
                        ))}
                    </div>
                )}{" "}
            </Appointmentsprov>
        </div>
    );
};
export default Appointments;
