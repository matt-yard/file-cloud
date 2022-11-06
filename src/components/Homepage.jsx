import React from "react";
import { Link } from "react-router-dom";
import "../styles/Homepage.css";
import { useOutletContext } from "react-router-dom";
import MyDrive from "./MyDrive";

const Homepage = () => {
  const { currentUser } = useOutletContext();

  console.log("this is the current user from homepage", currentUser);
  return (
    <>
      {currentUser ? (
        <MyDrive />
      ) : (
        <div id="home-container">
          <h1 id="home-title">Secure file storage,</h1>
          <h1 id="home-subtitle">With access everywhere you need it.</h1>
          <p id="home-p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
            accusamus, placeat.
          </p>
          <Link to="/signup">
            <button>Get Started</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Homepage;
