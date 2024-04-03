import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AiOutlineCalendar } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
//css
import "./ArticleCard.css";
import userIcon from "./userIcon.png";
import LikeButton from "../../likeButton/likeButton";

export default function ArticleCard({
    id,
    title,
    image,
    doctorID,
    name,
    content,
    date,
    likes,
    catid,
    type,
    isLiked,
}) {
    const navigate = useNavigate();
    return (
        <Link to={`/articles/${catid}/${id}`} className="ArticleCard" key={id}>
            <div className="ArticleImage">
                <img src={"http://localhost:8000/" + image} alt="" />
            </div>
            <div className="ArticleInfo">
                <div className="ArticleName">{title}</div>

                <div className="userIcon">
                    <img src={userIcon} alt="" />
                    {doctorID.user_name}
                </div>
                <div className="ArticleSpeciality">
                    <BsBookmark className="icon" size="2.5vmin" />
                    {name}
                </div>

                <p className="ArticleContent">{content.slice(0, 180)}...</p>

                <div className="ArticleDateLike">
                    <AiOutlineCalendar className="icon" />{" "}
                    <label htmlFor="">{date}</label>
                    <LikeButton likes={likes} isLiked={isLiked} button="no" />
                </div>
            </div>
        </Link>
    );
}
