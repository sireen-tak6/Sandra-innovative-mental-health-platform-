import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "react-bootstrap-icons";
import { AiOutlineCalendar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { AiFillHeart, AiOutlineWarning, AiOutlineHeart } from "react-icons/ai";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./articleCard.css";
import CircularLoading from "../../../Components/loadingprogress/loadingProgress";
import LikeButton from "../../../Components/likeButton/likeButton";
//providers

const ArticleCard = ({ id, item }) => {
    const [date, setdate] = useState(null);

    useEffect(() => {
        const date2 = new Date(item.created_at);
        setdate(date2);
    }, [item]);
    return (
        <>
            {date === null ? (
                <div className="ArticleCard">
                    <CircularLoading />
                </div>
            ) : (
                <Link
                    to={`/articles/${item.category.id}/${item.id}`}
                    className="boxItemsPending"
                    key={item.id}
                >
                    <div className="ArticleCard">
                        <div className="image">
                            <img src={"http://localhost:8000/" + item.image} />
                        </div>
                        <div className="info">
                            <div>
                                <div className="nameLikes">
                                    <div className="name">{item.name}</div>
                                    <div className="likes">
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
                                        {item.likes}
                                    </div>
                                </div>
                                <div className="speciality">
                                    {item.category.name}
                                </div>
                            </div>
                            <div className="content">
                                {item.content.slice(0, 200)}...
                            </div>
                            <div className="date">
                                {" "}
                                <AiOutlineCalendar className="icon" />
                                {date.getDate()} / {date.getMonth() + 1} /{" "}
                                {date.getFullYear()}
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </>
    );
};

export default ArticleCard;
