import React, { useState } from "react";

const AdminHome = () => {
  const [leads] = useState([
    { _id: "001", name: "John Doe", status: "New" },
    { _id: "002", name: "Jane Smith", status: "Pending" },
    { _id: "003", name: "Mike Johnson", status: "Deal Won" },
    { _id: "004", name: "Sara Williams", status: "Deal Lost" },
  ]);

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
