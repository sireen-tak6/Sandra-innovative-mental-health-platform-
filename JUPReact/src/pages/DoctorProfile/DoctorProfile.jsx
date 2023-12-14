import React from "react";
import { useParams } from "react-router-dom";

//css
import "./DoctorProfile.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//components
import ProfileArticle from "../../Components/DoctorProfile/ProfileArticle/ProfileArticle";
import DoctorInfo from "../../Components/DoctorProfile/DoctorInfo/DoctorInfo";

function DoctorProfile() {
    const { id } = useParams();

    return (
        <div className="DoctorProfile">
            <DoctorInfo id={id} />
            <ProfileArticle id={id} />
        </div>
    );
}
export default DoctorProfile;
