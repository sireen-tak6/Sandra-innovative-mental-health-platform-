import React, { useState } from "react";

//css
import "./ShowArticles.css";

//components
import Categories from "../../Components/Categories/Categories";
import Cards from "../../Components/blog/cards";
import Slider from "../../Components/Slider/Slider";

//providers
import ArticleCategoryProv from "../../Providers/ArticleCategoryprov";
import ArticlesProv from "../../Providers/Articlesprov";

const ShowArticles = () => {
    const [Category, setCategory] = useState(0);
    
    return (
        <div className="ShowArticles">
            <ArticleCategoryProv value={Category} onUpdate={setCategory}>
                <Categories />
                <Slider />
                <ArticlesProv>
                    <Cards />
                </ArticlesProv>
            </ArticleCategoryProv>
        </div>
    );
};
export default ShowArticles;
