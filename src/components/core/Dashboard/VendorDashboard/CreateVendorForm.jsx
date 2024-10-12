import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CreateVendorForm = () => {
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = async (e) => {
    const userId = localStorage.getItem("userId");
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${BASE_URL}/vendor/Createvendor`, {
        userId,
        location,
        service
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Vendor added successfully!");
      // Reset form fields after successful submission
      resetForm();
    } catch (err) {
      toast.error("Vendor already exists");
      resetForm();
    }
  };

  const resetForm = () => {
    setLocation("");
    setService("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto p-6 bg-richblack-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-richblue-500">Create Vendor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="border p-3 w-full rounded bg-richblack-800 text-richblack-200"
          >
            <option value="">Select Location</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="China">China</option>
            <option value="Japan">Japan</option>
          </select>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="border p-3 w-full rounded bg-richblack-800 text-richblack-200"
          >
            <option value="">Select Service</option>
            <option value="Investment Advice">Investment Advice</option>
            <option value="Wealth Management">Wealth Management</option>
            <option value="Financial Planning">Financial Planning</option>
          </select>
          <button
            type="submit"
            className="bg-caribbeangreen-200 text-white py-3 px-6 w-full rounded-lg hover:bg-caribbeangreen-300 transition-colors"
          >
            Create Vendor
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVendorForm;
