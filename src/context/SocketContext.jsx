// src/contexts/SocketContext.js
import React, { createContext } from "react";
import socket from "../utils/socket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
