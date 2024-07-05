import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//css
import "./numbersCard.css";

export default function NumbersCard({ title, count, color, image }) {
    const navigate = useNavigate();

    return (
        <div className={"numbersCard " + color}>
            <div className="content">
                <div className="cardTitle">{title} : </div>
                <div className="CardCount"> {count} </div>
            </div>
            <div className="image">
                <img src={image} />
            </div>
        </div>
    );
}
