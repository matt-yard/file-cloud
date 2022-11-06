import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import ConfirmEmail from "./ConfirmEmail";

const SignUp = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    formType: "signup",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    e.persist();
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formState;
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
    } else {
      try {
        await Auth.signUp({ username: email, password });
        setFormState((prev) => ({ ...prev, formType: "confirm" }));
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  const { formType } = formState;

  return (
    <div>
      <p>{errorMessage}</p>
      {formType === "signup" && (
        <form onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          <div className="form-element">
            <label htmlFor="email">Email*</label>
            <input
              type="text"
              value={formState.email}
              name="email"
              placeholder="me@example.com"
              onChange={handleChange}
            />
          </div>
          <div className="form-element">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              value={formState.password}
              placeholder="Min. 8 characters"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div className="form-element">
            <label htmlFor="email">Confirm Password*</label>
            <input
              type="password"
              value={formState.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      )}

      {formType === "confirm" && <ConfirmEmail email={formState.email} />}
    </div>
  );
};

export default SignUp;
