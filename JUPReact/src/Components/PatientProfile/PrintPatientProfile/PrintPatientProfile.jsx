// PrintPatientProfile.js
import React from "react";
import "./PrintPatientProfile.css";

const PrintPatientProfile = React.forwardRef(({ patientInfos, notes ,summarization }, ref) => {
    const getDate = (n) => {
        const date2 = new Date(n.created_at);
        const date = `${date2.getDate()} / ${
            date2.getMonth() + 1
        } / ${date2.getFullYear()} ${date2.getHours()}:${date2.getMinutes()} `;
        return date;
    };
    const userName = localStorage.getItem("user-name");
    const date = new Date();

    return (
        <div ref={ref} className="print-container">
            <div className="header">
                <div className="Title">Sandra</div>
                <div className="flexdata">
                    <div className="data">
                        <div>
                            <span className="key">Email : </span>{" "}
                            Sandra@gmail.com
                        </div>
                        <div>
                            <span className="key">Phone : </span> (+963) 980 547
                            937
                        </div>
                    </div>
                    <div className="data">
                        <div>
                            <span className="key">User :</span> {userName}
                        </div>
                        <div>
                            <span className="key">Date :</span>
                            {` ${date.getHours()}:${date.getMinutes()} ${date.getDate()} / ${
                                date.getMonth() + 1
                            } / ${date.getFullYear()}`}
                        </div>
                    </div>
                </div>
            </div>
            <div className="print-main-info">
                <div className="userName">{patientInfos?.patient?.user_name}</div>
                <div className="flexdata">
                    <div className="data">
                        <span className="key">Name: </span>
                        {patientInfos?.data?.firstName??""}{" "}
                        {patientInfos?.data?.lastName??""}
                    </div>
                    <div className="data">
                        <span className="key">Age: </span>
                        {patientInfos?.data?.age??""} Years
                    </div>
                    <div className="data">
                        <span className="key">Gender: </span>
                        {patientInfos?.data?.gender??""}
                    </div>
                </div>
                <div className="flexdata">
                    <div className="data">
                        <span className="key">Marital Status: </span>
                        {patientInfos?.data?.maritalStatus??""}
                    </div>
                    <div className="data">
                        <span className="key">Phone: </span>
                        {patientInfos?.data?.phoneNumber??""}
                    </div>
                    <div className="data">
                        <span className="key">Address: </span>
                        {patientInfos?.data?.address??""}
                    </div>
                </div>
                <div className="flexdata">
                    <div className="data">
                        <span className="key">Children: </span>
                        {patientInfos?.data?.children??""}
                    </div>
                    <div className="data">
                        <span className="key">Parents Status: </span>
                        {patientInfos?.data?.parentsStatus || "none"}
                    </div>
                    <div className="data">
                        <span className="key">Education: </span>
                        {patientInfos?.data?.education??""}
                    </div>
                </div>
                <div className="flexdata">
                    <div className="data">
                        <span className="key">Employment Status: </span>
                        {patientInfos?.data?.employmentStatus??""}
                    </div>
                    <div className="data">
                        <span className="key">Occupation: </span>
                        {patientInfos?.data?.occupation??""}
                    </div>
                </div>
            </div>

            <div className="print-secondary-info">
                <div className="data">
                    <span className="key">Past Conditions: </span>
                    {patientInfos?.data?.pastConditions || "none"}
                </div>
                <div className="data">
                    <span className="key">Professionals: </span>
                    {patientInfos?.data?.professionals || "none"}
                </div>
                <div className="data">
                    <span className="key">Medications: </span>
                    {patientInfos?.data?.medications || "none"}
                </div>
                <div className="data">
                    <span className="key">Notes: </span>
                    {patientInfos?.data?.notes || "none"}
                </div>
            </div>
            <div className="print-summarization">
                <div className=" data">
                    <span className="key">Notes Summarization:</span>
                </div>
                {true &&
                   summarization}
            </div>
            <div className="print-notes">
                <div className=" data">
                    <span className="key">Doctors Notes:</span>
                </div>
                {notes &&
                    notes.map((note, index) => (
                        <div key={index} className="noteCards">
                            <div className=" data">
                                <span className="key">Doctor Name: </span>
                                {note.doctor.user_name}
                            </div>
                            <div className=" data">
                                <span className="key">
                                    Pre-Session Medications:{" "}
                                </span>
                                {note.preMed}
                            </div>
                            <div className=" data">
                                <span className="key">
                                    Post-Session Medications:{" "}
                                </span>
                                {note.postMed}
                            </div>
                            <div className=" data">
                                <span className="key">Doctor Notes: </span>
                                {note.Notes}
                            </div>
                            <div className="data">
                                <span className="key">Date: </span>
                                {getDate(note)}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
});

export default PrintPatientProfile;
