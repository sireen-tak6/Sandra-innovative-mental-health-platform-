import React, { useState, useContext, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import { NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";

//css
import "./Notifications.css";
import CircularLoading from "../../loadingprogress/loadingProgress";
//images

//components

//providers
function Notifications() {
    const [Notifications2, setNotifications] = useState();
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    let id = localStorage.getItem("user-id");

    const Notification = "../images/notification.svg";
    const fetchDoctor = async () => {
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        try {
            const response = await axiosClient.post(
                "/unreadNotificationCount",
                {
                    userID,
                    userType,
                }
            );
            setUnreadCount(response.data.notificationCount);
            console.log(response);
            const response1 = await axiosClient.post("/allNotifications", {
                userID,
                userType,
            });
            console.log(response1);
            setNotifications(response1.data.notifications);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDoctor();
        const interval = setInterval(fetchDoctor, 10000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    const getDate = (n) => {
        const date2 = new Date(n.created_at);
        console.log(date2);
        const date = `${date2.getHours()}:${date2.getMinutes()} ${date2.getDate()} / ${
            date2.getMonth() + 1
        } / ${date2.getFullYear()}`;
        return date;
    };
    const getDate2 = (n) => {
        const date2 = new Date(n);
        console.log(date2);
        const date = ` ${date2.getDate()} / ${
            date2.getMonth() + 1
        } / ${date2.getFullYear()}`;
        return date;
    };
    const markAsRead = async (n, index) => {
        setOpen(false);
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        try {
            const response = await axiosClient.post(`/markAsRead/${n.id}`, {
                userID,
                userType,
            });
            if (response.data.status == "read") {
                n.read_at = response.data.read_at;
                Notifications2[index].read_at = response.data.read_at;
                const t = unreadCount - 1;
                setUnreadCount(t);
            }

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="info">
            <div className="icon" onClick={() => setOpen(!open)}>
                <img src={Notification} className="iconImg" alt="" />
                {unreadCount > 0 && (
                    <div className="counter">{unreadCount}</div>
                )}
            </div>
            {open && (
                <div className="notifications">
                    {Notifications2 && Notifications2.length > 0 ? (
                        Notifications2.map((n, index) => (
                            <Link
                                onClick={() => markAsRead(n, index)}
                                to={
                                    n.type == "Article Like"
                                        ? `/articles/${n.data.articleCat}/${n.data.articleID}`
                                        : n.type == "Article Review"
                                        ? `/articles/pending/myPendings/${n.data.articleID}`
                                        : n.type == "Like"
                                        ? `/doctorProile/${id}`
                                        : n.type == "Certificate Review"
                                        ? `/doctorProile/${id}`
                                        : n.type == "Article Report"
                                        ? `/articles/${n.data.articleCat}/${n.data.articleID}`
                                        : n.type == "Message"
                                        ? "/chats"
                                        : n.type == "Appointment"
                                        ? "/Appointments"
                                        : ""
                                }
                                className={`notification ${
                                    n.read_at == null ? "unread" : "read"
                                } ${
                                    index == Notifications2.length - 1 &&
                                    index == 0
                                        ? "firstlast"
                                        : index == 0
                                        ? "first"
                                        : index == Notifications2.length - 1
                                        ? "last"
                                        : ""
                                }`}
                                key={n.data.articleID}
                            >
                                {n.type == "Article Like" ? (
                                    <>
                                        <span className="Type">
                                            New {n.type}..!
                                        </span>{" "}
                                        <span>
                                            {" "}
                                            You have new like on{" "}
                                            <span className="articleTitle">
                                                {n.data.articleTitle.slice(
                                                    0,
                                                    40
                                                )}
                                                ...
                                            </span>
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Email Change" ? (
                                    <>
                                        <span className="Type">
                                            New Email..!
                                        </span>{" "}
                                        <span>
                                            {" "}
                                            You need to verify your new email to
                                            save changes.
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Email verified" ? (
                                    <>
                                        <span className="Type">
                                            New Email..!
                                        </span>{" "}
                                        <span>
                                            {" "}
                                            Your new email address has been
                                            verified.
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Article Report" ? (
                                    <>
                                        <span className="Type">
                                            New {n.type}..!
                                        </span>{" "}
                                        <span>
                                            {" "}
                                            You have new ( {n.data.count} )
                                            reports on{" "}
                                            <span className="articleTitle">
                                                {n.data.articleTitle.slice(
                                                    0,
                                                    40
                                                )}
                                                ...
                                            </span>
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Article Review" ? (
                                    <>
                                        <span className="Type">
                                            New {n.type}..!
                                        </span>{" "}
                                        <span>
                                            {" "}
                                            {n.data.articleTitle} has been
                                            <span className="articleTitle">
                                                {n.data.status}.
                                            </span>
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Like" ? (
                                    <>
                                        <span className="Type">
                                            New {n.type}..!
                                        </span>{" "}
                                        <span> You have a new like</span>.
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Certificate Review" ? (
                                    <>
                                        <span className="Type">
                                            New {n.type}..!
                                        </span>{" "}
                                        <span>
                                            {" "}
                                            Your certificate has been{" "}
                                            {n.data.status}.
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Delete" ? (
                                    <>
                                        <span className="Type">
                                            New Article {n.type}..!
                                        </span>{" "}
                                        <span>
                                            {" "}
                                            {n.data.articleTitle} has been
                                            Deleted .
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Appointment Cancel" ? (
                                    <>
                                        <span className="Type">
                                            New {n.type}..!
                                        </span>{" "}
                                        <span>
                                            Your appointment with Dr.
                                            {n.data.doctorName} has been
                                            cancelled. <br /> Date:
                                            {getDate2(n.data.date)}.
                                            <br />
                                            Time: {n.data.time}.
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Appointment approve" ? (
                                    <>
                                        <span className="Type">
                                            New {n.type}..!
                                        </span>{" "}
                                        <span>
                                            Your appointment with Dr.
                                            {n.data.doctorName} has been
                                            approved. <br /> Date: {getDate2(n.data.date)}
                                            .
                                            <br />
                                            Time: {n.data.time}.
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : n.type == "Appointment" ? (
                                    <>
                                        <span className="Type">
                                            New {n.type}..!
                                        </span>{" "}
                                        <span>
                                            A new appointment needs your
                                            approval.
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="Type">
                                            New {n.type}..!
                                        </span>{" "}
                                        <span>
                                            {" "}
                                            <span className="SenderName">
                                                {`${n.data.senderName} `}
                                            </span>
                                            sent you a new message.
                                        </span>
                                        <div className="notificationDate">
                                            {getDate(n)}
                                        </div>
                                    </>
                                )}
                            </Link>
                        ))
                    ) : Notifications2 ? (
                        <div className="notification firstlast none ">
                            <span className="Type">No notifications found</span>
                        </div>
                    ) : (
                        <div className="notification firstlast">
                            <CircularLoading />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Notifications;
