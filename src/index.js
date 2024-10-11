import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {BrowserRouter} from 'react-router-dom'
import {Toaster} from "react-hot-toast"
import { VendorProvider } from "./utils/vendorContext"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <VendorProvider>
      <App />
      <Toaster/>
    </VendorProvider>
  </BrowserRouter>
);
