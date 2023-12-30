import React, { useState, useContext, useEffect } from "react";
import axiosClient from "../../axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Search } from "react-bootstrap-icons";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./SearchResult.css";
//providers
import { SearchContext } from "../../Providers/SearchProvider";

//components
import DoctorCard from "./doctorCard/doctorCard";
import ArticleCard from "./articleCard/articleCard";
import { shuffle } from "lodash";
import CircularLoading from "../../Components/loadingprogress/loadingProgress";
import NoData from "../../Components/NoData/NoData";
const SearchResult = ({ id }) => {
    const {
        query,
        setQuery,
        click,
        setClick,
        doctor,
        setdoctor,
        article,
        setarticle,
        doctorresult,
        setdoctorresult,
        articleresult,
        setarticleresult,
        click2,
        setClick2,
    } = useContext(SearchContext);
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const [allresult, setallresult] = useState([]);
    useEffect(() => {
        if (click2) {
            if (query === null) {
                navigate("/home");
            }
            const fetchData = async () => {
                setloading(true);
                const userID = localStorage.getItem("user-id");
                const userType = localStorage.getItem("user-type");
                const formData = new FormData();
                formData.append("query", query);
                formData.append("doctor", doctor);
                formData.append("article", article);
                formData.append("userType", userType);
                formData.append("userID", userID);

                const response = await axiosClient.post("Search", formData);
                console.log(response);
                setQuery(null);
                setdoctor(true);
                setarticle(true);
                try {
                    if (response.status === 200) {
                        console.log(response);
                        setarticleresult(response.data.articles);
                        setdoctorresult(response.data.doctors);
                        setallresult([
                            ...response.data.articles,
                            ...response.data.doctors,
                        ]);

                        setloading(false);
                    } else {
                        console.log(response.data);

                        swalWithBootstrapButtons.fire(
                            response.data.message,
                            "error"
                        );
                        navigate("/home");
                    }
                } catch (error) {
                    console.log(error);
                    navigate("/home");
                }
            };
            fetchData();
            setClick2(false);
        }
    }, [click2]);
    useEffect(() => {
        shuffle(allresult);
        console.log(allresult);
    }, [allresult]);
    const [selected, setselected] = useState(1);
    console.log(doctorresult);
    console.log(articleresult);
    if (loading) {
        return (
            <div className="SearchResult">
                <div className="classes">
                    <div className="partTitle">Results:</div>{" "}
                    <div className="class">
                        <button
                            onClick={() => setselected(1)}
                            id={1}
                            className={selected === 1 ? "selected" : "none"}
                        >
                            All{" "}
                        </button>
                    </div>
                    <div className="class">
                        <button
                            onClick={() => setselected(2)}
                            id={2}
                            className={selected === 2 ? "selected" : "none"}
                        >
                            Articles{" "}
                        </button>
                    </div>
                    <div className="class">
                        <button
                            onClick={() => setselected(3)}
                            id={3}
                            className={selected === 3 ? "selected" : "none"}
                        >
                            Doctors
                        </button>
                    </div>
                </div>
                <div className="result">
                    <CircularLoading />
                </div>
            </div>
        );
    } else if (
        doctorresult.length === 0 &&
        articleresult.length === 0 &&
        allresult.length === 0
    ) {
        return (
            <div className="SearchResult">
                <div className="classes">
                    <div className="partTitle">Results:</div>{" "}
                    <div className="class">
                        <button
                            onClick={() => setselected(1)}
                            id={1}
                            className={selected === 1 ? "selected" : "none"}
                        >
                            All{" "}
                        </button>
                    </div>
                    <div className="class">
                        <button
                            onClick={() => setselected(2)}
                            id={2}
                            className={selected === 2 ? "selected" : "none"}
                        >
                            Articles{" "}
                        </button>
                    </div>
                    <div className="class">
                        <button
                            onClick={() => setselected(3)}
                            id={3}
                            className={selected === 3 ? "selected" : "none"}
                        >
                            Doctors
                        </button>
                    </div>
                </div>
                <div className="result">
                    <NoData content={"there is no result"} />
                </div>
            </div>
        );
    } else {
        return (
            <div className="SearchResult">
                <div className="classes">
                    <div className="partTitle">Results:</div>{" "}
                    <div className="class">
                        <button
                            onClick={() => setselected(1)}
                            id={1}
                            className={selected === 1 ? "selected" : "none"}
                        >
                            All{" "}
                        </button>
                    </div>
                    <div className="class">
                        <button
                            onClick={() => setselected(2)}
                            id={2}
                            className={selected === 2 ? "selected" : "none"}
                        >
                            Articles{" "}
                        </button>
                    </div>
                    <div className="class">
                        <button
                            onClick={() => setselected(3)}
                            id={3}
                            className={selected === 3 ? "selected" : "none"}
                        >
                            Doctors
                        </button>
                    </div>
                </div>
                <div className="result">
                    {selected === 1 ? (
                        allresult.length > 0 ? (
                            allresult.map((item) =>
                                item.user_name ? (
                                    <DoctorCard item={item} />
                                ) : (
                                    <ArticleCard item={item} />
                                )
                            )
                        ) : (
                            <NoData content={"there is no result"} />
                        )
                    ) : selected === 2 ? (
                        articleresult.length > 0 ? (
                            articleresult.map((item) => (
                                <ArticleCard item={item} />
                            ))
                        ) : (
                            <NoData content={"there is no result"} />
                        )
                    ) : doctorresult.length > 0 ? (
                        doctorresult.map((item) => <DoctorCard item={item} />)
                    ) : (
                        <NoData content={"there is no result"} />
                    )}
                </div>
            </div>
        );
    }
};

export default SearchResult;
