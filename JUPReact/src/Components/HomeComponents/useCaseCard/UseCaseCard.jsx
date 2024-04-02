import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//css
import "./UseCaseCard.css";
export default function UseCaseCard({ title, content, image }) {
    const navigate = useNavigate();
    return (
        <div className="UseCaseCard">
            <div className="title">{title}</div>
            <div className="content">{content}</div>
            <div className="image">
                <img src={image} />
            </div>
        </div>
    );
}
