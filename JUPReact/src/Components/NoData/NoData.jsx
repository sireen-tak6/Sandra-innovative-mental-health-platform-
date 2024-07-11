import React from "react";

//css
import "./NoData.css";

const NoData = ({ content }) => {
    return (
        <>
            <div className="NoDataContainer">
                <p id="content">{content} </p>
            </div>
        </>
    );
};
export default NoData;
