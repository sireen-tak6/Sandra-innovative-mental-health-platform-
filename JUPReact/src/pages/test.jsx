import { React, useState, useEffect } from "react";
/*import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useLocation } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../../axios";

import NotesForm from "../Forms/NotesForm/NotesForm";

const bg = "../assetss/forhome.png";

function randomID(len) {
    let result = "";
    if (result) return result;
    var chars =
            "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
        maxPos = chars.length,
        i;
    len = len || 5;
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

export function getUrlParams(url = window.location.href) {
    let urlStr = url.split("?")[1];
    return new URLSearchParams(urlStr);
}*/
export  function Test() {
    /*
    const [userID, setUserID] = useState(6); // Unique user ID for yourself
    const [remoteUserID, setRemoteUserID] = useState(266391); // Unique user ID for the other person
    const [callDuration, setCallDuration] = useState(0); // Duration in seconds
    const [appointment, setAppointment] = useState(null);
    const [theAppointment, setTheAppointment] = useState(null);
    const [callStarted, setCallStarted] = useState(false);
    const [NotesOpen, setNotesOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userType = localStorage.getItem("user-type");
    const doctorID = location.state?.doctorID;
    const patientID = location.state?.patientID;
    useEffect(() => {
        if (doctorID !== null && patientID !== null) {
            appointmentCheck();
            if (appointment == false) {
                navigate(`newAppointment/${doctorID}`);
            }
        }
    }, [doctorID, patientID]);
    useEffect(() => {
        if (callStarted) {
            // Call started, initiate timer
            let startTime = Date.now();
            const intervalId = setInterval(() => {
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                setCallDuration(elapsedTime);
            }, 1000); // Update every second

            console.log(callDuration);
            // Cleanup function on component unmount (optional)
            return () => clearInterval(intervalId);
        } else {
            // Call ended, reset timer
            setCallDuration(0);
        }
        console.log(callStarted);
    }, []);
    const appointmentCheck = async () => {
        const formData = new FormData();
        formData.append("patientID", parseInt(patientID));
        formData.append("doctorID", parseInt(doctorID));
        const response = await axiosClient.post(`/haveAppointment`, formData);

        if (response.data.status == 200) {
            setAppointment(response.data.haveAccount);
            setTheAppointment(response.data.appointment);
            console.log(response.data.appointment);
        }
    };
    const roomID = getUrlParams().get("roomID") || randomID(5);
    const [appSign, setAppSign] = useState(
            "9af50e2e542304651cb6deb38dd297ca187538006230e8cf6879e1dbd59b3e1b"
        );
    let myMeeting = async (element) => {
        // generate Kit Token
        const appID = 1079263476;
        
        const serverSecret = "420074fe9fc9ec6527ba27fcdde454d0";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            randomID(5),
            randomID(5)
        );
        let zp;
        try {
            zp = ZegoUIKitPrebuilt.create(kitToken);
        } catch (error) {
            console.error("Error creating ZegoUIKitPrebuilt instance:", error);
            return; // Handle error gracefully (e.g., display an error message)
        }

        setCallStarted(true);

        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: "Share Link",
                    url:
                        window.location.protocol +
                        "//" +
                        window.location.host +
                        window.location.pathname +
                        "?roomID=" +
                        roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            onLeaveRoom: () => {
                setCallStarted(false);
                console.log(callStarted);
                setNotesOpen(true);
            },
        });
    };*/
    return (
        <>{/*
            <div
                className="w-[30%] myCallContainer mt-[10vh] ml-[5vw] mr-[5vw] imagebackground"
                ref={myMeeting}
                style={{ width: "90vw", height: "90vh" }}
            ></div>
            {NotesOpen && userType=="doctor" && <NotesForm appointment={theAppointment} patientID={patientID} doctorID={doctorID} setNotesOpen={setNotesOpen}/>}
        */}</>
    );
}
