"use client";

import React, { createContext, useContext, useState } from "react";

const OwnerContext = createContext(null);

export const OwnerProvider = ({ children }) => {
  const [ownerId, setOwnerId] = useState(null);

  return (
    <OwnerContext.Provider value={{ ownerId, setOwnerId }}>
      {children}
    </OwnerContext.Provider>
  );
};


export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error("useOwner must be used within an OwnerProvider");
  }
  return context;
};