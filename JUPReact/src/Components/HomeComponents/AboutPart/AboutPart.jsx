import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//css
import "./AboutPart.css";
export default function AboutPart() {
    const navigate = useNavigate();
    return (
        <div className="section AboutSection">
            <div className="AboutSection2">
                <div className="aboutText">
                    <div className="Title">About us</div>
                    <div className="aboutText2">
                        <b>Sandra</b> is more than just a platform, it's a
                        community. Here, patients and doctors connect to empower
                        one another on the journey to better mental well-being.
                        We believe everyone deserves access to trusted expertise
                        and personalized care, and that's exactly what we
                        provide.
                    </div>
                </div>
            </div>
            <div className="image">
                <img src="../images/aboutpic.jpg" alt="" />
            </div>
        </div>
    );
}
