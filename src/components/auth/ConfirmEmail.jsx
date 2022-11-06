import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const ConfirmEmail = ({ email }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [authCode, setAuthCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Auth.confirmSignUp(email, authCode);
      setErrorMessage("");
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Please enter the code sent to your email.</h2>
        <div hidden={!errorMessage} className="error-message">
          <p>{errorMessage}</p>
        </div>
        <div className="form-element">
          <input
            type="text"
            placeholder="123456"
            onChange={(e) => setAuthCode(e.target.value)}
            value={authCode}
          />
          <button type="submit">Confirm</button>
        </div>
      </form>
      <div id="right-side-form">
        <h1 id="welcome-back">Almost there!</h1>
        <hr id="line" />
        <h2 id="welcome-back-subtext">
          Just confirm your email to get started!
        </h2>
      </div>
    </>
  );
};

export default ConfirmEmail;
