import React from "react";
import { Container } from "react-bootstrap";

//css
import "./Admin.css";

import vid from "./intro.mp4";

export default function Admin() {
    return (
        <div>
            <Container>
                <video
                    className="vid"
                    src={vid}
                    controls
                    autoPlay
                    loop
                    type="video/mp4"
                />
            </Container>
        </div>
    );
}
