import React, { useState, useContext } from "react";
import axiosClient from "../../axios";
import { useNavigate } from "react-router-dom";
import { Search } from "react-bootstrap-icons";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./Search.css";

//providers
import { SearchContext } from "../../Providers/SearchProvider";
import CircularLoading from "../loadingprogress/loadingProgress";

const SearchScreen = ({ id }) => {
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
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();

    const onClose = () => {
        setClick(false);
        console.log(click);
    };
    function onUpdate(value) {
        setQuery(value);
    }
    const search = async (event) => {
        event.preventDefault();

        onClose();
        setClick2(true);
        navigate("/SearchResult");
    };
    return (
        <div className="SearchOverlay">
            {loading ? (
                <div className="SearchContainer">
                    {" "}
                    <CircularLoading />
                </div>
            ) : (
                <div className="SearchContainer">
                    <div className="titlePart">
                        <p>Type Keyword..</p>
                        <button
                            type="button"
                            className="closeButton"
                            onClick={onClose}
                        >
                            X
                        </button>
                    </div>

                    <form className="SearchForm">
                        <div className="SearchArea">
                            <input
                                type="text"
                                className="Search"
                                placeholder="ex. doctor-name , article-title.."
                                value={query}
                                onChange={(e) => onUpdate(e.target.value)}
                            />
                        </div>
                        <div className="checks">
                            <div className="check">
                                <input
                                    type="checkbox"
                                    checked={doctor}
                                    onChange={(e) =>
                                        setdoctor(e.target.checked)
                                    }
                                />
                                Doctor
                            </div>
                            <div className="check">
                                <input
                                    type="checkbox"
                                    checked={article}
                                    onChange={(e) =>
                                        setarticle(e.target.checked)
                                    }
                                />
                                Article
                            </div>
                        </div>
                        <div className="buttonPart">
                            <button
                                type="button"
                                className="saveButton"
                                onClick={search}
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SearchScreen;
