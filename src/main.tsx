import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://livenesscheck.auth.us-east-1.amazoncognito.com",
  client_id: "7hacsthfhrhg8rsgmfta3kipu",
  redirect_uri: 'http://localhost:5173/callback',
  response_type: "code",
  scope: "openid email"
};

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
