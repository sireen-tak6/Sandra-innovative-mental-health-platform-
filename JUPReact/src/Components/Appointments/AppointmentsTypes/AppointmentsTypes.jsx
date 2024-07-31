import React, { useContext, useState } from "react";

import { MyContext } from "../../../Providers/Appointmentsprov";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../axios";

//css
import "./AppointmentsTypes.css";

//components

const AppointmentsTypes = ({setAppointments}) => {
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
    const [query, setQuery] = useState(null);
    function onUpdateSearch(value) {
        setQuery(value);
    }
    const search = async (event) => {
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const formData = new FormData();
        formData.append("query", query);
        formData.append("userType", userType);
        formData.append("userID", userID);
        const response = await axiosClient.post(
            "SearchAppointment",
            formData
        );
        console.log(response)
        if(response.data.status==200){
            setAppointments(response.data.appointments)
        }
    };
    return (
        <div className="Types">
            <div className="partHead">
                <div className="title2">
                <div className="partTitle">Types :</div>
                    <div className="Search">
                        <input
                            type="text"
                            className="Searchinput"
                            placeholder="ex. Account number, name.."
                            value={query}
                            onChange={(e) => onUpdateSearch(e.target.value)}
                        />{" "}
                        <div className="buttonPart">
                            <button
                                type="button"
                                className="saveButton"
                                onClick={search}
                            >
                                <FontAwesomeIcon
                                    className="star"
                                    icon={faSearch}
                                ></FontAwesomeIcon>{" "}
                            </button>
                        </div>
                    </div>
                        </div>
                        {userType!="admin"?
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
                    </div>:null}
            </div>
            <div className="TypesDiv">
                {Types.map(
                    (item, index) =>
                        ((index == 8 && userType == "admin") ||
                            index !== 8) && (
                            <div>
                                <button
                                    onClick={() => onUpdate(item.id)}
                                    id={item.id}
                                    className={
                                        Type === item.id ? "selected" : "none"
                                    }
                                >
                                    {item.name}
                                </button>
                            </div>
                        )
                )}
            </div>
        </div>
    );
};
export default AppointmentsTypes;
