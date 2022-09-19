import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";

const awsConfig = {
  aws_project_region: localStorage.getItem("region"),
  aws_cognito_region: localStorage.getItem("region"),
  aws_user_pools_id: localStorage.getItem("userPoolId"),
  aws_user_pools_web_client_id: localStorage.getItem("userPoolClientId"),
};
Amplify.configure(
  (awsConfig.aws_user_pools_id &&
    awsConfig.aws_user_pools_web_client_id &&
    awsConfig) ||
    {}
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
