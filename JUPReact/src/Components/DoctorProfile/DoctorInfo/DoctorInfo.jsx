import React, { useEffect, useState } from "react";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import axiosClient from "../../../axios";
import { useNavigate } from "react-router-dom";

//css
import "./DoctorInfo.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//components
import CircularLoading from "../../loadingprogress/loadingProgress";
import LikeButton from "../../likeButton/likeButton";

const DoctorInfo = ({ id }) => {
    const [doctorInfo, setdoctorInfo] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const navigate = useNavigate();
    const medalia = "../assetss/medaliaicon.png";

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const userType = localStorage.getItem("user-type") ?? "none";

    useEffect(() => {
        const fetchData = async () => {
            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            try {
                const response = await axiosClient.post(`/doctorInfo/${id}`, {
                    userType,
                    userID,
                });
                if (response.data.status === 200) {
                    console.log(response.data);
                    setdoctorInfo(response.data["doctor"]);
                    setIsLiked(response.data["doctor"].isLiked);
                    setLikes(response.data["doctor"].likesCount);
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
    const handleLike = async () => {
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        console.log("liks");
        try {
            const response = await axiosClient.post(
                `/add/like/${doctorInfo.id}/${userID}`
            );
            setLikes(response.data.likes);
            setIsLiked(!isLiked);
            console.log(response.data.likes);
            console.log("Likes after like:", likes);
        } catch (error) {
            console.log(error);
            swalWithBootstrapButtons.fire(error.response.statusText, "error");
        }
    };
    const AddArticle = () => {
        navigate("/articles/AddArticle");
    };
    const verify = () => {
        navigate("/verfiy");
    };
    if (doctorInfo === null) {
        return (
            <div className="infoPart">
                <div className="mainInfo">
                    <div className="imageframe"> </div>
                    <CircularLoading />
                </div>

                <div className="secondaryInfo">
                    {" "}
                    <CircularLoading />
                </div>
            </div>
        );
    } else {
        return (
            <div className="infoPart">
                <div className="mainInfo">
                    <div className="imageframe">
                        {doctorInfo.gender === null ||
                        doctorInfo.gender === 0 ? (
                            <img src="../images/maleDoctor.jpg" alt="" />
                        ) : (
                            <img src="../images/femaleDoctor.jpg" alt="" />
                        )}
                    </div>
                    <div className="likes">
                        {userType === "patient" ? (
                            <div className="likes">
                                <LikeButton
                                    handleDislike={handleLike}
                                    handleLike={handleLike}
                                    likes={likes}
                                    isLiked={isLiked}
                                    button="yes"
                                    size={30}
                                />
                            </div>
                        ) : (
                            <div className="likes">
                                <LikeButton
                                    handleDislike={handleLike}
                                    handleLike={handleLike}
                                    likes={likes}
                                    isLiked={isLiked}
                                    button="no"
                                    size={30}
                                />
                            </div>
                        )}
                    </div>

                    <div className="info">
                        <div className="name flex">
                            {doctorInfo.user_name}{" "}
                            {doctorInfo.isVerfiy == 1 ? (
                                <img className="medalia" src={medalia} />
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="speciality">
                            {" "}
                            {doctorInfo.category
                                ? doctorInfo.category.name
                                : ""}{" "}
                            (points:
                            {doctorInfo.points})
                        </div>
                        <div className="about">{doctorInfo.about}</div>
                    </div>
                </div>

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
                        <div className="addButtons">
                            <div className="addCertificate part">
                                {" "}
                                <button
                                    type="button"
                                    onClick={() => AddArticle()}
                                >
                                    Add Article
                                </button>
                            </div>
                            {doctorInfo.isVerfiy == 0 ? (
                                <div className="addCertificate part">
                                    <button
                                        type="button"
                                        onClick={() => verify()}
                                    >
                                        Add Certificate
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
};
export default DoctorInfo;
