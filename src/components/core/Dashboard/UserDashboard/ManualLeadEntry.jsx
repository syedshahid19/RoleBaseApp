import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManualLeadEntry = () => {
  const [leadData, setLeadData] = useState({
    name: "",
    contact: "",
    service: "",
    location:"",
    status: "New",
  });

  const handleChange = (e) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/user/createLead`, leadData); 
      toast.success("Lead added successfully!");
      setLeadData({
        name: "",
        contact: "",
        service: "",
        location:"",
        status: "New",
      });
    } catch (err) {
      console.error(err);
      toast.error("Lead Already Exists");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Manual Lead Entry</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 text-gray-700 font-semibold">Name</label>
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
        <label htmlFor="contact" className="block mb-2 text-gray-700 font-semibold">Contact</label>
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
        <label htmlFor="service" className="block mb-2 text-gray-700 font-semibold">Service Interested In</label>
        <input
          type="text"
          name="service"
          id="service"
          value={leadData.service}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="contact" className="block mb-2 text-gray-700 font-semibold">Location</label>
        <input
          type="text"
          name="location"
          id="location"
          value={leadData.location}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block mb-2 text-gray-700 font-semibold">Status</label>
        <select
          name="status"
          id="status"
          value={leadData.status}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="New">New</option>
          <option value="Pending">Pending</option>
          <option value="Deal Won">Deal Won</option>
          <option value="Deal Lost">Deal Lost</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700 transition duration-200 ease-in-out">
        Add Lead
      </button>
    </form>
  );
}

export default ManualLeadEntry;
