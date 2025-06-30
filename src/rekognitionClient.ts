import { RekognitionClient } from "@aws-sdk/client-rekognition";

const rekognitionClient = new RekognitionClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId:'',
    secretAccessKey: '',
  },
});

export default rekognitionClient;
