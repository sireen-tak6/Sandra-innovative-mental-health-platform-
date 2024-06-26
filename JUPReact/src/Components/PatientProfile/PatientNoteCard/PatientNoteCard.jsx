import React, { useEffect, useState } from "react";

//css
import "./PatientNoteCard.css";
function PatientNoteCard({ note }) {
    const [date, setDate] = useState(null);
    const getInfo = (date) => {
        const date2 = new Date(item.date);
        setDate(date2);
    };
    const getDate = (n) => {
        const date2 = new Date(n.created_at);
        const date = `${date2.getDate()} / ${
            date2.getMonth() + 1
        } / ${date2.getFullYear()} ${date2.getHours()}:${date2.getMinutes()} `;
        return date;
    };
    return (
        <div className="noteCard">
            <div className="doctorName info">
                Doctor name :{" "}
                <div className="dataName">{note.doctor.user_name}</div>
            </div>
            <div className="preMed info">
                Pre-Session Medications :
                <textarea
                    className="data"
                    disabled={true}
                    value={note.preMed}
                />
            </div>
            <div className="postMed info">
                Post-Session Medications :
                <textarea
                    className="data"
                    disabled={true}
                    value={note.postMed}
                />
            </div>
            <div className="notes info">
                Notes :{" "}
                <textarea className="data" disabled={true} value={note.Notes} />
            </div>
            <div className="Date">Date : {getDate(note)}</div>
        </div>
    );
}
export default PatientNoteCard;
