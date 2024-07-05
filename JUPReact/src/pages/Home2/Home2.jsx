import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
//css
import "./Home2.css";
import CircularLoading from "../../Components/loadingprogress/loadingProgress";
import NoData from "../../Components/NoData/NoData";
import HeadingPart from "../../Components/HomeComponents/HeadingPart/HeadingPart";
import UseCasePart from "../../Components/HomeComponents/useCasePart/UseCasePart";
import AboutPart from "../../Components/HomeComponents/AboutPart/AboutPart";
import NumbersPart from "../../Components/HomeComponents/numbersPart/numbersPart";
import DoctorsPart from "../../Components/HomeComponents/DoctorsPart/DoctorsPart";
import ArticlesPart from "../../Components/HomeComponents/ArticlesPart/ArticlesPart";

export default function Home2() {

    return (
        <div className="HomePage">
            <HeadingPart />
            <UseCasePart />
            <AboutPart />
            <NumbersPart />
            <DoctorsPart />
            <ArticlesPart />
        </div>
    );
}
