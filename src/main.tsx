import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'
import { OidcProvider } from "./OidcProvider";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <OidcProvider>
    <App />
  </OidcProvider>
);
