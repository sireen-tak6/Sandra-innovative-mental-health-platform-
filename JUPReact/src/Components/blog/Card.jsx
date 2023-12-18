import React, { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { Link } from "react-router-dom";

//css
import "./Card.css";

//components
import LikeButton from "../likeButton/likeButton";

//images
import userIcon from "./userIcon.png";

const Card = ({
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
}) => {
    const [isLikedlocal, setIsLiked] = useState(isLiked);
    console.log(isLikedlocal);

    return (
        <Link to={`/articles/${catid}/${id}`} className="boxItems" key={id}>
            <div className={type === "content" ? "img2" : "img"}>
                <img src={"http://localhost:8000/" + image} alt="" />
            </div>
            <div className={type === "content" ? "details2" : "details"}>
                <div className="titlePart">{title}</div>

                <div className="userIcon">
                    <img src={userIcon} alt="" />
                    {doctorID.user_name}
                </div>
                <div className="tag">
                    <BsBookmark className="icon" size="2.5vmin" />
                    {name}
                </div>
                {type === "content" ? (
                    <p className="content">{content.slice(0, 100)}...</p>
                ) : (
                    <p className="content">{content.slice(0, 180)}...</p>
                )}
                <div className="date">
                    <AiOutlineCalendar className="icon" />{" "}
                    <label htmlFor="">{date}</label>
                    <LikeButton likes={likes} isLiked={isLiked} button="no" />
                </div>
            </div>
        </Link>
    );
};
export default Card;
