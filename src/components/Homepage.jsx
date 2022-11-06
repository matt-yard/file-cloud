import React from "react";
import { Link } from "react-router-dom";
import "../styles/Homepage.css";

const Homepage = () => {
  return (
    <div id="home-container">
      <h1 id="home-title">Secure file storage,</h1>
      <h1 id="home-subtitle">With access wherever you go</h1>
      <p id="home-p">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
        accusamus, placeat.
      </p>
      <Link to="/signup">
        <button>Get Started</button>
      </Link>{" "}
    </div>
  );
};

export default Homepage;
