import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//css
import "./UseCasePart.css";
import UseCaseCard from "../useCaseCard/useCaseCard";
export default function UseCasePart() {
    const navigate = useNavigate();
    const bot = "../images/botIcon.svg";
    const doctor = "../images/DoctorsIcon.svg";
    const chat = "../images/chatIcon.svg";
    const article = "../images/articleIcon.svg";

    return (
        <div className="section useCaseSection">
            <div className="useCaseTitle">Start Your Path to Better Health</div>
            <div className="useCaseCards">
                <UseCaseCard
                    title="Find the Right Certified Doctor"
                    content="Connect with qualified, certified doctors for personalized care."
                    image={doctor}
                />
                <UseCaseCard
                    title="Chat with Confidence"
                    content="Connect with our AI assistant for initial guidance."
                    image={bot}
                />
                <UseCaseCard
                    title="Book Appointments Online or Onsite"
                    content="Book appointments online or in-person. Pay securely electronically."
                    image={chat}
                />
                <UseCaseCard
                    title="Talk to a Doctor Online"
                    content="Receive personalized advice and support from the comfort of home."
                    image={chat}
                />
                <UseCaseCard
                    title="Learn from Experts"
                    content="Dive into expert-written, peer-reviewed articles on mental well-being."
                    image={article}
                />
            </div>
        </div>
    );
}
