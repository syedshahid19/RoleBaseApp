import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("response of bulk upload", response.data);
      
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      setFile(null); // Clear the file state
      e.target.reset(); // Reset the form including the file input field
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md mx-auto p-6 bg-richblack-50 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-richblue-400 mb-6 text-center">
          Bulk Upload CSV
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            required
            className="w-full px-3 py-2 bg-richblack-25 border border-richblack-200 rounded focus:outline-none focus:ring-2 focus:ring-caribbeangreen-100"
          />
          <button
            type="submit"
            disabled={isUploading || !file}
            className={`w-full py-2 text-white bg-caribbeangreen-200 rounded-md shadow ${
              isUploading
                ? 'bg-caribbeangreen-100 cursor-not-allowed'
                : 'hover:bg-caribbeangreen-300'
            } transition-all duration-300`}
          >
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BulkUpload;
