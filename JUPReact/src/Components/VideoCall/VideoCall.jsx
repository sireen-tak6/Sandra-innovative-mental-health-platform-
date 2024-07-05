import { React, useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import "./VideoCall.css";
import { useLocation } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../../axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import NotesForm from "../Forms/NotesForm/NotesForm";

const bg = "../assetss/forhome.png";

export default function VideoCall() {
    const [RoomID, setRoomID] = useState(null); // Unique user ID for the other person
    const [startTime, setStartTime] = useState(null); // Duration in seconds
    const [startBreakTime, setStartBreakTime] = useState(null); // Duration in seconds
    const [appointment, setAppointment] = useState(null);
    const [theAppointment, setTheAppointment] = useState(null);
    const [callStarted, setCallStarted] = useState(false);
    const [NotesOpen, setNotesOpen] = useState(false);
    const [NotesDone, setNotesDone] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userType = localStorage.getItem("user-type");
    const userID = localStorage.getItem("user-id");

    const userName = localStorage.getItem("user-name");
    const doctorID = location.state?.doctorID;
    const patientID = location.state?.patientID;
    const roomJoinedRef = useRef(false);
    const startTimeRef = useRef(null);
    const startBreakTimeRef = useRef(null);
    const callDuration = useRef(0);
    const callBreakDuration = useRef(0);
    const UsersCount = useRef(1);

    useEffect(() => {
        if (doctorID !== null && patientID !== null) {
            appointmentCheck();
            if (appointment == false) {
                navigate(`/newAppointment/${doctorID}`);
            }
        }
    }, [doctorID, patientID]);

    useEffect(() => {
        if (startBreakTimeRef.current) {
            const checkBreakDuration = setInterval(() => {
                const currentTime = new Date();
                const breakDuration = currentTime.getTime() - startBreakTimeRef.current.getTime();
                if (breakDuration >= 15 * 60 * 1000) {
                    endSession(true);
                    clearInterval(checkBreakDuration);
                }
            }, 60000);
            return () => clearInterval(checkBreakDuration);
        }
    }, [startBreakTimeRef.current]);

    const appointmentCheck = async () => {
        const formData = new FormData();
        formData.append("patientID", parseInt(patientID));
        formData.append("doctorID", parseInt(doctorID));
        const response = await axiosClient.post(`/haveAppointment`, formData);
    
        if (response.data.status == 200) {
            setAppointment(response.data.haveAccount);
            setTheAppointment(response.data.appointment);
            const mergedId = `${response.data.appointment.id}-${response.data.appointment.patientID}-${response.data.appointment.doctorID}`;
            setRoomID(mergedId);
            console.log(response.data.appointment);
        }
    };
    const [appSign, setAppSign] = useState(
        "9af50e2e542304651cb6deb38dd297ca187538006230e8cf6879e1dbd59b3e1b"
    );

    let myMeeting = async (element) => {
        if (!RoomID || roomJoinedRef.current) {
            return;
        }
        roomJoinedRef.current = true;

        // generate Kit Token
        const appID = 1079263476;

        const serverSecret = "420074fe9fc9ec6527ba27fcdde454d0";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            RoomID,
            userID.toString(),
            userName
        );
        let zp;
        try {
            zp = ZegoUIKitPrebuilt.create(kitToken);
        } catch (error) {
            console.error("Error creating ZegoUIKitPrebuilt instance:", error);
            return; // Handle error gracefully (e.g., display an error message)
        }

        if (UsersCount.current==2) {
            const today = new Date();
            startTimeRef.current = today;
            console.log("Call started at: ", startTimeRef.current);
        }        
        if (UsersCount.current==1) {
            const today = new Date();
            startBreakTimeRef.current = today;
            console.log("Call Break started at: ", startBreakTimeRef.current);
        }
        setCallStarted(true);

        zp.joinRoom({
            container: element,
            showScreenSharingButton:false,
            showTextChat: true,
            maxUsers: 2,

            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
                config: {
                    role: "Host",
              },
            },
            onUserJoin: () => {
                UsersCount.current = UsersCount.current + 1;
                if (UsersCount.current==2) {
                    const today = new Date();
                    startTimeRef.current = today;
                }
                if (startBreakTimeRef.current) {
                    startBreakTimeRef.current=null;
                }
                console.log("newAdded");
                console.log(UsersCount.current);
                console.log(startBreakTimeRef.current);
            },
            onUserLeave: () => {
                UsersCount.current = UsersCount.current - 1;
                console.log("remove");
                console.log(UsersCount.current);
                if (UsersCount.current==1) {
                    const today = new Date();
                    startBreakTimeRef.current = today;
                }
                if (startTimeRef.current) {
                    const endTimetoday = new Date();
                    console.log("Call ended at: ", endTimetoday);
                    const durationInSeconds =
                        endTimetoday.getTime() - startTimeRef.current.getTime();

                        callDuration.current += durationInSeconds;
                        console.log(
                        "Call duration in seconds: ",
                        callDuration.current
                    );
                }
            },
            onLeaveRoom: () => {
                setCallStarted(false);
                roomJoinedRef.current = false; // Reset ref when leaving the room
                if (UsersCount.current == 2 && startTimeRef.current) {
                    const endTimetoday = new Date();
                    console.log("Call ended at: ", endTimetoday);
                    const durationInSeconds =
                        endTimetoday.getTime() - startTimeRef.current.getTime();

                    callDuration.current=callDuration.current+durationInSeconds;
                    console.log(
                        "Call duration in seconds: ",
                        callDuration.current
                    );
                }
                const durationInMinutes = (
                    callDuration.current /
                    1000 /
                    60
                ).toFixed(2);
                if (callDuration.current) {
                    const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                            confirmButton: "btn btn-success",
                            cancelButton: "btn btn-danger",
                        },
                        buttonsStyling: false,
                    });
                    swalWithBootstrapButtons
                        .fire({
                            title: "Session Action",
                            text: "Do you want to end the session or take a break?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Take a Break",
                            cancelButtonText: "End Session",
                            reverseButtons: true,
                        })
                        .then(async (result) => {
                            if (result.isConfirmed) {
                                const formData = new FormData();
                                const userID = localStorage.getItem("user-id");
                                const userType =
                                    localStorage.getItem("user-type");
                                const appointmentID = theAppointment.id;
                                formData.append(
                                    "appointmentID",
                                    parseInt(appointmentID)
                                ); // Convert to string before appending
                                formData.append("userID", parseInt(userID));
                                formData.append("userType", userType);
                                formData.append(
                                    "duration",
                                    durationInMinutes ?? null
                                );
                                const response = await axiosClient.post(
                                    `/breakSession`,
                                    formData
                                );
                                console.log(response);
                                if (response.data.status == 200) {
                                    if( localStorage.setItem(
                                        "receverDoctor",
                                        response.data.chat.doctor_id
                                    )){

                                        navigate("/chat/messages");
                                    }
                                    else{
                                        navigate("/Appointments")
                                    }
                                }
                            } else {
                                if (userType == "doctor") {
                                    setNotesOpen(true);
                                }
                                if (userType !== "doctor") {
                                    endSession();
                                }
                            }
                        });
                }
            },
        });
    };
    const endSession = async (breakLimit) => {
        const formData = new FormData();
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const appointmentID = theAppointment.id;
        const durationInMinutes = (
            callDuration.current /
            1000 /
            60
        ).toFixed(2);
        formData.append("duration", durationInMinutes ?? null);
        formData.append("appointmentID", parseInt(appointmentID));
        formData.append("userID", parseInt(userID));
        formData.append("userType", userType);
        formData.append("autoClose", UsersCount.current == 1||breakLimit);
        const response = await axiosClient.post(`/endSession`, formData);
        console.log(response);
        if (response.data.status == 200) {
            navigate("/Appointments");
        }
    };
    return (
        <>
            {RoomID && (
                <div
                    className="w-[30%] myCallContainer mt-[10vh] ml-[5vw] mr-[5vw] imagebackground"
                    ref={myMeeting}
                    style={{ width: "90vw", height: "90vh" }}
                ></div>
            )}
            {NotesOpen && userType == "doctor" && (
                <NotesForm
                    appointment={theAppointment}
                    patientID={patientID}
                    doctorID={doctorID}
                    setNotesOpen={setNotesOpen}
                    setNotesDone={setNotesDone}
                    onSubmit={() => endSession()}
                />
            )}
        </>
    );
}
