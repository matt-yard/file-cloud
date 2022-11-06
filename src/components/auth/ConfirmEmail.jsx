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
    <div>
      <h2>Please enter the code sent to your email.</h2>
      <p>{errorMessage}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setAuthCode(e.target.value)}
          value={authCode}
        />
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default ConfirmEmail;
