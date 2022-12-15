import React from "react";
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ setCurrentUser, currentUser }) => {
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    try {
      await Auth.signOut();
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav>
      <Link to="/">
        <span id="logo-left">file</span>
        <span id="logo-right">cloud</span>
      </Link>
      {currentUser ? (
        <button onClick={handleSignOut}>Logout</button>
      ) : (
        <div id="right-nav">
          <Link to="/login">Login</Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
