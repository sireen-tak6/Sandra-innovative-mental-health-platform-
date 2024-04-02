import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";

import CircularLoading from "../../loadingprogress/loadingProgress";
import NoData from "../../NoData/NoData";
//css
import "./ArticlesPart.css";
import ArticleCard from "../ArticleCard/ArticleCard";
export default function ArticlesPart() {
    const navigate = useNavigate();
    const [Articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchDoctor();
    }, []);
    const ShowArticle = () => {
        navigate("/articles");
    };
    const fetchDoctor = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post("BestArticles");
            const data = response.data;
            console.log(response);
            if (data && data.articles) {
                setArticles(data.articles);
            } else {
                console.log("Error fetching data:", error);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="section ArticlesSection">
            <div className="ArticlesTitle">Curated Content</div>
            <div className="Articlestext">
                Grow & Thrive Empower yourself with the latest knowledge and
                practical tips. Read our top articles chosen to inspire and
                guide your personal growth.
            </div>
            <div className="TopArticles">
                {loading ? (
                    <CircularLoading />
                ) : Articles.length == 0 ? (
                    <NoData content="there is no Articles yet :(" />
                ) : (
                    <>
                        {Articles.slice(0, 3).map((article) => (
                            <ArticleCard
                                id={article.id}
                                title={article.name}
                                type="all"
                                isLiked={true}
                                name={article.category.name}
                                catid={article.category.id}
                                image={article.image}
                                doctorID={article.doctor}
                                content={article.content}
                                date={article.date}
                                likes={article.likes}
                            />
                        ))}
                    </>
                )}
            </div>
            <div className="Articlesbutton">
                <button type="button" onClick={() => ShowArticle()}> All Articles </button>
            </div>
        </div>
    );
}
