import React, { useContext, useState } from "react";

import { MyContext } from "../../../Providers/Appointmentsprov";

//css
import "./AppointmentsTypes.css";

//components

const AppointmentsTypes = () => {
    const { Type, handleUpdate } = useContext(MyContext);
    const [Types, setTypes] = useState([
        { name: "All", id: 0 },
        { name: "Paid", id: 7 },
        { name: "Pending", id: 1 },
        { name: "Future", id: 2 },
        { name: "Past", id: 3 },
        { name: "Done", id: 6 },
        { name: "OnLine", id: 4 },
        { name: "OnSite", id: 5 },
        { name: "Canceled", id: 8 },

    ]);

    function onUpdate(value) {
        console.log(value);
        handleUpdate(value);
    }
    const userID = localStorage.getItem("user-id");
    let user = JSON.parse(localStorage.getItem("user-info"));
    const userType = localStorage.getItem("user-type");

    return (
        <div className="Types">
            <div className="partHead">
                <div className="partTitle">Types :</div>
                <div className="NewButton">
                    <a
                        href={`${
                            userType == "patient"
                                ? "/doctor"
                                : userType == "doctor"
                                ? `/newAppointment/${userID}`
                                : `/newAppointment/${user.doctorID}`
                        }`}
                    >
                        New appointment
                    </a>
                </div>
            </div>
            <div className="TypesDiv">
                {Types.map((item,index) => (
                    ((index==8&&userType=="admin")|| index!==8)&&
                    <div>
                        <button
                            onClick={() => onUpdate(item.id)}
                            id={item.id}
                            className={Type === item.id ? "selected" : "none"}
                        >
                            {item.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default AppointmentsTypes;
