import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularLoading from "../../Components/loadingprogress/loadingProgress";
import axiosClient from "../../axios";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./AddArticle.css";

//components
import AddArticleForm from "../../Components/Forms/AddArticleForm/AddArticleForm";

const AddArticle = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [Category, setCategory] = useState(null);
    const [image, setImage] = useState(null);
    const [contentFile, setContentFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    const userType = localStorage.getItem("user-type");
    useEffect(() => {
        if (userType !== "doctor") {
            navigate("/articles");
        }
        if (!localStorage.getItem("doctor-verify")) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
            swalWithBootstrapButtons.fire(
                "please verify your account by certificate first.",
                "just verified accounts can publish articles",
                "warning"
            );
            navigate("/articles");

        }
    }, [userType]);

    const removeImg = (e) => {
        e.preventDefault(); // Prevent the default action

        setImage(null);
        setImageURL(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        console.log(image);
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageURL(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTextChange = (event) => {
        setContentFile(event.target.files[0]);
    };

    async function cancel() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Are you sure?",
                text: "data will not be saved",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, discard!",
                cancelButtonText: "No, stay!",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    console.log(result);
                    navigate(`/articles`);
                }
            });
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Are you sure?",
                text: "Do you want to add this article!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, add!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const userID = localStorage.getItem("user-id");
                    const userType = localStorage.getItem("user-type");
                    const formData = new FormData();
                    formData.append("name", title);
                    formData.append("image", image ?? "");
                    formData.append("content", contentFile);
                    formData.append("specialityID", Category);
                    formData.append("doctorID", parseInt(userID));
                    formData.append("userType", userType);

                    console.log(title);
                    console.log(image ?? "");
                    console.log(contentFile);
                    console.log(Category);
                    console.log(userID);
                    console.log(userType);

                    setIsLoading(true); // Show loading indicator

                    try {
                        const response = await axiosClient.post(
                            "/Articles/upload",
                            formData
                        );
                        setIsLoading(false); // Show loading indicator
                        console.log(response);
                        if (response.data.status === 200) {
                            swalWithBootstrapButtons.fire(
                                "article added.",
                                "Your article now added to pending list.",
                                "success"
                            );
                            navigate(`/articles`);
                        } else {
                            swalWithBootstrapButtons.fire(
                                response.data.message,
                                "Your changes has not been saved",
                                "error"
                            );
                        }
                    } catch (error) {
                        setIsLoading(false); // Show loading indicator

                        console.log(error);
                        swalWithBootstrapButtons.fire(
                            error.response.data.message,
                            "error"
                        );
                    }
                }
            });
    };

    return (
        <div className="AddArticlebod">
            <div className="AddArticle">
                <div className="pic"></div>
                <div className="right">
                    {isLoading ? (
                        <CircularLoading />
                    ) : (
                        <AddArticleForm
                            page="add"
                            cancel={cancel}
                            imageURL={imageURL}
                            image={image}
                            imagefunction={handleImageChange}
                            contentfunction={handleTextChange}
                            submit={handleSubmit}
                            title={title}
                            setTitle={setTitle}
                            Category={Category}
                            setCategory={setCategory}
                            removeImg={removeImg}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
export default AddArticle;
