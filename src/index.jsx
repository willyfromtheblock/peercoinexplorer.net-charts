import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
