import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCube,
    faSterlingSign,
    faHandPaper,
    faSquare,
} from "@fortawesome/free-solid-svg-icons";

//css
import "./HomeSection.css";

export default function HomeSection() {
    const vid = "../assets/intro.mp4";

    return (
        <div>
            <header className="">
                <div className="">
                    <video
                        src={vid}
                        controls
                        autoPlay
                        loop
                        type="video/mp4"
                        className="video"
                    />
                </div>
                <FontAwesomeIcon className="line" icon={faSterlingSign} />
            </header>
            <FontAwesomeIcon className="square" icon={faSquare} />
        </div>
    );
}
