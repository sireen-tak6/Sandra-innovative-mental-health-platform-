import React, { useState, useEffect } from "react";
import axiosClient from "../../axios";
import { Form, useNavigate } from "react-router-dom";

//css
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./PatientInfo.css";
import CircularLoading from "../loadingprogress/loadingProgress";

const PatientInfo = ({ setModalOpen, patientID }) => {
    const [editable, setEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState("");
        useEffect(() => {
        if (
            localStorage.getItem("user-type") == "patient" &&
            localStorage.getItem("hasInfo") == "true"
        ) {
            getInfo();
            setEditable(true);
        } else if (
            localStorage.getItem("user-type") == "doctor" ||
            localStorage.getItem("user-type") == "secretary"
        ) {
            getInfo(patientID);
        } else if (localStorage.getItem("user-type") == "patient") {
            setEditable(true);
        }
    }, []);
    const getInfo = async (patientID) => {
        setIsLoading(true);
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        // Use HTML5 form validation (automatic)
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const formData2 = new FormData();

        if (patientID) {
            formData2.append("patientID", patientID);
        }
        formData2.append("userID", parseInt(userID));
        formData2.append("userType", userType);
        const response = await axiosClient.post("/getInfo", formData2);
        console.log(response);
        if (response.status == 200) {
            console.log(formData);
            setFormData(response.data.Info[0].data);
            if (response.data.Info[0].patient.id) {
                setUserName(response.data.Info[0].patient.user_name);
            }
            console.log(formData);
        } else {
            swalWithBootstrapButtons.fire(
                response.data.message,
                "Something went wrong",
                "error"
            );
        }
        setIsLoading(false);
    };
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        phoneNumber: "",
        gender: "Male",
        age: "", // Initial age as an empty string
        maritalStatus: "Married",
        education: "School",
        children: "",
        employmentStatus: "Employed",
        occupation: "",
        parentsStatus: "Married",
        pastConditions: "",
        medications: "",
        professionals: "",
        notes: "",
    });

    const infos = [
        {
            id: "firstName",
            name: "First name:",
            hint: "Enter your First Name",
            required: true,
        },
        {
            id: "lastName",
            name: "Last name:",
            hint: "	Enter your Last Name",
            required: true,
        },
        {
            id: "address",
            name: "Address:",
            hint: "Enter your Street Address",
            required: true,
        },
        {
            id: "phoneNumber",
            name: "Phone number:",
            hint: "Enter your Phone Number",
            required: true,
        },
        {
            id: "gender",
            name: "Gender:",
            hint: "Select your Gender",
            choices: ["Male", "Female", "Prefer not to say"],
            required: true,
        },
        { id: "age", name: "Age:", hint: "Enter your Age", required: true },
        {
            id: "maritalStatus",
            name: "Marital status:",
            hint: "Select your Marital Status",
            choices: [
                "Married",
                "Single",
                "Divorced",
                "Widowed",
                "In a Partnership",
                "Prefer not to say",
            ],
            required: true,
        },
        {
            id: "education",
            name: "Education:",
            hint: "Select your Highest Level of Education",
            choices: [
                "School",
                "Bachelor's Degree",
                "Master's Degree",
                "Doctorate",
                "Prefer not to say",
            ],
            required: true,
        },
    ];

    const secondInfos = [
        {
            id: "children",
            name: "Do you have any children? Count them.",
            hint: "Children count",
            required: true,
            // Short and clear for a yes/no question
        },
        {
            id: "employmentStatus",
            name: "Employment Status:",
            hint: "What is your current employment status?",
            choices: ["Employed", "Self employed", "Unemployed", "other"],
            required: true,
            // Clear and concise
        },
        {
            id: "occupation",
            name: "Occupation:",
            hint: "What is your current occupation or job title?",
            required: true,
            // More specific
        },
        {
            id: "parentsStatus",
            name: "Select your parents' marital status: ",
            hint: "",
            choices: [
                "Married",
                "Divorced",
                "Widowed",
                "died",
                "Prefer not to say",
            ],
            required: true,
        },
    ];
    const thirdInfos = [
        {
            id: "pastConditions",
            name: "Do you have any current or past medical conditions? List them please.",
            hint: "Please list any medical conditions you have or have had in the past.",
            required: false, // Informative
        },
        {
            id: "medications",
            name: "Are you currently taking any medications? List them please.",
            hint: "Please list any medications you are currently taking.", // Straightforward
            required: false,
        },
        {
            id: "professionals",
            name: "Have you ever received treatment from a mental health professional (therapist, psychiatrist, counselor)? List them please.",
            hint: "Have you ever seen a therapist, psychiatrist, or counselor? Please list them.", // More user-friendly
            required: false,
        },
    ];
    const fourthInfos = [
        {
            id: "notes",
            name: "Do you have more important informations?",
            hint: "", // More user-friendly
            required: false,
        },
    ];
    const [currentStep, setCurrentStep] = useState(1); // Track the current step
    const currentInfo =
        currentStep == 1
            ? infos
            : currentStep == 2
            ? secondInfos
            : currentStep == 3
            ? thirdInfos
            : fourthInfos;
    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            console.warn("Please fill in all required fields for this step.");
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleChange = (event) => {
        const { id, name, value } = event.target;

        // Handle number input for age, ensuring positive values
        if (name === "age") {
            const age = parseInt(value.replace(/\D/g, "")); // Remove non-digits
            setFormData((prevData) => ({
                ...prevData,
                [id]: Math.max(0, age),
            })); // Set to 0 if negative
        } else {
            setFormData((prevData) => ({ ...prevData, [id]: value }));
        }
        console.log(formData);
    };
    const [error, setError] = useState({ __html: "" });

    const handleSubmit = async (event) => {
        console.log("fsdf");
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        event.preventDefault();

        // Use HTML5 form validation (automatic)
        setError({ __html: "" });
        console.log(formData);
        const userID = localStorage.getItem("user-id");
        const userType = localStorage.getItem("user-type");
        const formData2 = new FormData();

        formData2.append("data", JSON.stringify(formData)); // Convert to string before appending
        formData2.append("userID", parseInt(userID));
        formData2.append("userType", userType);
        try {
            const response = await axiosClient.post("/AddInfo", formData2);
            console.log(response);
            if (response.status == 200) {
                localStorage.setItem("hasInfo", "true");
                swalWithBootstrapButtons
                    .fire(
                        "changes saved successfully",
                        "Your information has been updated.",
                        "success"
                    )
                    .then(setModalOpen(false));
            } else {
                swalWithBootstrapButtons.fire(
                    response.data.message,
                    "Something went wrong",
                    "error"
                );
            }
        } catch (error) {
            console.error("Error saving schedule:", error);
        }
    };
    const exitHandle = () => {
        if (editable) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
            swalWithBootstrapButtons
                .fire({
                    title: "Are you sure!",
                    text: "Do you want to disard changes?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, discard!",
                    cancelButtonText: "No, Keep!",
                    reverseButtons: true,
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        setModalOpen(false);
                    }
                });
        } else {
            setModalOpen(false);
        }
    };
    return (
        <div className="PatientInfo">
            <div className="modal">
                <div className="modal-content">
                    <div className="InfoTitle">
                        <h2
                            className={`${
                                localStorage.getItem("hasInfo") == "true" ||
                                localStorage.getItem("user-type") != "patient"
                                    ? "hasexit"
                                    : ""
                            }`}
                        >
                            {localStorage.getItem("user-type") != "patient"
                                ? isLoading
                                    ? "user name"
                                    : userName
                                : "Your Informations"}
                        </h2>
                        {localStorage.getItem("hasInfo") == "true" ||
                        !editable ? (
                            <div className="exitButton">
                                <button type="button" onClick={exitHandle}>
                                    X
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <div className="notesPart">
                        {localStorage.getItem("uset-type")=="patient"?<>
                        <div>
                            - Only authorized doctors can view this information.
                        </div>
                        <div>
                            - This information can be edited anytime and will be
                            automatically applied to all your appointments.
                        </div>
                        </>:null}
                    </div>
                    {isLoading ? (
                        <CircularLoading />
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error.__html && (
                                <div
                                    className="error"
                                    dangerouslySetInnerHTML={error}
                                ></div>
                            )}{" "}
                            <div className="grid2 ">
                                {currentInfo.map((info, index) =>
                                    currentStep < 3 ? (
                                        <div className="info">
                                            <div className="infoName">
                                                {info.name}
                                                <span className="requiredstar">
                                                    {" "}
                                                    {info.required == true
                                                        ? "*"
                                                        : "(optional)"}
                                                </span>
                                            </div>
                                            <div>
                                                {info.choices ? (
                                                    <select
                                                        id={info.id}
                                                        name={info.id}
                                                        value={
                                                            formData[info.id]
                                                        }
                                                        onChange={handleChange}
                                                        className="infoInput"
                                                        disabled={!editable}
                                                    >
                                                        {info.choices.map(
                                                            (choice) => (
                                                                <option
                                                                    key={choice}
                                                                    value={
                                                                        choice
                                                                    }
                                                                >
                                                                    {choice}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                ) : info.id === "age" ||
                                                  info.id == "children" ? (
                                                    <input
                                                        id={info.id}
                                                        name={info.id}
                                                        type="number" // Set type to "number" for number input
                                                        value={
                                                            formData[info.id]
                                                        } // Display the current age
                                                        onChange={handleChange}
                                                        className="infoInput"
                                                        placeholder={info.hint}
                                                        // Additional attribute for positive-only input
                                                        min="0"
                                                        max="100"
                                                        required={
                                                            info.required
                                                                ? true
                                                                : false
                                                        }
                                                        disabled={!editable}
                                                    />
                                                ) : info.id ===
                                                  "phoneNumber" ? (
                                                    <input
                                                        id={info.id}
                                                        name={info.id}
                                                        value={
                                                            formData[info.id]
                                                        }
                                                        onChange={handleChange}
                                                        className="infoInput"
                                                        placeholder={info.hint}
                                                        required={
                                                            info.required
                                                                ? true
                                                                : false
                                                        }
                                                        type="number"
                                                        disabled={!editable} // This attribute restricts input to numbers
                                                    />
                                                ) : (
                                                    <input
                                                        id={info.id}
                                                        name={info.id}
                                                        value={
                                                            formData[info.id]
                                                        }
                                                        onChange={handleChange}
                                                        className="infoInput"
                                                        placeholder={info.hint}
                                                        required={
                                                            info.required
                                                                ? true
                                                                : false
                                                        }
                                                        disabled={!editable}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                            {currentStep >= 3
                                ? currentInfo.map((info, index) => (
                                      <div className="info">
                                          <div className="infoName">
                                              {info.name}
                                              <span className="requiredstar">
                                                  {" "}
                                                  {info.required == true
                                                      ? "*"
                                                      : "(optional)"}
                                              </span>
                                          </div>

                                          <textarea
                                              rows="5"
                                              cols="50"
                                              id={info.id}
                                              name={info.id}
                                              value={formData[info.id]}
                                              onChange={handleChange}
                                              className="alone area"
                                              placeholder={info.hint}
                                              required={
                                                  info.required ? true : false
                                              }
                                              disabled={!editable}
                                          />
                                      </div>
                                  ))
                                : null}
                            <div className="InfoButtons">
                                {currentStep !== 1 && (
                                    <button
                                        onClick={handlePrevious}
                                        type="button"
                                        className="prevButton"
                                    >
                                        Previous
                                    </button>
                                )}
                                {currentStep !== 4 && (
                                    <button
                                        onClick={handleNext}
                                        type="button"
                                        className="nextButton"
                                    >
                                        Next
                                    </button>
                                )}
                                {currentStep == 4 &&
                                    localStorage.getItem("user-type") ==
                                        "patient" && (
                                        <button
                                            type="submit"
                                            className="okButton"
                                        >
                                            Save
                                        </button>
                                    )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientInfo;
