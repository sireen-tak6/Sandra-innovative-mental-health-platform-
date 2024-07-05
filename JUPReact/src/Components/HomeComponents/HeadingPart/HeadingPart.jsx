import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//css
import "./HeadingPart.css";
import { useTranslation } from 'react-i18next';

export default function HeadingPart() {
    const navigator = useNavigate();
    const SignUp = () => {
        navigator("/signup");
    };
    const Login = () => {
        navigator("/login");
    };
    const { t, i18n } = useTranslation();

  

    return (
        <div className="section headingSection">
            <div className="headingContent">
                <div className="websiteTitle">
                  {t('HomeHeadingTitle')}  
                </div>
                <div className="headingtext">
                    <p> {t('HomeHeadingFirstsen')}</p>
                    <p>
                    {t('HomeHeadingSecSen')} 
                    </p>
                </div>
                {localStorage.getItem("user-info") !== null ? null : (
                    <div className="headingbuttons">
                        <div>
                            <button className="button" onClick={() => SignUp()}>
                            {t('NavbarSignup')}   
                            </button>
                        </div>
                        <div>
                            <button
                                className="button s"
                                onClick={() => Login()}
                            >
                            {t('NavbarLogin')}    
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
