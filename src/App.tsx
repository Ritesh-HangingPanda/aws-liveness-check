import { ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import AwsConfig from "./aws-exports";
import LivenessComponent from "./LivenessComponent";

// Configure Amplify
Amplify.configure(AwsConfig);

// Extend Window interface to support ReactNativeWebView
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export default function App() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center h-dvh">
      <h1 className="text-3xl font-bold text-gray-800">
        Face Liveness Detection
      </h1>
      <ThemeProvider>
        <LivenessComponent />
      </ThemeProvider>
    </div>
  );
}
