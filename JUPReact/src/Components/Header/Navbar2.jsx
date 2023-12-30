import React, { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavDropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NutFill, Search } from "react-bootstrap-icons";
import axiosClient from '../../axios';

//css
import "./Navbar2.css";

//images
import Logo from "./sandralogo.png";
import icon from "./usericon.png";

//components
import SearchScreen from "../Search/Search";

//providers
import { SearchContext } from "../../Providers/SearchProvider";
function Navbarr() {
    const { query, setQuery, click, setClick } = useContext(SearchContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    function Logout() {
        const userType = localStorage.getItem("user-type");
        const userId = localStorage.getItem("user-id");

        // Make a POST request to the logout API
        axiosClient
            .post(`/logout/${userType}/${userId}`)
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

    let user = localStorage.getItem("user-name");
    console.log(user);

    const handleClickSearch = () => {
        setClick(true);
        console.log(click);
    };

    return (
        <Container className="Container">
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
                            Sandra
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="me-auto">
                            <Nav.Link href="/user" className="l">
                                Home
                            </Nav.Link>

                            <Nav.Link href="/doctor" className="l">
                                Doctors
                            </Nav.Link>
                            <Nav.Link href="/articles" className="l">
                                Articles
                            </Nav.Link>

                            {localStorage.getItem("user-info") ? (
                                <>
                                    <Nav.Link href="#chatbot" className="l">
                                        Talk to Sandra
                                    </Nav.Link>
                                    <Nav.Link href="/chats" className="l">
                                        Chats
                                    </Nav.Link>
                                    {localStorage.getItem("user-type") !="patient"&&localStorage.getItem("user-type")!="admin"? (
                                        <Nav.Link href="/verfiy" className="l">
                                            verfiy
                                        </Nav.Link>
                                    ) : null}
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
                                        Signup
                                    </Nav.Link>

                                    <Nav.Link href="/login" className="l">
                                        Login
                                    </Nav.Link>
                                </>
                            )}

                            <div className="info">
                                {localStorage.getItem("user-info") ? (
                                    <>
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
                                        <NavDropdown title={user} className="o">
                                            {Type === "doctor" ? (
                                                <NavDropdown.Item
                                                    href={`/doctorProile/${id}`}
                                                    className="o"
                                                >
                                                    My Profile
                                                </NavDropdown.Item>
                                            ) : null}
                                            <NavDropdown.Item
                                                href="/Settings"
                                                className="o"
                                            >
                                                Settings
                                            </NavDropdown.Item>

                                            <NavDropdown.Item
                                                onClick={Logout}
                                                className="o"
                                            >
                                                Logout
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
