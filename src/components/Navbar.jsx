import React from "react";
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ setCurrentUser, currentUser }) => {
  const navigate = useNavigate();
  console.log(currentUser);

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
      <Link to="/">Home</Link>
      {currentUser ? (
        <button onClick={handleSignOut}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
