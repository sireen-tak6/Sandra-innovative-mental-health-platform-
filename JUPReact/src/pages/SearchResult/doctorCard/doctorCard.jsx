import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { AiFillHeart, AiOutlineWarning, AiOutlineHeart } from "react-icons/ai";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./doctorCard.css";
//providers

const DoctorCard = ({ id, item }) => {
    return (
        <Link
            to={`/doctorProile/${item.id}`}
            className="boxItemsPending"
            key={item.id}
        >
            <div className="doctorCard">
                <div className="image">
                    {item.gender === null || item.gender === 0 ? (
                        <img src="../images/maleDoctor.jpg" alt="" />
                    ) : (
                        <img src="../images/femaleDoctor.jpg" alt="" />
                    )}
                </div>
                <div className="info">
                    <div className="nameLikes">
                        <div className="name">{item.user_name}</div>
                        <div className="likes">
                            {" "}
                            {item.isLiked ? (
                                <AiFillHeart
                                    className="likeicon"
                                    size="3vmin"
                                />
                            ) : (
                                <AiOutlineHeart
                                    className="likeicon"
                                    size="3vmin"
                                    color="black"
                                />
                            )}
                            {item.likesCount}
                        </div>
                    </div>
                    <div className="speciality">
                        {item.category !== null ? item.category.name : ""}
                    </div>
                    <div className="part">
                        <div className="label">points :</div>
                        {item.points}
                    </div>
                    <div className="part">
                        <div className="label">phone :</div>
                        {item.phone}
                    </div>
                    <div className="part">
                        <div className="label">university :</div>
                        {item.university}
                    </div>
                    <div className="part">
                        <div className="label">address :</div>
                        {item.address}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default DoctorCard;
