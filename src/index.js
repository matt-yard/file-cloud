import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./components/App";
import Homepage from "./components/Homepage";
import { Amplify, Storage } from "aws-amplify";
import awsconfig from "./aws-exports";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";

Amplify.configure(awsconfig);
Storage.configure({ level: "private" });

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
