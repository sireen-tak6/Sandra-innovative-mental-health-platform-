import React, { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import axiosClient from "../../axios";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//components
import CircularLoading from "../loadingprogress/loadingProgress";
import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses";

const PersonalInfo = () => {
    const [phoneLength, setphoneLength] = useState(0);
    const [addressLength, setAddressLength] = useState(0);

    const [universityLength, setuniversityLength] = useState(0);
    const [aboutLength, setaboutLength] = useState(0);
    const userID = localStorage.getItem("user-id");
    const userType = localStorage.getItem("user-type");
    const [Categories, setCategories] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState(null);
    useEffect(() => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        if (userType !== "doctor") {
            swalWithBootstrapButtons.fire(
                "you can't edit your personal information",
                "error"
            );
            navigate("/articles");
        }
    }, [userType]);

    useEffect(() => {
        const fetchData = async () => {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
            const formData = new FormData();
            formData.append("userID", parseInt(userID));
            formData.append("userType", userType);
            try {
                const response = await axiosClient.post(
                    `Settings/info`,
                    formData
                );
                if (response.data.status === 200) {
                    setDoctorInfo(response.data.user);
                    setDoctorInfo((prevInfo) => ({
                        ...prevInfo,
                        ["userID"]: parseInt(userID),
                    }));
                    setDoctorInfo((prevInfo) => ({
                        ...prevInfo,
                        ["userType"]: userType,
                    }));
                    if (response.data.user.speciality === null) {
                        setDoctorInfo((prevInfo) => ({
                            ...prevInfo,
                            ["speciality"]: "",
                        }));
                    }
                    if (response.data.user.gender === null) {
                        setDoctorInfo((prevInfo) => ({
                            ...prevInfo,
                            ["gender"]: "",
                        }));
                    }
                    console.log(doctorInfo);
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
    }, [userID]);

    useEffect(() => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        const fetchData = async () => {
            try {
                const response = await axiosClient.get("Categories");
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDoctorInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));

        console.log(doctorInfo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                text: "Do you want to update your personal information!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, update!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    if (doctorInfo.userID && doctorInfo.userType) {
                        if (doctorInfo.speciality === "") {
                            doctorInfo.speciality = null;
                        }
                        if (doctorInfo.gender === "") {
                            doctorInfo.gender = null;
                        }
                        console.log(doctorInfo);

                        try {
                            // Send updated doctor information to the server
                            const response = await axiosClient.post(
                                "Settings/PersonalInfo",
                                doctorInfo
                            );
                            if (response.data.status === 200) {
                                swalWithBootstrapButtons.fire(
                                    "",
                                    response.data.message,
                                    "success"
                                );
                            } else {
                                swalWithBootstrapButtons.fire(
                                    "",
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
                    }
                }
            });
    };
    if (doctorInfo !== null) {
        return (
            <div className="j">
                <div className="title">Personal Information</div>

                <Form onSubmit={handleSubmit}>
                    <div className="line">
                        <div className="block">
                            <div>
                                <label>Address :</label>
                            </div>
                            <input
                                placeholder="address"
                                type="text"
                                value={doctorInfo.address}
                                name="address"
                                className="input"
                                maxLength={50}
                                onChange={handleChange}
                            />
                            <span className="lenght">
                                {doctorInfo.address &&
                                doctorInfo.address.length > 0
                                    ? doctorInfo.address.length
                                    : 0}
                                /{50}
                            </span>
                        </div>
                        <div className="block">
                            {" "}
                            <div>
                                <label>Phone :</label>
                            </div>
                            <input
                                placeholder="phone"
                                type="text"
                                value={doctorInfo.phone}
                                name="phone"
                                className="input"
                                maxLength={16}
                                onChange={handleChange}
                            />
                            <span className="lenght">
                                {doctorInfo.phone && doctorInfo.phone.length > 0
                                    ? doctorInfo.phone.length
                                    : 0}
                                /{16}
                            </span>
                        </div>
                    </div>
                    <div className="line">
                        <div className="block">
                            <div>
                                <label>Specialization :</label>
                            </div>

                            <select
                                value={doctorInfo.speciality}
                                onChange={handleChange}
                                name="speciality"
                            >
                                <option value="">Speciality</option>
                                {Categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="block">
                            <div>
                                <label>Gender :</label>
                            </div>

                            <select
                                value={doctorInfo.gender}
                                onChange={handleChange}
                                name="gender"
                            >
                                <option value="">Gender</option>
                                <option key="male" value={0}>
                                    male
                                </option>
                                <option key="female" value={1}>
                                    female
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="block">
                        <div>
                            <label>University :</label>
                        </div>
                        <input
                            placeholder="university"
                            type="text"
                            value={doctorInfo.university}
                            name="university"
                            className="input"
                            maxLength={100}
                            onChange={handleChange}
                        />
                        <span className="lenght">
                            {doctorInfo.university &&
                            doctorInfo.university.length > 0
                                ? doctorInfo.university.length
                                : 0}
                            /{100}
                        </span>
                    </div>
                    <div className="block">
                        <div>
                            <label>About :</label>
                        </div>

                        <textarea
                            placeholder="about"
                            type="text"
                            value={doctorInfo.about}
                            name="about"
                            className="textarea"
                            maxLength={120}
                            onChange={handleChange}
                        />
                        <span className="lenght">
                            {doctorInfo.about && doctorInfo.about.length > 0
                                ? doctorInfo.about.length
                                : 0}
                            /{120}
                        </span>
                    </div>
                    <button className="saveButton"> save</button>
                </Form>
            </div>
        );
    } else {
        return (
            <div className="j">
                <div className="title">Personal Information</div>
                <div className="loading">
                    <CircularLoading />
                </div>
            </div>
        );
    }
};
export default PersonalInfo;
