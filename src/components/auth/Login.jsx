import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate, useOutletContext } from "react-router-dom";
import ConfirmEmail from "./ConfirmEmail";

const Login = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    formType: "login",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useOutletContext();

  const handleChange = (e) => {
    e.persist();
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formState;

    try {
      const user = await Auth.signIn(email, password);
      console.log(user);
      setCurrentUser({
        username: user.username,
        email: user.attributes.email,
        storage: user.storage,
      });
      setErrorMessage("");
      navigate("/");
    } catch (error) {
      if (error.code === "UserNotConfirmedException") {
        setFormState((prev) => ({ ...prev, formType: "confirm" }));
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const { formType } = formState;

  return (
    <div>
      <p>{errorMessage}</p>
      {formType === "login" && (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
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
          <button type="submit">Login</button>
        </form>
      )}

      {formType === "confirm" && <ConfirmEmail email={formState.email} />}
    </div>
  );
};

export default Login;
