import React, { useEffect, useState } from "react";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import axiosClient from "../../../axios";
//css
import "./DoctorInfo.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import CircularLoading from "../../loadingprogress/loadingProgress";

function DoctorInfo({ id }) {
    const [doctorInfo, setdoctorInfo] = useState(null);
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post(`/doctorInfo/${id}`);
                if (response.data.status === 200) {
                    console.log(response.data);
                    setdoctorInfo(response.data["doctor"]);
                } else {
                    console.log(response.data);

                    swalWithBootstrapButtons.fire(
                        response.data.message,
                        "error"
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);
    return (
        <div className="infoPart">
            {doctorInfo === null ? (
                <div className="mainInfo">
                    <div className="imageframe"> </div>
                    <CircularLoading />
                </div>
            ) : (
                <div className="mainInfo">
                    <div className="imageframe">
                        {doctorInfo.gender===null||doctorInfo.gender===0?<img src="../images/maleDoctor.jpg" alt="" />:<img src="../images/femaleDoctor.jpg" alt="" />}
                        
                    </div>
                    <div className="likes">
                        <AiFillHeart className="likeicon" size={25} /> {doctorInfo.likesCount}
                    </div>
                    <div className="points">
                        <AiFillStar className="pointsicon" size={25} />{" "}
                        {doctorInfo.points}
                    </div>

                    <div className="info">
                        <div className="name">{doctorInfo.user_name}</div>
                        <div className="speciality"> {doctorInfo.category.name}</div>
                        <div className="about">{doctorInfo.about}</div>
                    </div>
                </div>
            )}
            {doctorInfo === null ? (
                <div className="secondaryInfo">
                    {" "}
                    <CircularLoading />
                </div>
            ) : (
                <div className="secondaryInfo">
                    <div className="title">
                        {" "}
                        {doctorInfo.user_name}'s Informations :
                    </div>
                    <div className="address part">
                        <div className="keyword">address :</div>
                        {doctorInfo.address}
                    </div>
                    <div className="phone part">
                        <div className="keyword">phone :</div>
                        {doctorInfo.phone}
                    </div>
                    <div className="university part">
                        <div className="keyword">university :</div>
                        {doctorInfo.university}
                    </div>
                    <div className="postsCount part">
                        <div className="keyword">Articles :</div>
                        {doctorInfo.articlesCount}
                    </div>
                    {localStorage.getItem("user-id") === id &&
                    localStorage.getItem("user-type") === "doctor" ? (
                        <div className="addCertificate part">
                            <button type="button">add certificate</button>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
export default DoctorInfo;
