import React from "react";
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_CFAYyT5hN", // Your Cognito domain
    client_id: "7hascthfrhhr9sgmfta53kjpu", // Your app client ID
    redirect_uri: window.location.origin, // Use current origin for redirect
    response_type: "code",
    scope: "openid profile email",
};

export const OidcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AuthProvider {...oidcConfig}>{children}</AuthProvider>
); 