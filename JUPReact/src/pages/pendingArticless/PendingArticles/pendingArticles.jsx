import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axiosClient from "../../../axios";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./pendingArticles.css";

//components
import NoData from "../../../Components/NoData/NoData";
import PendingBlog from "../../../Components/PendingArticles/pendingBlog/pendingBlog";
import PendingArticlesHeader from "../../../Components/PendingArticles/pendingArticlesHeader/pendingArticlesHeader";

const PendingArticles = () => {
    const [Visible, setVisible] = useState(6);
    const [Articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });

            if (
                !localStorage.getItem("doctor-verify") &&
                localStorage.getItem("user-type") == "doctor"
            ) {
                swalWithBootstrapButtons.fire(
                    "please verify your account by certificate first.",
                    "just verified accounts can review articles",
                    "warning"
                );
                navigate("/articles");
            }

            const userID = localStorage.getItem("user-id");
            const userType = localStorage.getItem("user-type");
            console.log(`userID:${userID}`);
            console.log(`userType:${userType}`);
            try {
                const response = await axiosClient.post(`Articles/pending`, {
                    userID,
                    userType,
                });
                console.log(response);
                if (response.data["status"] !== 200) {
                    Swal.fire(response.data.message);
                } else {
                    setArticles(response.data["Articles"]);
                }
            } catch (error) {
                swalWithBootstrapButtons.fire(
                    error.response.statusText,
                    "error"
                );
            }
        };
        fetchData();
    }, []);

    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 9);
    };

    function buttonVisible() {
        if (Visible < Articles.length) {
            return (
                <div class="ButtonContainer">
                    <Button onClick={showMoreItems} className="LoadMoreButton">
                        load More
                    </Button>
                </div>
            );
        } else {
            return <div></div>;
        }
    }

    if (Articles.length > 0) {
        return (
            <>
                <PendingArticlesHeader />
                <div className="pendingArticlesContainer">
                    <section className="blog">
                        <div className="container grid3">
                            {Articles.slice(0, Visible).map((item) => (
                                <PendingBlog
                                    id={item.id}
                                    title={item.name}
                                    category={item.category.name}
                                    image={item.image}
                                    content={item.content}
                                    date={item.date}
                                    accept={item.acceptCount ?? null}
                                    reject={item.rejectCount ?? null}
                                />
                            ))}
                        </div>
                        {buttonVisible()}
                    </section>
                </div>
            </>
        );
    } else {
        return (
            <>
                <PendingArticlesHeader />

                <NoData content="No Pending Articles :)" />
            </>
        );
    }
};
export default PendingArticles;
