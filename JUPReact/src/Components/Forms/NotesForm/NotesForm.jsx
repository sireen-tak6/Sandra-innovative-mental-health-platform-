import React, { useState, useEffect } from "react";
import axiosClient from "../../../axios";
import "./NotesForm.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useNavigate } from "react-router-dom";

const NotesForm = ({ appointment, patientID, doctorID, setNotesOpen ,setNotesDone,onSubmit}) => {
    console.log("hiiiii");
    const [preSessionMeds, setPreSessionMeds] = useState(""); // State for pre-session meds
    const [postSessionMeds, setPostSessionMeds] = useState("");
    const [sessionNotes, setSessionNotes] = useState(""); // State for session notes
    const navigate = useNavigate();
    const handlePreSessionMedsChange = (event) => {
        setPreSessionMeds(event.target.value);
    };

    const handlePostSessionMedsChange = (event) => {
        setPostSessionMeds(event.target.value);
    };
    const handleSessionNotesChange = (event) => {
        setSessionNotes(event.target.value);
    };
    // Implement logic to submit medication data to your backend (e.g., using axios)
    // This could involve sending the pre-session meds, post-session meds, patient ID, etc.
    // Replace with your actual API call
    const submitMedicationData = async (event) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        event.preventDefault();
        const userType = localStorage.getItem("user-type");
        const userID = localStorage.getItem("user-id");
        if (
            (sessionNotes || postSessionMeds || preSessionMeds) &&
            (sessionNotes != "" ||
                postSessionMeds != "" ||
                preSessionMeds != "")
        ) {
            const formData = new FormData();

            formData.append("userType", userType);
            formData.append("userID", parseInt(userID));
            formData.append("appointmentID", appointment.id);
            formData.append("Notes", sessionNotes);
            formData.append("postMed", postSessionMeds);
            formData.append("preMed", preSessionMeds);
            formData.append("patientID", patientID);
            formData.append("doctorID", doctorID);
            console.log(appointment.id);
            const response = await axiosClient.post(
                `/addSessionNote`,
                formData
            );
            console.log(response);
            if (response.data.status == 200) {
                swalWithBootstrapButtons.fire(
                    "Note Added.",
                    "The Note has been added successfully.",
                    "success"
                );
                setNotesOpen(false);
                setNotesDone(true);
                if (onSubmit) {
                    onSubmit();
                }
            }
        }
        else{
            setNotesOpen(false);
                setNotesDone(true);
                if (onSubmit) {
                    onSubmit();
                } 
        }
    };

    return (
        <div className="Notesmodal">
            <div className="Notesmodal-content">
                <div className="NotesTitle">Session Notes</div>
                <form>
                    <div>
                        Pre-Session Medications :
                        <textarea
                            type="textarea"
                            rows={3}
                            value={preSessionMeds}
                            onChange={handlePreSessionMedsChange}
                        ></textarea>
                    </div>
                    <div>
                        Post-Session Medications :
                        <textarea
                            type="textarea"
                            rows={3}
                            value={postSessionMeds}
                            onChange={handlePostSessionMedsChange}
                        />
                    </div>
                    <div>
                        Notes :
                        <textarea
                            type="textarea"
                            rows={5}
                            value={sessionNotes}
                            onChange={handleSessionNotesChange}
                        />
                    </div>
                    <div className="buttonContainer">
                        <button
                            variant="primary"
                            type="button"
                            onClick={submitMedicationData}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotesForm;
