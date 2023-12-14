import React, { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import axiosClient from "../../axios";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//components
import CategoryDropdown from "../dropDownCat/dropDownCat";
import CircularLoading from "../loadingprogress/loadingProgress";

const PersonalInfo = () => {
    const [doctor, setdoctor] = useState();
    const [address, setaddress] = useState();
    const [phone, setphone] = useState();
    const [specialization, setspecialization] = useState();
    const [university, setuniversity] = useState();
    const [about, setabout] = useState();
    const [certificate, setcertificate] = useState();
    const [phoneLength, setphoneLength] = useState(0);
    const [AddressLength, setAddressLength] = useState(0);
    const [specializationLength, setspecializationLength] = useState(0);
    const [universityLength, setuniversityLength] = useState(0);
    const [aboutLength, setaboutLength] = useState(0);
    const userID = localStorage.getItem("user-id");
    const userType = localStorage.getItem("user-type");
    const [Categories, setCategories] = useState(0);

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
                    setdoctor(response.data.user);
                    setaddress(response.data.user.address );
                    setabout(response.data.user.about );
                    setphone(response.data.user.phone );
                    setuniversity(response.data.user.university );
                    setspecialization(response.data.user.speciality );
                    setAddressLength(50 - response.data.user.address.length);
                    setaboutLength(120 - response.data.user.about.length);
                    setphoneLength(16-response.data.user.phone.length);
                    setuniversityLength(100-response.data.user.university.length);
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

    const addressChange = (event) => {
        const value = event.target.value;
        setaddress(value);
        setAddressLength(value.length);
    };
    const phoneChange = (event) => {
        const value = event.target.value;
        setphone(value);
        setphoneLength(value.length);
    };
    const universityChange = (event) => {
        const value = event.target.value;
        setuniversity(value);
        setuniversityLength(value.length);
    };
    const aboutChange = (event) => {
        const value = event.target.value;
        setabout(value);
        setaboutLength(value.length);
    };
    const certificateChange = (event) => {
        const value = event.target.value;
        setcertificate(value);
    };
    const handleSubmit = async (event) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        event.preventDefault();

        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const formData = new FormData();
        formData.append("address", address);
        formData.append("phone", phone);
        formData.append("about", about);
        formData.append("university", university);
        formData.append("specialization", specialization);
        formData.append("userID", parseInt(userID));
        formData.append("userType", userType);

        try {
            const response = await axiosClient.post(
                "Settings/PersonalInfo",
                formData
            );
            console.log(response);
            if (response.data.status === 200) {
                swalWithBootstrapButtons.fire(
                    "your password has been updated.",
                    "success"
                );
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Your Password can not been updated",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);
            swalWithBootstrapButtons.fire(error.response.statusText, "error");
        }
    };
    if (doctor !== null) {
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
                                value={address}
                                name="address"
                                onChange={addressChange}
                                className="input"
                                maxLength={50}
                            />
                        </div>
                        <div className="block">
                            {" "}
                            <div>
                                <label>Phone :</label>
                            </div>
                            <input
                                placeholder="phone"
                                type="text"
                                value={phone}
                                name="phone"
                                onChange={phoneChange}
                                className="input"
                                maxLength={16}
                            />
                            <span className="lenght">
                                {phoneLength}/{16}
                            </span>
                        </div>
                    </div>
                    <div className="block">
                        <div>
                            <label>specialization :</label>
                        </div>

                        <CategoryDropdown
                            selectedCategory={specialization}
                            setSelectedCategory={setspecialization}
                            Categories={Categories}
                        />
                    </div>
                    <div className="block">
                        <div>
                            <label>university :</label>
                        </div>
                        <input
                            placeholder="university"
                            type="text"
                            value={university}
                            name="university"
                            onChange={universityChange}
                            className="input"
                            maxLength={100}
                        />
                        <span className="lenght">
                            {universityLength}/{100}
                        </span>
                    </div>
                    <div className="block">
                        <div>
                            <label>about :</label>
                        </div>
                        <textarea
                            placeholder="about"
                            type="text"
                            value={about}
                            name="about"
                            onChange={aboutChange}
                            className="input"
                            maxLength={120}
                        />
                        <span className="lenght">
                            {aboutLength}/{120}
                        </span>
                    </div>
                    <button className="saveButton"> save</button>
                </Form>
            </div>
        );
    } else {
        <div className="j">
            <div className="title">Personal Information</div>
            <CircularLoading />;
        </div>;
    }
};
export default PersonalInfo;
