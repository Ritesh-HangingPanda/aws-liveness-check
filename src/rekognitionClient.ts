import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const rekognitionClient = new RekognitionClient({
  region: "us-east-1",
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: "us-east-1" },
    identityPoolId: "us-east-1:095d3f44-188a-4f78-b5e6-8631747bc1b6",
  }),
});

export default rekognitionClient;
