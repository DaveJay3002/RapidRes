import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Define the detectTextInPng function
export async function detectTextInPng(filePath) {
  const apiKey = process.env.GOOGLE_API_KEY;

  // Read the image file as base64
  const image = fs.readFileSync(filePath, { encoding: 'base64' });

  try {
    // Call the Vision API via REST
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: { content: image },
            features: [{ type: 'TEXT_DETECTION' }]
          }
        ]
      }
    );

    const detections = response.data.responses[0].textAnnotations;
    if (detections && detections.length > 0) {
      // Only take the first element for the full text
      const fullText = detections[0].description.replace(/\s+/g, '');
      
      return fullText;  // Return the text without spaces
    } else {
      return 'No text detected.';
    }
  } catch (error) {
    console.error('Error detecting text:', error.response ? error.response.data : error.message);
    throw error;  // Rethrow the error to be handled by the calling code
  }
}
