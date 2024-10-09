import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AdminHome = () => {
  const [leads, setLeads] = useState([]);
  const [vendors, setVendors] = useState([]); // State for storing vendors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("leads"); // State to track active tab (default is 'leads')
  const [updatingLeadId, setUpdatingLeadId] = useState(null); // State for which lead is being updated
  const [newStatus, setNewStatus] = useState("New"); // Default status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve auth token

        // Fetch Leads
        const leadsResponse = await axios.get(`${BASE_URL}/admin/leads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeads(leadsResponse.data.leads);

        // Fetch Vendors
        const vendorsResponse = await axios.get(`${BASE_URL}/admin/getVendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVendors(vendorsResponse.data.vendors); // Assuming your API returns vendors array

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateLeadStatus = async (leadId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${BASE_URL}/admin/leads/${leadId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead._id === leadId ? response.data.lead : lead))
      );
      setUpdatingLeadId(null);
    } catch (error) {
      console.error("Error updating lead status:", error);
      setError("Failed to update lead status");
    }
  };

  if (loading) {
    return <div>Loading leads and vendors...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-center space-x-4 mb-6">
        {/* Tab Buttons */}
        <button
          onClick={() => setActiveTab("leads")}
          className={`py-2 px-4 rounded ${
            activeTab === "leads" ? " bg-green-400 text-white" : " bg-red-100"
          }`}
        >
          Leads
        </button>
        <button
          onClick={() => setActiveTab("vendors")}
          className={`py-2 px-4 rounded ${
            activeTab === "vendors" ? " bg-green-400 text-white" : " bg-red-100"
          }`}
        >
          Vendors
        </button>
      </div>

      {/* Conditional Rendering based on activeTab */}
      {activeTab === "leads" && (
        <>
          <h1 className="text-3xl font-bold mb-6">All Leads</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white shadow-lg rounded-lg p-4 transform transition-transform duration-300 hover:scale-105"
              >
                <h2 className="text-xl font-semibold mb-2">{lead.name}</h2>
                <p className="text-gray-600 mb-4">Status: {lead.status}</p>
                <p className="text-gray-600 mb-4">Contact: {lead.contact}</p>
                <div className="flex justify-between items-center">
                  <button className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors">
                    Assign
                  </button>
                  <button
                    onClick={() => setUpdatingLeadId(lead._id)}
                    className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors"
                  >
                    Update Status
                  </button>
                  {updatingLeadId === lead._id && (
                    <>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="border rounded p-1 ml-2"
                      >
                        <option value="New">New</option>
                        <option value="Pending">Pending</option>
                        <option value="Deal Won">Deal Won</option>
                        <option value="Deal Lost">Deal Lost</option>
                      </select>
                      <button
                        onClick={() => updateLeadStatus(lead._id)}
                        className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors ml-2"
                      >
                        Confirm
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "vendors" && (
        <>
          <h1 className="text-3xl font-bold mb-6">All Vendors</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="bg-white shadow-lg rounded-lg p-4 transform transition-transform duration-300 hover:scale-105"
              >
                <h2 className="text-xl font-semibold mb-2">{vendor.name}</h2>
                <p className="text-gray-600 mb-4">Location: {vendor.location}</p>
                <p className="text-gray-600 mb-4">Service: {vendor.service}</p>
                <p className="text-gray-600 mb-4">Phone: {vendor.phone}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHome;
