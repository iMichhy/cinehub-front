import React from "react";

const AuthContext = React.createContext({
    isConnected: false,
    setIsConnected: () => {},
    user : {},
    setUser: () => {}
});

export default AuthContext;
