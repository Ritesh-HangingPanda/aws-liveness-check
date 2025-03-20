import React, { useEffect, useState } from "react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { Loader, ThemeProvider, Alert } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import {
  createLivenessSession,
  getLivenessSessionResults,
} from "../service/livenessSdk";
import { Amplify } from "aws-amplify";
import awsconfig from "../service/aws-exports";
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY } = import.meta.env;

Amplify.configure(awsconfig);

const CheckLiveness = () => {
  const [loading, setLoading] = useState(true);
  const [livenessStatus, setLivenessStatus] = useState({
    checked: false,
    isLive: false,
  });
  const [createLivenessApiData, setCreateLivenessApiData] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await createLivenessSession();
        const data = await JSON.parse(response.body);
        setCreateLivenessApiData({ sessionId: data?.result?.SessionId });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleAnalysisComplete = async () => {
    try {
      const response = await getLivenessSessionResults(
        createLivenessApiData?.sessionId
      );
      const data = await JSON.parse(response.body);

      const confidence = data.result.Confidence;
      const isLive = confidence > 0.9;

      setLivenessStatus({
        checked: true,
        isLive,
        confidence: Math.round(confidence * 100) / 100,
      });
    } catch (error) {
      console.error("Error getting liveness result:", error);
      setLivenessStatus({
        checked: true,
        isLive: false,
      });
    }
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader size="large" />
            <p className="mt-2 text-gray-600 text-center">
              Initializing liveness detection...
            </p>
          </div>
        ) : (
          <>
            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
              <FaceLivenessDetector
                sessionId={createLivenessApiData?.sessionId}
                region="us-east-1"
                credentials={{
                  accessKeyId: ACCESS_KEY_ID,
                  secretAccessKey: SECRET_ACCESS_KEY,
                }}
                onAnalysisComplete={handleAnalysisComplete}
                onError={(error) => {
                  console.error(error);
                  setLivenessStatus({
                    checked: true,
                    isLive: false,
                  });
                }}
              />
            </div>

            {livenessStatus.checked && (
              <Alert
                variation={livenessStatus.isLive ? "success" : "error"}
                isDismissible={false}
                hasIcon={true}
                className="w-full max-w-lg mt-4 p-3 text-center"
              >
                {livenessStatus.isLive
                  ? `Liveness Check Passed! (Confidence: ${livenessStatus.confidence}%)`
                  : "Liveness Check Failed"}
              </Alert>
            )}
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CheckLiveness;
