import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true); 
  const isTokenExpired = (token)=>{
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now()/1000;
      return decoded.exp< currentTime; // True if the token is expired
    }catch(err){
      return true;
    }
  }
  const getAccessToken =() =>{
    const localtoken =localStorage.getItem('token');
    if(!localtoken || isTokenExpired(localtoken)){
      localStorage.removeItem('token');
      return null;
    }
    return token;
  }  

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLoading(false); 
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, refreshToken, setRefreshToken, loading, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};