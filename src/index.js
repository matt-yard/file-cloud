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

console.log(
  "👋 Hey fellow developer! If you're interested in how I built this website, check out my github https://github.com/matt-yard/file-cloud. Thanks for stopping by!"
);

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
root.render(<RouterProvider router={router} />);
