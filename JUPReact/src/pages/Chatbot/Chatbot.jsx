import React, { useState, useContext } from "react";
import axios from "axios";

//components
import "./Chatbot.css";
//providers
function Chatbot() {
    const [chat, setchat] = useState([]);
    const [newMessage, setnewMessage] = useState("");
    const [art, setart] = useState(0);
    const [qps, setqps] = useState(0);
    const sendMessage = async () => {
        const response = await axios.post(`http://127.0.0.1:5173/chatbot`, {
            message: newMessage,
        });
        console.log(response);
        if (response.data["response"]) {
            setchat([
                ...chat,
                { name: "user", content: newMessage },
                { name: "Sandra", content: response.data },
            ]);
            setart(response.data.art);
            setqps(response.data.qps);
            setnewMessage("");
        }
        console.log(chat);
    };
    const handleMessageChange = (e) => {
        setnewMessage(e.target.value);
    };
    return (
        <div className="chatbot">
            <div className="Title">Chat With Sandra</div>
            <div>
                query per second :{" "}
                {Math.round((qps + Number.EPSILON) * 100) / 100} query
            </div>
            <div>
                average response time :{" "}
                {Math.round((art + Number.EPSILON) * 100) / 100}s
            </div>
            <form>
                <div className="inp">
                    <div>
                        Ask a question about your mental health.
                        <textarea
                            type="text"
                            className="newMessage"
                            onChange={handleMessageChange}
                            value={newMessage}
                        />{" "}
                    </div>
                    <div>
                        <button
                            type="button"
                            className="saveButton"
                            onClick={sendMessage}
                            disabled={!newMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </form>
            {chat.length !== 0
                ? [...chat].reverse().map((message) => (
                      <div>
                          <div className={message["name"]}>
                              {message.name == "Sandra"
                                  ? `${message.name} : ${message.content.response}`
                                  : `${message.name} : ${message.content}`}
                          </div>
                      </div>
                  ))
                : null}
        </div>
    );
}

export default Chatbot;
