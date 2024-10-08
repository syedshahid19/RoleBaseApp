import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AdminHome = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('authToken'); // or however you are storing the token
        console.log("Token:", token);
        const response = await axios.get(`${BASE_URL}/admin/leads`, {
          headers: {
            Authorization: `Bearer ${token}` // Add your token here
          }
        });
        console.log(response.data);
        setLeads(response.data.leads) // Assuming your API returns an array of leads
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("Failed to load leads");
      } finally {
        setLoading(false);
      }
    };
  
    fetchLeads();
  }, []);
  

  if (loading) {
    return <div>Loading leads...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Leads</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="bg-white shadow-lg rounded-lg p-4 transform transition-transform duration-300 hover:scale-105"
          >
            <h2 className="text-xl font-semibold mb-2">{lead.name}</h2>
            <p className="text-gray-600 mb-4">Status: {lead.status}</p>
            <p className="text-gray-600 mb-4">Contact: {lead.contact}</p>
            <div className="flex justify-between">
              <button className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors">
                Assign
              </button>
              <button className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors">
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
