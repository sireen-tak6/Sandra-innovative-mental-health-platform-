import React, { useState, useEffect, useRef } from "react";
import axiosClient from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

//css
import "./ChatMessages.css";

export default function ChatMessages() {
    const videoCallIcon = "../assetss/videoCallIcon.jpg";
    const doctorImg = "../assetss/doctoricon.png";
    const avatar = "../assetss/avatar.png";

    const send = "../assetss/send2.png";

    const [messages, setMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [appointment, setAppointment] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axiosClient.post(
                    `/show-messages/${localStorage.getItem("selected-chat-id")}`
                );

                if (response.data.status == 200) {
                    console.log(response);
                    const newMessages = response.data.messages;
                    localStorage.setItem(
                        "receverDoctor",
                        response.data.chat.doctor_id
                    );
                    localStorage.setItem(
                        "receverPatient",
                        response.data.chat.patient_id
                    );
                    setMessages(newMessages);
                }
                const formData = new FormData();

                formData.append(
                    "patientID",
                    parseInt(response.data.chat.patient_id)
                );
                formData.append(
                    "doctorID",
                    parseInt(response.data.chat.doctor_id)
                );
                const response1 = await axiosClient.post(`/haveAppointment`,formData);
                if (response1.data.status == 200) {
                    setAppointment(response1.data.haveAccount);
                    console.log(response1.data);
                }
            } catch (error) {
                console.log(error);
                setErrorMessage("Failed to fetch messages");
            }
        };
        //here just fetch the primary messages and show it in the chat
        fetchMessages();
        //check if there are any new questions every five seconds 5 * 1000
        const interval = setInterval(fetchMessages, 5000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const backChats = () => {
        navigate("/chats");
    };
    const sendMessage = async () => {
        try {
            if (localStorage.getItem("user-type") === "patient") {
                const respon = await axiosClient.post(
                    `/send-message/${localStorage.getItem(
                        "user-id"
                    )}/${localStorage.getItem("receverDoctor")}`,
                    { message: newMessage }
                );
                console.log(respon);
                setNewMessage("");

                // Add the new message to the existing messages state
                const newMessageObj = {
                    id: Date.now(), // Generate a unique ID for the new message
                    message: newMessage,
                };
                setMessages((prevMessages) => [...prevMessages, newMessageObj]);
            } else if (localStorage.getItem("user-type") === "doctor") {
                await axiosClient.post(
                    `/send-message/${localStorage.getItem(
                        "user-id"
                    )}/${localStorage.getItem("receverPatient")}`,
                    { message: newMessage }
                );
                setNewMessage("");

                // Add the new message to the existing messages state
                const newMessageObj = {
                    id: Date.now(), // Generate a unique ID for the new message
                    message: newMessage,
                };
                setMessages((prevMessages) => [...prevMessages, newMessageObj]);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to send message");
        }
    };

    return (
        <div className="posforMessages">
            <div className="w-screen flex">
                {/*this section for divide the page*/}
                <div className="w-[20%]"></div>

                {/*this section i will work on it*/}
                <div className="w-[60%] flex flex-col h-[598px] items-center messages-section">
                    <div className="w-[50%] bg-secondary h-[70px] mt-3 mb-2 rounded-full flex items-center ">
                        {localStorage.getItem("user-type") === "patient" ? (
                            <img
                                src={doctorImg}
                                height={55}
                                width={55}
                                className="mt-0.9 ml-2"
                            ></img>
                        ) : (
                            <img
                                src={avatar}
                                height={55}
                                width={55}
                                className="mt-0.9 ml-2"
                            ></img>
                        )}
                        <div className="items-center justify-center">
                            <h1 className="text-xl text-dark ml-3">
                                {localStorage.getItem("chatting-with")}
                            </h1>
                            {localStorage.getItem("user-type") === "patient" ? (
                                <p className="text-ml text-light ml-3">
                                    Doctor
                                </p>
                            ) : (
                                <p className="text-ml text-light ml-3">User</p>
                            )}
                        </div>
                        <FontAwesomeIcon
                            icon={faMessage}
                            className="mr-3 ml-auto text-light cursor-pointer"
                            height={20}
                            width={20}
                            onClick={backChats}
                        ></FontAwesomeIcon>
                        {appointment ? (
                            <img
                                src={videoCallIcon}
                                height={25}
                                width={25}
                                className={"mr-4 cursor-pointer"}
                                onClick={() => {
                                    navigate("/intro", {
                                        state: {
                                            doctorID:
                                                localStorage.getItem(
                                                    "receverDoctor"
                                                ),
                                            patientID:
                                                localStorage.getItem(
                                                    "receverPatient"
                                                ),
                                        },
                                    });
                                }}
                            />
                        ) : null}
                    </div>

                    <div className="h-[75%] w-full mt-1 overflow-y-scroll messagesSection">
                        <div className="h[370px] px-10 py-3 ">
                            {/* here apply the sender Messages <div className='max-w-[45%] bg-secondary rounded-b-xl rounded-tr-xl p-4'></div>*/}
                            {/* here apply the recever Messages <div className=' max-w-[45%] bg-light rounded-b-xl rounded-tl-xl ml-auto p-4'></div> */}
                            <ul>
                                {messages.map((message) => (
                                    <li
                                        key={message.id}
                                        className={`max-w-[40%] p-[7px] mt-[8px] overflow-hidden h-[10%] min-h-[20px] ${
                                            message.sender_id ==
                                            localStorage.getItem("user-id")
                                                ? "rounded-b-xl rounded-tr-xl send"
                                                : "rounded-b-xl rounded-tl-xl ml-auto rec"
                                        }`}
                                        style={{ wordWrap: "break-word" }}
                                    >
                                        {message.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/*here i need to use it for take the message to the sendMessage function */}
                    <div className="p-6 w-full flex items-center">
                        <input
                            className="w-[75%] p-2 border-0 shadow-md input rounded-full  focus:ring-0 focus:border-0 outline-none"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message"
                        />
                        <img
                            src={send}
                            height={40}
                            width={40}
                            className="cursor-pointer ml-auto"
                            onClick={sendMessage}
                        />
                    </div>
                </div>

                {/*this section for divide the page*/}
                <div className="w-[20%]"></div>
            </div>
        </div>
    );
}
