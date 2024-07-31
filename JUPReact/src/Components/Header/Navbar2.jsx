import React, { useState, useContext, useRef } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavDropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NutFill, Search } from "react-bootstrap-icons";
import axiosClient from "../../axios";

//css
import "./Navbar2.css";

//images
import Logo from "./sandralogo.png";
import icon from "./usericon.png";

//components
import SearchScreen from "../Search/Search";

//providers
import { SearchContext } from "../../Providers/SearchProvider";
import Notifications from "../Notifications/Notifications/Notifications";
import { useTranslation } from "react-i18next";

function Navbarr() {
    const { t, i18n } = useTranslation();
    const left = useRef(false);

    const { query, setQuery, click, setClick } = useContext(SearchContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
//    const user=useRef();
    function Logout() {
        const Type = localStorage.getItem("user-type");
        const userId = localStorage.getItem("user-id");

        // Make a POST request to the logout API
        axiosClient
            .post(`/logout/${Type}/${userId}`)
            .then((response) => {
                console.log(response.data.message); // Success message from the backend
                localStorage.clear();
                navigate("/login");
            })
            .catch((error) => {
                console.error(error);
                // Handle any errors that occur during the API call
            });
    }
    let id = localStorage.getItem("user-id");
    let Type = localStorage.getItem("user-type");
    if (typeof localStorage.getItem("user-info") == "string") {

        var user = JSON.parse(localStorage.getItem("user-info"));
    }
    console.log(user)
    let Secretary = JSON.parse(localStorage.getItem("user-Secretary"));
    console.log(Secretary);

    const handleClickSearch = () => {
        setClick(true);
        console.log(click);
    };
    const ChangeLang = (lng) => {
        left.current = !left.current;
        console.log(left.current);
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === "ar" ? "rtl" : "ltr"; // Set direction
    };
    return (
        <Container className="">
            <Navbar className="Nav" expand="md" fixed="top">
                <Container fluid>
                    <Navbar.Brand href="/user">
                        <div className="brand">
                            <div>
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    height="30"
                                    width="30"
                                    className="logoImage"
                                />
                            </div>
                            {/*{t("BrandName")}*/}
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="me-auto">
                            <Nav.Link href="/home" className="l">
                                {t("NavbarHome")}
                            </Nav.Link>
                            {Type!="admin" &&
                            <Nav.Link href="/posts" className="l">
                                {t("posts")}
                            </Nav.Link>}
                            {Type != "admin" ? (
                                <Nav.Link href="/doctor" className="l">
                                    {t("NavbarDoctors")}
                                </Nav.Link>
                            ) : null}
                            {Type == "doctor" || Type == "secretary" ? (
                                <Nav.Link href="/Patients" className="l">
                                    {t("NavbarPatients")}
                                </Nav.Link>
                            ) : null}
                            <Nav.Link href="/articles" className="l">
                                {t("NavbarArticles")}
                            </Nav.Link>

                            {localStorage.getItem("user-info") ? (
                                <>
                                    {Type == "patient" ? (
                                        <Nav.Link href="/Chatbot" className="l">
                                            {t("NavbarTalk")}
                                        </Nav.Link>
                                    ) : null}
                                    {Type !== "admin" &&
                                    Type !== "secretary" ? (
                                        <Nav.Link href="/chats" className="l">
                                            {t("NavbarChats")}
                                        </Nav.Link>
                                    ) : null}
                                    {Type == "admin" ? (
                                        <>
                                            <Nav.Link
                                                href="/request/verfiy"
                                                className="l"
                                            >
                                                {t("NavbarVerReq")}
                                            </Nav.Link>
                                            <Nav.Link
                                                href="/control/doctors"
                                                className="l"
                                            >
                                                {t("NavbarDoctors")}
                                            </Nav.Link>
                                            <Nav.Link
                                                href="/admin/posts"
                                                className="l"
                                            >
                                                {t("postManage")}
                                            </Nav.Link>
                                        </>
                                    ) : null}
                                    {Type == "doctor" &&
                                    user?.isVerfiy == 0 ? null : (
                                        <Nav.Link
                                            href={`/appointments`}
                                            // href={`/newAppointment/${Type=="secretary"?user.doctorID:id}`}
                                            className="l"
                                        >
                                            {t("NavbarAppointments")}
                                        </Nav.Link>
                                    )}
                                    {Type != "admin" && Type != "patient" ? (
                                        Type == "doctor" &&
                                        user?.isVerfiy == 0 ? null : (
                                            <>
                                                <Nav.Link
                                                    href="/Schedule"
                                                    className="l"
                                                >
                                                    {t("NavbarSchedule")}
                                                </Nav.Link>
                                            </>
                                        )
                                    ) : null}
                                    {Type != "admin" ? (
                                        <>
                                            <Nav.Link
                                                href="/customerService"
                                                className="l"
                                            >
                                                {t("NavbarCustomerService")}
                                            </Nav.Link>
                                        </>
                                    ) : null}
                                    <>
                                        <Nav.Link
                                            href="/complaints"
                                            className="l"
                                        >
                                            {t("NavbarComplaints")}
                                        </Nav.Link>
                                    </>
                                    <Nav.Link className="l">
                                        <div className="s">
                                            <button
                                                className="button"
                                                onClick={handleClickSearch}
                                            >
                                                <FontAwesomeIcon
                                                    className="star"
                                                    icon={faSearch}
                                                ></FontAwesomeIcon>
                                            </button>
                                        </div>
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link className="l">
                                        <div className="s">
                                            <button
                                                className="button"
                                                onClick={handleClickSearch}
                                            >
                                                <FontAwesomeIcon
                                                    className="star"
                                                    icon={faSearch}
                                                ></FontAwesomeIcon>
                                            </button>
                                        </div>
                                    </Nav.Link>
                                    <Nav.Link href="/signup" className="l">
                                        {t("NavbarSignup")}
                                    </Nav.Link>

                                    <Nav.Link href="/login" className="l">
                                        {t("NavbarLogin")}
                                    </Nav.Link>
                                </>
                            )}
                            {localStorage.getItem("user-info") ? null : (
                                <Nav.Link className="l">
                                    {" "}
                                    <div className="language-toggle2 ">
                                        <div className="button-box">
                                            <div
                                                className={`btn ${
                                                    left.current ? "left" : ""
                                                }`}
                                            ></div>
                                            <button
                                                type="button"
                                                className={`toggle-btn ${
                                                    left.current
                                                        ? ""
                                                        : "selected"
                                                }`}
                                                onClick={() => ChangeLang("en")}
                                            >
                                                {t("NavbarEn")}
                                            </button>
                                            <button
                                                type="button"
                                                className={`toggle-btn ${
                                                    left.current
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() => ChangeLang("ar")}
                                            >
                                                {t("NavbarAr")}
                                            </button>
                                        </div>{" "}
                                    </div>
                                </Nav.Link>
                            )}
                            <div className="info">
                                {localStorage.getItem("user-info") ? (
                                    <>
                                        <Notifications />
                                        <Nav.Link>
                                            <div className="userInfo">
                                                <img
                                                    src={icon}
                                                    alt="user"
                                                    height="30"
                                                    width="30"
                                                />
                                            </div>
                                        </Nav.Link>
                                        <NavDropdown
                                            title={localStorage.getItem(
                                                "user-name"
                                            )}
                                            className="o"
                                        >
                                            {Type === "doctor" ? (
                                                <>
                                                    <NavDropdown.Item
                                                        href={`/doctorProile/${id}`}
                                                        className="o"
                                                    >
                                                        {t("NavbarProfile")}
                                                    </NavDropdown.Item>
                                                    {!Secretary &&
                                                        user?.isVerfiy == 1 && (
                                                            <NavDropdown.Item
                                                                href={`/AddSecretary`}
                                                                className="o"
                                                            >
                                                                {t(
                                                                    "NavbarAddSec"
                                                                )}
                                                            </NavDropdown.Item>
                                                        )}
                                                </>
                                            ) : null}
                                            {Type === "patient" ? (
                                                <>
                                                    <NavDropdown.Item
                                                        href={`/patientProfile/${id}`}
                                                        className="o"
                                                    >
                                                        {t("NavbarProfile")}
                                                    </NavDropdown.Item>
                                                </>
                                            ) : null}
                                            <NavDropdown.Item className="o">
                                                <div className="language-toggle">
                                                    <div className="button-box">
                                                        <div
                                                            className={`btn ${
                                                                left.current
                                                                    ? "left"
                                                                    : ""
                                                            }`}
                                                        ></div>
                                                        <button
                                                            type="button"
                                                            className={`toggle-btn ${
                                                                left.current
                                                                    ? ""
                                                                    : "selected"
                                                            }`}
                                                            onClick={() =>
                                                                ChangeLang("en")
                                                            }
                                                        >
                                                            {t("NavbarEn")}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`toggle-btn ${
                                                                left.current
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                ChangeLang("ar")
                                                            }
                                                        >
                                                            {t("NavbarAr")}
                                                        </button>
                                                    </div>{" "}
                                                </div>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                href="/Settings"
                                                className="o"
                                            >
                                                {t("NavbarSettings")}
                                            </NavDropdown.Item>

                                            <NavDropdown.Item
                                                onClick={Logout}
                                                className="o"
                                            >
                                                {t("NavbarLogout")}
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                ) : null}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {showModal && <SearchScreen onClose={handleCloseModal} id={id} />}
        </Container>
    );
}

export default Navbarr;
