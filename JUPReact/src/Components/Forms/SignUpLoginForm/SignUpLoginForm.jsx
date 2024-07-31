import React from "react";
import { Link } from "react-router-dom";

//css
import "sweetalert2/src/sweetalert2.scss";
import "./SignUpLoginForm.css";
import CircularLoading from "../../loadingprogress/loadingProgress";
import { useTranslation } from "react-i18next";

const SignUpLoginForm = ({
    onsubmit,
    setUser_name,
    setEmail,
    setPassword,
    setConfirmPassword,
    Type,
    user_name,
    email,
    password,
    confirmpassword,
    setloading,
    isloading,
}) => {
    const { t } = useTranslation();

    return (
        <form onSubmit={onsubmit}>
            {Type === "SignUp" || Type == "SecretaryLogin" ? (
                <div className="div">
                    <div className="label">{t("SignLogUsername")}:</div>
                    <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        className="form-control form-control-lg"
                        placeholder={t("SignLogUsername")}
                        value={user_name}
                        onChange={(ev) => setUser_name(ev.target.value)}
                    />
                    <label htmlFor="email"></label>
                </div>
            ) : null}
            {Type !== "SecretaryLogin" ? (
                <div className="div">
                    <div className="label">{t("SignLogEmail")}:</div>
                    <input
                        type="email"
                        id="email"
                        className="form-control form-control-lg"
                        placeholder={t("SignLogEmail")}
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <label htmlFor="password"></label>
                </div>
            ) : null}
            <div className="div">
                <div className="label">{t("SignLogPassword")}:</div>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder={t("SignLogPassword")}
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                />
                <label htmlFor="password"></label>
            </div>{" "}
            {Type === "SignUp" ? (
                <>
                    {" "}
                    <div className="div">
                        <div className="label">{t("SignLogconPass")}:</div>
                        <input
                            type="password"
                            id="confirmpassword"
                            name="confirmpassword"
                            className="form-control form-control-lg "
                            placeholder={t("SignLogconPass")}
                            value={confirmpassword}
                            onChange={(ev) =>
                                setConfirmPassword(ev.target.value)
                            }
                        />
                        <label htmlFor="password"></label>
                    </div>
                    {isloading ? (
                        <CircularLoading />
                    ) : (
                        <>
                            <div className="submitPart">
                                <button type="submit" className="button">
                                    {t("SignupTitle")}
                                </button>
                            </div>
                            <div className="LoginButton">
                                {t("SignLogSignask")}{" "}
                                <Link to="/login">{t("LoginTitle")}</Link>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    {isloading ? (
                        <CircularLoading />
                    ) : (
                        <>
                            <div className="submitPart">
                                <button type="submit" className="button">
                                    {t("LoginTitle")}
                                </button>
                            </div>
                            {Type !== "SecretaryLogin" && (
                                <div className="signupButton">
                                    {t("SignLogLogAsk")}{" "}
                                    <Link to="/signup">{t("SignupTitle")}</Link>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </form>
    );
};
export default SignUpLoginForm;
