import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios";
import {
    faTrash,
    faSquare,
    faCube,
    faStar,
    faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//css
import "./Chats.css";
import Swal from "sweetalert2";

const Chats = () => {
    const doctorImg = "../assetss/doctoricon.png";
    const avatar = "../assetss/avatar.png";
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState(null);

    const [selectedChatId, setSelectedChatId] = useState(null);
    const id = localStorage.getItem("user-id");
    const navigate = useNavigate();

    const User_Name = localStorage.getItem("user-name");

    const fetchData = async () => {
        try {
            const response = await axiosClient.post(`/show-chat/${id}`);
            const data = response.data;

            if (data && data.chats) {
                setChats(data.chats);
                if (data.users) {
                    setUsers(data.users);
                }
            } else {
                console.log("Invalid data received:", data);
            }
        } catch (error) {
            console.log("Error fetching data:", error);
            handleError();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelected = (chatId) => {
        setSelectedChatId(chatId);
        localStorage.setItem("selected-chat-id", chatId);

        // Find the user associated with the selected chat
        const selectedChat = chats.find((chat) => chat.chat_id === chatId);
        const user = users.find(
            (user) =>
                user.id === selectedChat.patient_id ||
                user.id === selectedChat.doctor_id
        );

        // Store the user_name and user_type in localStorage
        if (user) {
            localStorage.setItem("chatting-with", user.user_name);
            localStorage.setItem(
                "chatting-with-type",
                user.role === 0 ? "patient" : "doctor"
            );
        }

        navigate("/chat/messages");
    };
    const handleDeleteChat = async (chatId) => {
        setSelectedChatId(chatId);
        localStorage.setItem("delete-chat", chatId);
        const response=await axiosClient.post(`/delete-chat/${chatId}/${id}`);
        console.log(response)
        // Refresh the chat list after deletion
        fetchData(); // Refresh the page after success
    };

    const handleTrashClick = (event, chatId) => {
        event.stopPropagation(); // Prevent event propagation to the parent elements
        handleDeleteChat(chatId);
    };

    const handleError = () => {
        Swal.fire({
            title: "OPPS...",
            icon: "error",
            text: "Something went wrong",
        });
    };

    const handleCompleteSuccessfully = () => {
        Swal.fire({
            title: "Completed",
            text: "Thanks for your time admin sandra",
            icon: "success",
        });
    };
    const handleDeleteChatAlert = (chatId) => {
        Swal.fire({
            title: "Do you want to delete this chat?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            denyButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Done!", "", "success");
                handleDeleteChat(chatId);
            } else if (result.isDenied) {
                Swal.fire("Not sure!", "", "info");
                handleDeleteChat(chatId);
            }
        });
    };

    return (
        <div className="posforChat">
            <div className="w-screen flex">
                {/*just for size screen and figures*/}
                <div className="w-[30%]">
                    <FontAwesomeIcon
                        className="cube ml-10 mt-12"
                        icon={faCube}
                    ></FontAwesomeIcon>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <FontAwesomeIcon
                        className="star ml-20"
                        icon={faStar}
                    ></FontAwesomeIcon>
                </div>

                {/*here i will show my chats */}
                <div className="w-[40%] border border-light h-[600px] chat-section">
                    <div className="flex justify-center items-center my-2">
                        <div className="border border-secondary p-[5px] rounded-full">
                            {localStorage.getItem("user-type") === "doctor" ? (
                                <img src={doctorImg} height={60} width={60} />
                            ) : (
                                <img src={avatar} height={60} width={60} />
                            )}
                        </div>
                        <div className="ml-4">
                            <h3 className="text-2xl">{User_Name}</h3>
                            <p className="text-m font-light text-white">
                                My Account
                            </p>
                        </div>
                    </div>

                    <hr className="my-2" />

                    <div className="ml-10 mt-6">
                        <div className="text-lg text-white ">Chats</div>
                        <div>
                            <ul className="chatList">
                                {chats && chats.length > 0 ? (
                                    chats.map((chat) => {
                                        const user = users.find(
                                            (user) =>
                                                user.id === chat.patient_id ||
                                                user.id === chat.doctor_id
                                        );

                                        return (
                                            <div className="items-center flex">
                                                <li
                                                    key={chat.id}
                                                    className="flex items-center text-bg-secondary h-[60px] my-2 border border-secondary li rounded-full cursor-auto overflow-hidden"
                                                    onClick={() =>
                                                        handleSelected(
                                                            chat.chat_id
                                                        )
                                                    }
                                                >
                                                    {user && user.role === 0 ? (
                                                        <img
                                                            src={avatar}
                                                            alt="user"
                                                            height={40}
                                                            width={40}
                                                            className="ml-3 border border-primary p-[2px] rounded-full "
                                                        />
                                                    ) : (
                                                        <img
                                                            src={doctorImg}
                                                            alt="user"
                                                            height={40}
                                                            width={40}
                                                            className="ml-3 border border-primary p-[2px] rounded-full "
                                                        />
                                                    )}

                                                    <div className="ml-9 cursor-pointer w-[10%]">
                                                        {user && (
                                                            <span className="text-white">
                                                                {user.user_name}
                                                            </span>
                                                        )}
                                                        {user.available == 1 ? (
                                                            <p className="text-sm paragraph">
                                                                online
                                                            </p>
                                                        ) : (
                                                            <p className="text-sm paragraph">
                                                                offline
                                                            </p>
                                                        )}
                                                    </div>
                                                    {/* Render your chat component here */}
                                                    <div>
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            className="ml-[1700%] trash"
                                                            onClick={(event) =>
                                                                handleTrashClick(
                                                                    event,
                                                                    chat.chat_id
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </li>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex items-center mt-[60px] my-8 h-[3%]">
                                        <li className="text-primary mt-[80px] text-xl pl-[40%]">
                                        <p className='mt-[10px] mb-[10px]'>No Chats</p>
                                        </li>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/*just for size screen and figures*/}
                <div className="w-[30%]">
                    <FontAwesomeIcon
                        className="cube ml-10 mt-12"
                        icon={faMessage}
                    ></FontAwesomeIcon>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <FontAwesomeIcon
                        className="star ml-20"
                        icon={faSquare}
                    ></FontAwesomeIcon>
                </div>
            </div>
        </div>
    );
};

export default Chats;
