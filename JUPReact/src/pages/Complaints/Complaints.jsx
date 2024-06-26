import React, { useEffect, useState } from "react";
import "./Complaints.css";
import axiosClient from "../../axios";
import ComplaintCard from "../../Components/Complaints/ComplaintCard/ComplaintCard";
import ComplaintsContent from "../../Components/Complaints/ComplaintsContent/ComplaintsContent";

const Complaints = () => {
    useEffect(() => {
        if (localStorage.getItem("user-info")) {
            fetchComplaints();
        } else {
            navigate("/login");
        }
    }, [localStorage]);

    const userID = localStorage.getItem("user-id");
    const userType = localStorage.getItem("user-type");
    const [complaints, setComplaints] = useState(null);
    const [openContent, setOpenContent] = useState(false);
    const [item, setItem] = useState(null);
    const OpenContent = (item) => {
        setItem(item);
        setOpenContent(true);
    };
    const fetchComplaints = async () => {
        try {
            const response = await axiosClient.post(`getComplaints`, {
                userID,
                userType,
            });
            console.log(response);
            if (response.data["status"] !== 200) {
            } else {
                setComplaints(response.data["complaints"]);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const item3 = {
        created_at: "Date",
        status: "managed",
        doctor: { user_name: "User Name" },
        userType: "Type",
        description: "Description",
    };
    return (
        <div>
            <div className="Complaints">
                <div className="Title">Complaints</div>
                <ComplaintCard item={item3} OpenContent={OpenContent} first={true}/>

                {complaints &&
                    complaints.map((item2) => (
                        <ComplaintCard item={item2} OpenContent={OpenContent} />
                    ))}
            </div>
            {openContent && (
                <ComplaintsContent
                    item={item}
                    setOpenContent={setOpenContent}
                />
            )}
        </div>
    );
};

export default Complaints;
