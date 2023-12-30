import React from "react";
import { BsBookmark } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

//css
import "sweetalert2/src/sweetalert2.scss";
import "./myArticle.css";
import CircularLoading from "../../loadingprogress/loadingProgress";

const MyArticleCard = ({ item, last }) => {
    console.log(last);
    console.log(item.name);
    const [date, setdate] = useState(null);

    useEffect(() => {
        const date2 = new Date(item.created_at);
        setdate(date2);
    }, [item]);
    return (
        <Link to={`${item.id}`} className="boxItemsPending" key={item.id}>
            {date===null?<div><CircularLoading/></div>:
            <div className={`myArticleCard ${last ? "" : "none"}`}>
                <div className="image">
                    <img src={"http://localhost:8000/" + item.image} alt="" />
                </div>
                <div className="cardInfo">
                    <div className="name">{item.name}</div>
                    <div className="info category">
                        {" "}
                        <BsBookmark className="icon" size="2.5vmin" />
                        {item.category.name}
                    </div>
                    <div className="info">{item.content.slice(0, 120)}...</div>
                    <div className="datestatus">
                        <div className="date">
                            <AiOutlineCalendar className="icon" />
                            {date.getDate()} / {date.getMonth() + 1} /{" "}
                                {date.getFullYear()}                        </div>
                        <div
                            className={
                                item.status === "published"
                                    ? "status acceptStatus"
                                    : item.status === "rejected"
                                    ? "status rejectStatus"
                                    : "status pendingStatus"
                            }
                        >
                            {item.status === "adminChoice"
                                ? "pending"
                                : item.status}
                        </div>
                    </div>
                </div>
            </div>}
        </Link>
    );
};
export default MyArticleCard;
