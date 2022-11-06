import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await Auth.currentUserPoolUser();
        setCurrentUser({
          username: user.username,
          email: user.attributes.email,
          storage: user.storage,
        });
      } catch (error) {
        setCurrentUser(null);
      }
    };
    getCurrentUser();
  }, []);

  return { currentUser, setCurrentUser };
};
