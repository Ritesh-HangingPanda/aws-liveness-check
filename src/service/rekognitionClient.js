import { RekognitionClient } from "@aws-sdk/client-rekognition";
const { REGION_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY } = import.meta.env;

const rekognitionClient = new RekognitionClient({
  region: REGION_NAME,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export default rekognitionClient;
