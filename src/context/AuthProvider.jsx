import React, { useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState({});

  return (
    <>
      <AuthContext.Provider value={{ authUser, setAuthUser }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
