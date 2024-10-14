import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVendors } from "../../../../utils/vendorContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AdminHome = () => {
  const [leads, setLeads] = useState([]);
  const { vendors, setVendors } = useVendors();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("leads"); // State to track active tab (default is 'leads')
  const [updatingLeadId, setUpdatingLeadId] = useState(null); // State for which lead is being updated
  const [newStatus, setNewStatus] = useState("New"); // Default status
  const [selectedVendors, setSelectedVendors] = useState({}); // Store selected vendor per lead
  const [assigningLeadId, setAssigningLeadId] = useState(null); // State for which lead is being assigned a vendor

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 6; // Change this as per desired number of leads per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve auth token

        // Fetch Leads
        const leadsResponse = await axios.get(`${BASE_URL}/admin/leads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeads(leadsResponse.data.leads);

        // Fetch Vendors
        const vendorsResponse = await axios.get(
          `${BASE_URL}/admin/getVendors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVendors(vendorsResponse.data.vendors); //API returns vendors array
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Polling every 3 seconds
    const intervalId = setInterval(fetchData, 3000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [setVendors]);

  const updateLeadStatus = async (leadId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${BASE_URL}/admin/leads/${leadId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === leadId ? response.data.lead : lead
        )
      );
      setUpdatingLeadId(null);
    } catch (error) {
      console.error("Error updating lead status:", error);
      setError("Failed to update lead status");
    }
  };

  const assignVendorToLead = async (leadId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${BASE_URL}/admin/leads/${leadId}/assignVendor`,
        { assignedTo: selectedVendors[leadId] }, // Use the selected vendor for the specific lead
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedLeads = leads.map((lead) =>
        lead._id === leadId
          ? { ...lead, assignedTo: selectedVendors[leadId] }
          : lead
      );
      setLeads(updatedLeads);
      setAssigningLeadId(null); // Reset assigning state
    } catch (error) {
      console.error("Error assigning vendor:", error);
      setError("Failed to assign vendor");
    }
  };

  const handleVendorSelection = (leadId, vendorId) => {
    setSelectedVendors((prevState) => ({
      ...prevState,
      [leadId]: vendorId,
    }));
  };

  if (loading) {
    return (
      <div className=" text-xl text-white">Loading leads and vendors...</div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Function to find the vendor name by its ID
  const getVendorNameById = (vendorId) => {
    const vendor = vendors.find((vendor) => vendor._id === vendorId);

    return vendor ? vendor.userId.firstName : "None"; // Return 'None' if vendor is not found
  };

  // Pagination logic
  const indexOfLastLead = currentPage * leadsPerPage; // Last lead of the current page
  const indexOfFirstLead = indexOfLastLead - leadsPerPage; // First lead of the current page
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead); // Leads for the current page

  const totalPages = Math.ceil(leads.length / leadsPerPage); // Total number of pages

  return (
    <div className=" px-8">
      <div className="flex items-center justify-center space-x-4 mb-6">
        {/* Tab Buttons */}
        <button
          onClick={() => setActiveTab("leads")}
          className={`py-2 px-4 rounded ${
            activeTab === "leads"
              ? " bg-green-400 text-white"
              : " bg-blue-400 text-white"
          }`}
        >
          Leads
        </button>
        <button
          onClick={() => setActiveTab("vendors")}
          className={`py-2 px-4 rounded ${
            activeTab === "vendors"
              ? " bg-green-400 text-white"
              : " bg-blue-400 text-white"
          }`}
        >
          Vendors
        </button>
      </div>

      {/* Conditional Rendering based on activeTab */}
      {activeTab === "leads" && (
        <>
          <h1 className="text-3xl font-bold mb-6 text-white text-center">
            All Leads
          </h1>
          {leads.length === 0 ? (
            <div className="text-2xl text-white text-center">
              No Leads Found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
              {currentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="bg-white shadow-lg rounded-lg p-4 transform transition-transform duration-300 hover:scale-105"
                >
                  <h2 className="text-xl font-semibold mb-2">{lead.name}</h2>
                  <p className="text-gray-600 mb-4">Status: {lead.status}</p>
                  <p className="text-gray-600 mb-4">Contact: {lead.contact}</p>
                  <p className="text-gray-600 mb-4">
                    Assigned Vendor:{" "}
                    {lead.assignedTo
                      ? getVendorNameById(lead?.assignedTo)
                      : "None"}
                  </p>
                  <div className="flex flex-col justify-between items-center gap-3">
                    {/* Assign Vendor Button */}
                    {assigningLeadId === lead._id ? (
                      <>
                        <select
                          value={selectedVendors[lead._id] || ""}
                          onChange={(e) =>
                            handleVendorSelection(lead._id, e.target.value)
                          }
                          className="border rounded p-1 mr-2"
                        >
                          <option value="">Select Vendor</option>
                          {vendors.map((vendor) => (
                            <option key={vendor._id} value={vendor._id}>
                              {vendor?.userId.firstName}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => assignVendorToLead(lead._id)}
                          className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors ml-2"
                        >
                          Confirm
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setAssigningLeadId(lead._id)}
                        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors"
                      >
                        Assign Vendor
                      </button>
                    )}

                    {/* Update Status Button */}
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
                          className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors ml-2"
                        >
                          Save
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`py-2 px-4 rounded ${
                currentPage === 1 ? "bg-gray-400" : "bg-blue-500"
              } text-white`}
            >
              Previous
            </button>
            <span className="flex items-center text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`py-2 px-4 rounded ${
                currentPage === totalPages ? "bg-gray-400" : "bg-blue-500"
              } text-white`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {activeTab === "vendors" && (
        <>
          <h1 className="text-3xl font-bold mb-6 text-white text-center">
            All Vendors
          </h1>
          {vendors.length === 0 ? (
            <div className="text-2xl text-white text-center">
              No Vendors Found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
              {vendors.map((vendor) => {
                const { userId, location, service } = vendor;
                return (
                  <div
                    key={vendor._id}
                    className="bg-white shadow-lg rounded-lg p-4 transform transition-transform duration-300 hover:scale-105"
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      {userId?.firstName}
                    </h2>
                    <p className="text-gray-600 mb-4">Location: {location}</p>
                    <p className="text-gray-600 mb-4">Service: {service}</p>
                    <p className="text-gray-600 mb-4">
                      Phone: {userId?.phoneNumber}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminHome;


