import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//css
import "./HeadingPart.css";
export default function HeadingPart() {
    const navigator = useNavigate();
    const SignUp = () => {
        navigator("/signup");
    };
    const Login = () => {
        navigator("/login");
    };

    return (
        <div className="section headingSection">
            <div className="headingContent">
                <div className="websiteTitle">
                    Sandra: Your Partner in Wellness
                </div>
                <div className="headingtext">
                    <p>Start your journey to well-being today.</p>
                    <p>
                        Explore our resources and connect with the support you
                        deserve.
                    </p>
                </div>
                {localStorage.getItem("user-info") !== null ? null : (
                    <div className="headingbuttons">
                        <div>
                            <button className="button" onClick={() => SignUp()}>
                                Signup
                            </button>
                        </div>
                        <div>
                            <button
                                className="button s"
                                onClick={() => Login()}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
