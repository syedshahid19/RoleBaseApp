import React, { createContext, useContext, useState } from 'react';

// Create the Vendor Context
const VendorContext = createContext();

// Hook to use the Vendor Context
export const useVendors = () => useContext(VendorContext);

// VendorProvider component to wrap your app and provide vendors globally
export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);

  return (
    <VendorContext.Provider value={{ vendors, setVendors }}>
      {children}
    </VendorContext.Provider>
  );
};
