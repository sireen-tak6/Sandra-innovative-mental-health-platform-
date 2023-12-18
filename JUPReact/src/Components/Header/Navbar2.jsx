import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

//css
import "./Navbar2.css";

//images
import Logo from "./sandralogo.png";
import icon from "./usericon.png";
import { NutFill } from "react-bootstrap-icons";

function Navbarr() {
    const navigate = useNavigate();

    function Logout() {
        localStorage.clear();
        navigate("/login");
    }
    let id = localStorage.getItem("user-id");
    let Type = localStorage.getItem("user-type");

    let user = localStorage.getItem("user-name");
    console.log(user);
    return (
        <Container>
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
                            {localStorage.getItem("user-info") ? (
                                <>
                                    <Nav.Link href="/user" className="l">
                                        Home
                                    </Nav.Link>
                                    <Nav.Link href="#chatbot" className="l">
                                        Talk to Sandra
                                    </Nav.Link>
                                    <Nav.Link href="/doctor" className="l">
                                        Doctors
                                    </Nav.Link>
                                    <Nav.Link href="/articles" className="l">
                                        Articles
                                    </Nav.Link>
                                    <Nav.Link href="/chats" className="l">
                                        Chats
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
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
        </Container>
    );
}

export default Navbarr;
