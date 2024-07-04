import React, { useEffect, useState ,useContext} from "react";
import axiosClient from "../../../axios";

//css
import "./PatientNotes.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import NoData from "../../NoData/NoData";
import CircularLoading from "../../loadingprogress/loadingProgress";
import { TextareaT } from "react-bootstrap-icons";

import PatientNoteCard from "../PatientNoteCard/PatientNoteCard";
function PatientNotes({ id ,setTopNotes,editedNotes}) {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const [Notes, setNotes] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            const formData2 = new FormData();

            formData2.append("patientID", id);
            formData2.append("userID", parseInt(userID));
            formData2.append("userType", userType);
            try {
                const response = await axiosClient.post(
                    "/getPatientNotes",
                    formData2
                );
                console.log(response);
                if (response.status == 200) {
                    setNotes(response.data.Notes);
                    setTopNotes(response.data.Notes);
                    const processedData = response.data.Notes.map((record) => ({
                        patient_name: record.patient.user_name,
                        doctor_name: record.doctor.user_name,
                        notes: record.Notes,
                        preMed: record.preMed,
                        postMed: record.postMed,
                        created_at: record.created_at,
                      }));
                      editedNotes(processedData)
                } else {
                    swalWithBootstrapButtons.fire(
                        response.data.message,
                        "Something went wrong",
                        "error"
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);
    const getInfo = (date) => {
        const date2 = new Date(item.date);
    }
    
    return (
        <div className="PatientNotes">
            {Notes &&
                Notes.map((note) => (
                    <PatientNoteCard note={note}/>
                ))}
        </div>
    );
}
export default PatientNotes;
