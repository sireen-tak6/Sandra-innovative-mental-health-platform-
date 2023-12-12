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
            <header className="main">
                <div>
                    <FontAwesomeIcon className="cube" icon={faCube} />
                    <FontAwesomeIcon className="cube" icon={faCube} />
                    <div className="content">
                        <h2 className="h2">
                            {" "}
                            Sandra Says <FontAwesomeIcon icon={faHandPaper} />
                        </h2>
                        <h4 className="h4">
                            {" "}
                            Protect Your Mental Health <br /> And Take Care Of
                            Your Nerve{" "}
                        </h4>

                        <Link to="/signup">
                            <Button className="btn"> Read More</Button>
                        </Link>
                    </div>
                </div>
                <div>
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
