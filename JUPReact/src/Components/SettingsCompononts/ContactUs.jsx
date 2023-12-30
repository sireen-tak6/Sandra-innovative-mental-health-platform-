import React, { useState, useEffect } from "react";

//css
import "sweetalert2/src/sweetalert2.scss";

const ContactUs = () => {
    return (
        <div className="contactPart">
            <div className="title">From Sandra team : </div>
            <div className="j">
                
                <div className="contactBody2">you can contact us by: </div>
                <div className="contact">Email: Sandra@gmail.com </div>
                <div className="contactBody2">
                    {" "}
                    <div className="contactdiv" />
                    or <div className="contactdiv" />
                </div>

                <div className="contact">Phone : (+963)980 547 937</div>
            </div>
        </div>
    );
};
export default ContactUs;
