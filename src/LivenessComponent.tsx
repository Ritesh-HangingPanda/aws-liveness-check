import { useEffect, useState } from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';

// Extend Window interface to support ReactNativeWebView
declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}

export default function LivenessComponent() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Fetch session from backend
    const getSession = async () => {
        setLoading(true);
        try {
            // TODO: Replace with your API Gateway endpoint
            const res = await fetch('https://your-api.com/create-liveness-session', {
                method: 'POST',
                credentials: 'include', // if using cookies/auth
            });
            const data = await res.json();
            setSessionId(data.sessionId);
        } catch (err) {
            setSessionId(null);
        } finally {
            setLoading(false);
        }
    };

    // 2. On completion, fetch result and send to ReactNativeWebView
    const onAnalysisComplete = async (): Promise<void> => {
        if (!sessionId) return;
        try {
            const res = await fetch(
                `https://your-api.com/liveness-result?sessionId=${sessionId}`,
                { credentials: 'include' }
            );
            const data = await res.json();
            const confidence = data?.confidence || 0;
            const isLive = confidence > 75;
            const imageBytes = data?.referenceImageBytes || data?.ReferenceImage?.Bytes;
            if (imageBytes) {
                const uint8Array = new Uint8Array(Object.values(imageBytes));
                const blob = new Blob([uint8Array], { type: 'image/jpeg' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const imageBase64 = reader.result as string;
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(
                            JSON.stringify({ isLive, confidence, imageBase64 })
                        );
                    }
                };
                reader.readAsDataURL(blob);
            } else {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(
                        JSON.stringify({ isLive, confidence, imageBase64: null })
                    );
                }
            }
        } catch (error) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                    JSON.stringify({ error: (error as Error).message })
                );
            }
        }
    };

    useEffect(() => {
        getSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading || !sessionId) return <p>Loading liveness session...</p>;

    return (
        <FaceLivenessDetector
            sessionId={sessionId}
            region="us-east-1"
            onAnalysisComplete={onAnalysisComplete}
        />
    );
}
