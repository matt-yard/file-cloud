import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ setCurrentUser, currentUser }) => {
  return (
    <nav id="main-nav" style={{ display: currentUser ? "none" : "flex" }}>
      <Link to="/">
        <h1>
          <span id="logo-left-main">file</span>
          <span id="logo-right">cloud</span>
        </h1>
      </Link>

      <div id="right-nav">
        <Link to="/login">Login</Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
