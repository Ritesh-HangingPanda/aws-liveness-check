import {
  CreateFaceLivenessSessionCommand,
  GetFaceLivenessSessionResultsCommand,
} from "@aws-sdk/client-rekognition";
import rekognitionClient from "./rekognitionClient";

export const createLivenessSession = async () => {
  try {
    const params = { ClientRequestToken: Date.now().toString() };
    const command = new CreateFaceLivenessSessionCommand(params);
    const response = await rekognitionClient.send(command);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Liveness session created successfully",
        result: response,
      }),
    };
  } catch (error) {
    console.error("Failed to create liveness session", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};

export const getLivenessSessionResults = async (sessionId: string) => {
  try {
    const params = { SessionId: sessionId };
    const command = new GetFaceLivenessSessionResultsCommand(params);
    const response = await rekognitionClient.send(command);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Liveness session results retrieved successfully",
        result: response,
      }),
    };
  } catch (error) {
    console.error("Failed to get liveness session results", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
