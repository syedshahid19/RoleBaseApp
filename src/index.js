import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Global CSS import
import {BrowserRouter} from 'react-router-dom' // Router for navigation
import {Toaster} from "react-hot-toast"
import { VendorProvider } from "./utils/vendorContext" // Context provider for vendor-related state

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <VendorProvider>
      <App />
      <Toaster/>
    </VendorProvider>
  </BrowserRouter>
);
