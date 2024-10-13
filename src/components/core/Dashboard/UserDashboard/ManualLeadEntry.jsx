import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Location, Service, and Status Arrays
const locations = ["India", "USA", "UK", "China", "Japan"];
const services = [
  "Investment Advice",
  "Wealth Management",
  "Financial Planning",
];
const statuses = ["New", "Pending", "Deal Won", "Deal Lost"];

const ManualLeadEntry = () => {
  const [leadData, setLeadData] = useState({
    name: "",
    contact: "",
    service: "",
    location: "",
    status: "New",
  });

  const handleChange = (e) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("authToken");
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/user/createLead`, leadData, {headers: { Authorization: `Bearer ${token}` }});
      toast.success("Lead added successfully!");
      // Reset form fields after successful submission
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Lead Already Exists");
      // Reset form fields even if vendor already exists
      resetForm();
    }
  };

  // Function to reset form fields
  const resetForm = () => {
    setLeadData({
      name: "",
      contact: "",
      service: "",
      location: "",
      status: "New",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white sm:p-8 md:p-10 lg:p-12"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Manual Lead Entry
      </h2>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block mb-2 text-gray-700 font-semibold"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={leadData.name}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="contact"
          className="block mb-2 text-gray-700 font-semibold"
        >
          Contact
        </label>
        <input
          type="text"
          name="contact"
          id="contact"
          value={leadData.contact}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="service"
          className="block mb-2 text-gray-700 font-semibold"
        >
          Service Interested In
        </label>
        <select
          name="service"
          id="service"
          value={leadData.service}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Service</option>
          {services.map((service, index) => (
            <option key={index} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="location"
          className="block mb-2 text-gray-700 font-semibold"
        >
          Location
        </label>
        <select
          name="location"
          id="location"
          value={leadData.location}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="status"
          className="block mb-2 text-gray-700 font-semibold"
        >
          Status
        </label>
        <select
          name="status"
          id="status"
          value={leadData.status}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Status</option>
          {statuses.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700 transition duration-200 ease-in-out"
      >
        Add Lead
      </button>
    </form>
  );
};

export default ManualLeadEntry;
