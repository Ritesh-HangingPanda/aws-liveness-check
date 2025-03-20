import { useEffect, useState } from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider, Alert, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { createLivenessSession, getLivenessSessionResults } from './livenessSdk';
import { Amplify } from 'aws-amplify';
import AwsConfig from './aws-exports';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [livenessStatus, setLivenessStatus] = useState<{
    checked: boolean;
    isLive: boolean;
    confidence?: number;
  }>({ checked: false, isLive: false });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [verificationComplete, setVerificationComplete] = useState<boolean>(false);
  const [userCancelled, setUserCancelled] = useState<boolean>(false);

  const fetchSession = async () => {
    setLoading(true);
    setVerificationComplete(false);
    setLivenessStatus({ checked: false, isLive: false });
    setUserCancelled(false);
    try {
      const response = await createLivenessSession();
      const data = JSON.parse(response.body);
      setSessionId(data?.result?.SessionId || null);
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleAnalysisComplete = async (): Promise<void> => {
    try {
      const response = await getLivenessSessionResults(sessionId as string);
      const data = JSON.parse(response.body);
      const confidence = data?.result?.Confidence || 0;
      const isLive = confidence > 0.9;

      setLivenessStatus({
        checked: true,
        isLive,
        confidence: Math.round(confidence * 100) / 100
      });
      setVerificationComplete(true);

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ isLive, confidence })
        );
      }
    } catch (error) {
      console.error('Error getting liveness result:', error);
      setLivenessStatus({ checked: true, isLive: false });
      setVerificationComplete(true);

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ error: (error as Error).message })
        );
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center h-dvh">
      <h1 className="text-3xl font-bold text-gray-800">Face Liveness Detection</h1>

      <ThemeProvider>
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader size="large" />
            <p className="mt-2 text-gray-600">Initializing liveness detection...</p>
          </div>
        ) : (
          <>
            {!verificationComplete && !userCancelled && (
              <div className="w-full flex justify-center">
                <FaceLivenessDetector
                  key={sessionId}
                  sessionId={sessionId || ""}
                  region="us-east-1"
                  onAnalysisComplete={handleAnalysisComplete}
                  onError={(error) => {
                    console.error("Liveness detector error:", error);
                    setLivenessStatus({ checked: true, isLive: false });
                    setVerificationComplete(true);
                  }}
                  onUserCancel={() => 
                    {setUserCancelled(true)
                    setLivenessStatus({ checked: true, isLive: false })}
                  }
                />
              </div>
            )}

            {(livenessStatus.checked || userCancelled) && (
              <div className='grid place-items-center h-[20vh]'>
                <div className="mt-4">
                  {livenessStatus.checked && (
                    <Alert
                      variation={livenessStatus.isLive ? "success" : "error"}
                      isDismissible={false}
                      hasIcon={true}
                      className="p-4 text-lg"
                    >
                      {livenessStatus.isLive
                        ? `🎉 You are live! Confidence: ${livenessStatus.confidence}%`
                        : "❌ Sorry, you are not a live user."}
                    </Alert>
                  )}
                  <Button
                    variation="primary"
                    className="!mt-10"
                    onClick={fetchSession}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </ThemeProvider>
    </div>
  );
}