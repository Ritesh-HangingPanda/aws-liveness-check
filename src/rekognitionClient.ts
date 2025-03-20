import { RekognitionClient } from "@aws-sdk/client-rekognition";
const { VITE_REGION_NAME, VITE_ACCESS_KEY_ID, VITE_SECRET_ACCESS_KEY } =
  import.meta.env;

const rekognitionClient = new RekognitionClient({
  region: VITE_REGION_NAME,
  credentials: {
    accessKeyId: VITE_ACCESS_KEY_ID,
    secretAccessKey: VITE_SECRET_ACCESS_KEY,
  },
});

export default rekognitionClient;
