import React, { useEffect ,useContext} from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//components
import Footer2 from "../../Components/Footer/Footer2";
import Navbarr from "../../Components/Header/Navbar2";
import { SearchContext } from "../../Providers/SearchProvider";
import SearchScreen from "../../Components/Search/Search";

const RootLayout = () => {
    const excludedPaths = ["/login", "/signup", "/AddArticle"];
    const excludedPaths2 = [
        "/pending",
        "/update",
        "/AddArticle",
        "/chats",
        "/chat",
        "/Settings",
    ];

    const location = useLocation();
    const boole =
        (location.pathname.includes("/update") &&
            location.pathname.includes("/articles")) ||
        excludedPaths.some((path) => location.pathname.includes(path));

    const navigate = useNavigate();
    const { query ,setQuery,click,setClick } = useContext(SearchContext);
    console.log(localStorage.getItem("user-info"));
    useEffect(() => {
        if (
            !localStorage.getItem("user-info") &&
            excludedPaths2.some((path) => location.pathname.includes(path))
        ) {
            navigate("/login");
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
