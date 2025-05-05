import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import authApi from '../Api/api';
// import LoadingOverlay from '../Shared/LoadingOverlay';
// import LoadingSpinner from "../Component/LoadingSpinner/LoadingSpinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


  return (
      <AuthContext.Provider >
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);