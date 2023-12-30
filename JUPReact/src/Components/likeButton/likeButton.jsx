import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

//css
import "./likeButton.css";

const LikeButton = ({ handleLike, handleDislike, isLiked, likes, button ,size }) => {
    console.log(isLiked);

    if (button === "no") {
        return (
            <div className="likebutton">
                {!isLiked ? (
                    <div className="dislike">
                        <AiOutlineHeart className="dislikeicon" size={size}/>{" "}
                        <label htmlFor="">{likes}</label>
                    </div>
                ) : (
                    <div className="like">
                        <AiFillHeart className="likeicon"  size={size}/>{" "}
                        <label htmlFor="">{likes}</label>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className="likebutton">
                {!isLiked ? (
                    <button
                        className="dislike"
                        onClick={handleLike}
                        disabled={isLiked}
                    >
                        <AiOutlineHeart className="dislikeicon" size={size}/>{" "}
                        <label htmlFor="">{likes}</label>
                    </button>
                ) : (
                    <button
                        className="like"
                        onClick={handleDislike}
                        disabled={!isLiked}
                    >
                        <AiFillHeart className="likeicon" size={size}/>{" "}
                        <label htmlFor="">{likes}</label>
                    </button>
                )}
            </div>
        );
    }
};

export default LikeButton;
