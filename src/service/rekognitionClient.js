import { RekognitionClient } from "@aws-sdk/client-rekognition";
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY } = import.meta.env;

const rekognitionClient = new RekognitionClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export default rekognitionClient;
