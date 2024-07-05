import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

//css
import "./AboutPart.css";
export default function AboutPart() {
    const navigate = useNavigate();
    const {t } = useTranslation();

    return (
        <div className="section AboutSection">
            <div className="AboutSection2">
                <div className="aboutText">
                    <div className="Title">{t('HomeAboutTitle')}</div>
                    <div className="aboutText2">
                        <b>{t('BrandName')}</b> ... {t('HomeAboutBody')}
                    </div>
                </div>
            </div>
            <div className="image">
                <img src="../images/aboutpic.jpg" alt="" />
            </div>
        </div>
    );
}
