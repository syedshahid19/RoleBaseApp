import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const VendorHome = () => {
  const [assignedLeads, setAssignedLeads] = useState([]); // State to store assigned leads
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingLeadId, setUpdatingLeadId] = useState(null); // State to track which lead is being updated
  const [newStatus, setNewStatus] = useState("New"); // Default status to be updated
  const [vendors, setVendors] = useState([]);

  const userId = localStorage.getItem("userId");

  // Fetch vendors and match with userId
  useEffect(() => {
    const fetchVendorsAndLeads = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming auth token is stored in localStorage

        // Fetch vendors first
        const vendorsResponse = await axios.get(`${BASE_URL}/vendor/getAllVendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allVendors = vendorsResponse.data.vendors;
        setVendors(allVendors);

        // Find vendor with matching userId
        const vendor = allVendors.find((v) => v.userId._id === userId);
        if (!vendor) {
          setError("Vendor not found for this user.");
          setLoading(false);
          return;
        }

        // Fetch assigned leads for the found vendor
        const response = await axios.get(`${BASE_URL}/vendor/${vendor._id}/getAssignedleads`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        });
        setAssignedLeads(response.data.leads); // Assuming the leads array is inside `data.leads`
      } catch (err) {
        console.error("Error fetching assigned leads or vendors:", err);
        setError("Failed to load assigned leads");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorsAndLeads();
  }, [userId]);

  // Function to handle lead status update
  const updateLeadStatus = async (leadId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.put(
        `${BASE_URL}/vendor/leads/${leadId}/status`, // Update lead status endpoint
        { status: newStatus }, // Sending new status to update
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Immediately update the assigned leads list with the new status without needing a refresh
      setAssignedLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === leadId ? response.data.lead : lead
        )
      );
      setUpdatingLeadId(null); // Reset after updating
    } catch (err) {
      console.error("Error updating lead status:", err);
      setError("Failed to update lead status");
    }
  };

  if (loading) {
    return <div>Loading assigned leads...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Assigned Leads</h1>

      {assignedLeads.length === 0 ? (
        <div>No leads assigned yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {assignedLeads.map((lead) => (
            <div
              key={lead._id}
              className="bg-white shadow-lg rounded-lg p-4 transform transition-transform duration-300 hover:scale-105"
            >
              <h2 className="text-xl font-semibold mb-2">{lead.name}</h2>
              <p className="text-gray-600 mb-4">Status: {lead.status}</p>
              <p className="text-gray-600 mb-4">Contact: {lead.contact}</p>

              {/* Update Status Section */}
              {updatingLeadId === lead._id ? (
                <>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="border rounded p-1"
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
              ) : (
                <button
                  onClick={() => setUpdatingLeadId(lead._id)}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorHome;
