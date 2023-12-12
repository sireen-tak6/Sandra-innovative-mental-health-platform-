import React, { useState } from "react";
export const ArticlesContext = React.createContext();

//used in (ShowArticles)
const ArticlesProv = ({ children }) => {
    const [Articles, setArticles] = useState([]);
    console.log(Articles);
    return (
        <ArticlesContext.Provider value={{ Articles, setArticles }}>
            {children}
        </ArticlesContext.Provider>
    );
};
export default ArticlesProv;
