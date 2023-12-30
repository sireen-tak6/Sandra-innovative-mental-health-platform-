import React, { useState } from "react";
export const SearchContext = React.createContext();

//used in (pendingArticles/myArticles,components/PendingArticles/articleTypes)
const SearchProv = ({ children }) => {
    const [query, setQuery] = useState(null);
    const [click, setClick] = useState(false);
    const [doctor, setdoctor] = useState(true);
    const [article, setarticle] = useState(true);
    const [doctorresult, setdoctorresult] = useState([]);
    const [articleresult, setarticleresult] = useState([]);
    const [click2, setClick2] = useState(false);

    console.log(query);

    return (
        <SearchContext.Provider
            value={{
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
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
export default SearchProv;
