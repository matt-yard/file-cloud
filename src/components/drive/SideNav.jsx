import React from "react";
import {
  FaFolder,
  FaShareAltSquare,
  FaFile,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

import "../../styles/SideNav.css";

const SideNav = ({ setCurrentUser }) => {
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
    <nav id="side-nav">
      <h1>
        <span id="logo-left">file</span>
        <span id="logo-right">cloud</span>
      </h1>
      <div id="side-nav-center">
        <div className="side-nav-item active-link">
          <FaFolder size="30px" />
          <p>My Cloud</p>
        </div>

        <div className="side-nav-item">
          <FaShareAltSquare size="30px" />
          <p>Shared</p>
        </div>
        <div className="side-nav-item">
          <FaFile size="30px" />
          <p>All Files</p>
        </div>
      </div>
      <div id="side-nav-bottom">
        <div className="side-nav-item" onClick={handleSignOut}>
          <FaSignOutAlt size="30px" />
          <p>Logout</p>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
