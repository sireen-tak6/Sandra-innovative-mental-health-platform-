import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//css
import "./UseCasePart.css";
import UseCaseCard from "../useCaseCard/useCaseCard";
import { useTranslation } from 'react-i18next';

export default function UseCasePart() {
    const navigate = useNavigate();
    const bot = "../images/botIcon.svg";
    const doctor = "../images/DoctorsIcon.svg";
    const chat = "../images/chatIcon.svg";
    const article = "../images/articleIcon.svg";
    const { t, i18n } = useTranslation();
    return (
        <div className="section useCaseSection">
            <div className="useCaseTitle">{t('HomeUseCaseTitle')}</div>
            <div className="useCaseCards">
                <UseCaseCard
                    title={t('HomeUseCaseFirstTitle')}
                    content={t('HomeUseCaseFirstDes')}
                    image={doctor}
                />
                <UseCaseCard
                    title={t('HomeUseCaseSecTitle')}
                    content={t('HomeUseCaseSectDes')}
                    image={bot}
                />
                <UseCaseCard
                    title={t('HomeUseCaseThiTitle')}
                    content={t('HomeUseCaseThiDes')}
                    image={chat}
                />
                <UseCaseCard
                    title={t('HomeUseCaseFourthTitle')}
                    content={t('HomeUseCaseFourthDes')}
                    image={chat}
                />
                <UseCaseCard
                    title={t('HomeUseCaseFifthTitle')}
                    content={t('HomeUseCaseFifthDes')}
                    image={article}
                />
            </div>
        </div>
    );
}
