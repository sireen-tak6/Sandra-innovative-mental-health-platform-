import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";

//css
import "./numbersPart.css";
import NumbersCard from "../numbersCard/numbersCard";
import { useTranslation } from "react-i18next";

export default function NumbersPart() {
    const navigate = useNavigate();
    const article = "../images/articlesICON.svg";
    const doctor = "../images/doctorICON.svg";
    const user = "../images/userICON.svg";
    const [Articles, setArticles] = useState(0);
    const [Doctors, setDoctors] = useState(0);
    const [Users, setUsers] = useState(0);
    const {t } = useTranslation();

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchDoctor();
    }, []);

    const fetchDoctor = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post("numbers");
            console.log(response);
            if (response.status==200) {
                setDoctors(response.data.doctors);
                setUsers(response.data.users);

                setArticles(response.data.articles);
            } else {
                console.log("Error fetching data:", error);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="section numbersSection">
            <div className="Title">{t('HomeNumberTitle')}</div>
            <div className="cards">
                <NumbersCard
                    title={t('HomeNumberUsers')}
                    count={Users}
                    color="green"
                    image={user}
                />
                <NumbersCard
                    title={t('HomeNumberDoctors')}
                    count={Doctors}
                    color="yellow"
                    image={doctor}
                />
                <NumbersCard
                    title={t('HomeNumberArticles')}
                    count={Articles}
                    color="blue"
                    image={article}
                />
            </div>
        </div>
    );
}
