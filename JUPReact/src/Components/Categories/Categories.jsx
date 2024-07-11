import React, { useContext, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosClient from "../../axios";
import { useTranslation } from "react-i18next";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./Categories.css";

//providers
import { MyContext } from "../../Providers/ArticleCategoryprov";

const Categories = () => {
    const {t } = useTranslation();

    const { Category, Categories, handleUpdate, setCategories } =
        useContext(MyContext);
    const userType = localStorage.getItem("user-type");

    function onUpdate(value) {
        console.log(value);
        handleUpdate(value);
    }

    useEffect(() => {
        const fetchData = async () => {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
            try {
                const response = await axiosClient.get("/Categories");
                if (response.data.status === 200) {
                    setCategories(response.data["Category"]);
                } else {
                    swalWithBootstrapButtons.fire(
                        response.data.message,
                        "error"
                    );
                }
            } catch (error) {
                console.log(error);
                swalWithBootstrapButtons.fire(
                    error.response.statusText,
                    "error"
                );
            }
        };
        fetchData();
    }, []);

    return (
        <div className="Categories">
            <div className="titleAdd">
                <h2> {t('CategoriesTitle')}</h2>
                {userType === "doctor" ? (
                    <>
                        <Link to="pending" id="addArticle" className="link">
                        {t('CategoriesPendingButton')}
                        </Link>
                        <Link to="AddArticle" id="addArticle" className="link">
                        {t('CategoriesAddButton')} 
                        </Link>
                    </>
                ) : userType === "admin" ? (
                    <Link to="pending" id="addArticle" className="link">
                       {t('CategoriesPendingButton')} 
                    </Link>
                ) : null}
            </div>

            <br />
            <h6>
            {t('CategoriesDes')}  
            </h6>
            <Row>
                <Col>
                    <div className="cat">
                    {t('CategoriesDes2')} <br />
                        <button
                            onClick={() => onUpdate(0)}
                            id={0}
                            className={Category === 0 ? "selected" : "none"}
                        >
                            {" "}
                            {t('CategoriesAll')}   
                        </button>
                        {Categories.length > 0
                            ? Categories.map((item) => (
                                  <button
                                      onClick={() => onUpdate(item.id)}
                                      id={item.id}
                                      className={
                                          Category === item.id
                                              ? "selected"
                                              : "none"
                                      }
                                  >
                                      {item.name}
                                  </button>
                              ))
                            : null}
                        {userType == "patient" ? (
                            <button
                                onClick={() => onUpdate(11)}
                                id={0}
                                className={
                                    Category === 11 ? "selected" : "none"
                                }
                            >
                                {" "}
                                {t('CategoriesFav')}  
                            </button>
                        ) : null}
                    </div>
                </Col>
            </Row>
        </div>
    );
};
export default Categories;
