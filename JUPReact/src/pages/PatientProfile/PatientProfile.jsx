import { React, useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//css
import "./PatientProfile.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
//components
import ProfilePatientInfo from "../../Components/PatientProfile/ProfilePatientInfo/ProfilePatientInfo";
import PatientNotes from "../../Components/PatientProfile/PatientNotes/PatientNotes";
import PrintPatientProfile from "../../Components/PatientProfile/PrintPatientProfile/PrintPatientProfile";

function PatientProfile() {
    const { id } = useParams();
    const [PatientInfos, setPatientInfo] = useState(null);
    const [Notes, setNotes] = useState(null);
    const [EditedNotes, setEditedNotes] = useState(null);
    const printRef = useRef();
    const downloadPDF = async () => {
        const capture = printRef.current;

        try {
            const canvas = await html2canvas(capture);
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            let position = 0;
            while (position > imgHeight * -1) {
                pdf.addImage(
                    imgData,
                    "PNG",
                    0,
                    position,
                    imgWidth,
                    imgHeight,
                    null,
                    "FAST"
                );
                position -= (pdfHeight-7);
                if (position > imgHeight * -1) {
                    pdf.addPage();
                }
            }

            pdf.save("info.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            Swal.fire(
                "Error",
                "There was an error generating the PDF.",
                "error"
            );
        }
    };
    const [NotesSummarization, setNotesSummarization] = useState(null);
   

    return (
        <>
            <div className="PatientProfile">
                <ProfilePatientInfo
                    id={id}
                    downloadPDF={downloadPDF}
                    setTopPatientInfo={setPatientInfo}
                    setNotesSummarization={setNotesSummarization}
                />
                <PatientNotes
                    id={id}
                    setTopNotes={setNotes}
                    editedNotes={setEditedNotes}
                />
            </div>
            {(
                <div
                    style={{
                        position: "absolute",
                        top: "-10000px",
                        left: "-9999px",
                    }}
                >
                    <PrintPatientProfile
                        ref={printRef}
                        patientInfos={PatientInfos}
                        notes={Notes}
                        summarization={NotesSummarization}
                    />
                </div>
            )}
        </>
    );
}
export default PatientProfile;
