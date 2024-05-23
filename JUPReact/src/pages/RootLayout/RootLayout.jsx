import React, { useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//components
import Footer2 from "../../Components/Footer/Footer2";
import Navbarr from "../../Components/Header/Navbar2";
import { SearchContext } from "../../Providers/SearchProvider";
import SearchScreen from "../../Components/Search/Search";

const RootLayout = () => {
    const notfooterexclude = ["/login", "/signup", "/AddArticle","/AddSecretary"];
    const notUserexclude = [
        "/pending",
        "/update",
        "/AddArticle",
        "/chats",
        "/chat",
        "/Settings",
        "/verfiy",
        "control",
    ];
    const DoctorExclude = ["control", "request"];
    const notVerifiedDoctorexclude = [
        "articles/pending",
        "articles/AddArticle",
        "update",
    ];
    const verifiedDoctorexclude = ["verfiy"];
    const verifiedDoctorexclude2 = ["request"];

    const AdminExclude = [
        "/myPendings",
        "/update",
        "/AddArticle",
        "/chats",
        "/chat",
    ];

    const patientExclude = [
        "/pending",
        "/update",
        "/AddArticle",
        "/verfiy",
        "control",
    ];

    const location = useLocation();

    const boole =
        (location.pathname.includes("/update") &&
            location.pathname.includes("/articles")) ||
        notfooterexclude.some((path) => location.pathname.includes(path));

    const NotVerDoctorBool = notVerifiedDoctorexclude.some((path) =>
        location.pathname.includes(path)
    );

    const verDoctorBool =
        !verifiedDoctorexclude2.some((path) =>
            location.pathname.includes(path)
        ) &&
        verifiedDoctorexclude.some((path) => location.pathname.includes(path));

    const DoctorBool = DoctorExclude.some((path) =>
        location.pathname.includes(path)
    );

    const AdminBool =
        AdminExclude.some((path) => location.pathname.includes(path)) ||
        verDoctorBool;
    const PatientBool = patientExclude.some((path) =>
        location.pathname.includes(path)
    );

    const navigate = useNavigate();
    const { query, setQuery, click, setClick } = useContext(SearchContext);
    console.log(localStorage.getItem("user-info"));
    useEffect(() => {
        if (
            !localStorage.getItem("user-info") &&
            notUserexclude.some((path) => location.pathname.includes(path))
        ) {
            navigate("/login");
        } else if (localStorage.getItem("user-type") == "doctor") {
            if (
                DoctorBool ||
                (NotVerDoctorBool && !localStorage.getItem("doctor-verify")) ||
                (verDoctorBool && localStorage.getItem("doctor-verify"))
            ) {
                navigate("/home");
            }
        } else if (localStorage.getItem("user-type") == "admin" && AdminBool) {
            navigate("/home");
        } else if (
            localStorage.getItem("user-type") == "patient" &&
            PatientBool
        ) {
            console.log(localStorage.getItem("user-type"));

            navigate("/home");
        }
    }, []);

    return (
        <div className="bd">
            <header>
                <Navbarr />
            </header>
            <main>
                <Outlet />
                {click && <SearchScreen></SearchScreen>}
            </main>

            {!boole ? (
                <footer>
                    <Footer2 />
                </footer>
            ) : null}
        </div>
    );
};
export default RootLayout;
