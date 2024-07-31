import React, { useState, useEffect } from "react";
import axiosClient from "../../../axios";
import axios from "axios";
import "./NotesForm.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useNavigate } from "react-router-dom";

const NotesForm = ({ appointment, patientID, doctorID, setNotesOpen ,setNotesDone,onSubmit}) => {
    console.log("hiiiii");
    const [preSessionMeds, setPreSessionMeds] = useState(""); // State for pre-session meds
    const [postSessionMeds, setPostSessionMeds] = useState("");
    const [sessionNotes, setSessionNotes] = useState(""); // State for session notes
    const [loading, setloading] = useState(false); // State for session notes
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
    const [NotesSummarization, setNotesSummarization] = useState(null);

    // Implement logic to submit medication data to your backend (e.g., using axios)
    // This could involve sending the pre-session meds, post-session meds, patient ID, etc.
    // Replace with your actual API call
    const submitMedicationData = async (event) => {
        setloading(true);
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
                const processedData = response.data.notes.map((record) => ({
                    patient_name: record.patient.user_name,
                    doctor_name: record.doctor.user_name,
                    notes: record.Notes,
                    preMed: record.preMed,
                    postMed: record.postMed,
                    created_at: record.created_at,
                  }));
                if (processedData !== null) {
                        const response2 = await axios.post(
                            `http://127.0.0.1:5173/summarization`,
                            {
                                Notes: processedData,
                            }
                        );
                        console.log(response2);
                        if (response2.data["response"]) {
                            formData.append("userType", userType);
                            formData.append("userID", parseInt(patientID));
                            formData.append("sum", response2.data["response"]);
                            const response3= await axiosClient.post(
                                `/AddNotesSummarization`,
                                formData
                            );
                            console.log(response3)
                            setNotesSummarization(response2.data["response"]);
                            console.log(response.data["response"]);
                        }
                    };
                }
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
        else{
            setNotesOpen(false);
                setNotesDone(true);
                if (onSubmit) {
                    onSubmit();
                } 
        }
        setloading(false)
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
                            onClick={loading?null:submitMedicationData}
                        >
                            {loading?"...":"Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotesForm;
