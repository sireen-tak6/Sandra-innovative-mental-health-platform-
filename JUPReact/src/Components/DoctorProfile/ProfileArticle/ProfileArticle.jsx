import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios";
import { Link } from "react-router-dom";
import { AiFillHeart, AiOutlineWarning, AiOutlineHeart } from "react-icons/ai";

//css
import "./ProfileArticle.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import NoData from "../../NoData/NoData";
import CircularLoading from "../../loadingprogress/loadingProgress";
function ProfileArticle({ id }) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const [articles, setarticles] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userID = localStorage.getItem("user-id");
                const userType = localStorage.getItem("user-type");
                const response = await axiosClient.post(
                    `/doctorArticles/${id}`,
                    { userID, userType }
                );
                if (response.data.status === 200) {
                    console.log(response.data);
                    setarticles(response.data["Articles"]);
                } else {
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
        <div className="posts">
            {articles === null ? (
                <CircularLoading />
            ) : articles.length === 0 ? (
                <NoData content={"There is no articles yet :("} />
            ) : (
                articles.map((item) => (
                    <Link
                        className="myArticleCard"
                        to={`/articles/${item.category.id}/${item.id}`}
                        key={item.id}
                    >
                        <div className="image">
                            <img
                                src={"http://localhost:8000/" + item.image}
                                alt=""
                            />
                        </div>
                        <div className="cardInfo">
                            <div className="name">{item.name}</div>
                            <div className="info category">
                                {" "}
                                {item.category.name}
                            </div>
                            <div className="info">
                                {item.content.slice(0, 200)}...
                            </div>
                            <div className="datestatus">
                                <div className="date">
                                    published at: {item.created_at}
                                </div>
                                <div className="like">
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
                                <div className="report">
                                    {" "}
                                    <AiOutlineWarning
                                        className="icon"
                                        size="3vmin"
                                    />
                                    {item.reports}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}
export default ProfileArticle;
