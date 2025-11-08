"use server";

import * as fs from 'fs'; // Note: In a Vercel/Next.js environment, standard Node/Web APIs are used
// 'fs' is not strictly necessary here, but we'll use Buffer which is native to Node/Edge environments.

/**
 * Configuration and API Key.
 *
 * IMPORTANT: Replace this placeholder with your actual ImgBB API Key.
 * In a production Next.js app, this should be stored securely in an 
 * environment variable (e.g., process.env.IMGBB_API_KEY).
 */
const IMGBB_API_KEY = process.env.IMGBB_API_KEY
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

// Define the shape of the response object
type UploadResponse = {
  success: boolean;
  message: string;
  url?: string;
  error?: string;
};

/**
 * Uploads an image file contained in a FormData object to the ImgBB service.
 * This function is intended to be called directly from a Next.js form action.
 *
 * @param formData - The FormData object submitted from the client-side form.
 * @returns A structured response indicating success or failure.
 */
export async function uploadImageAction(formData: FormData): Promise<UploadResponse> {

  // 1. Get the file from the FormData object
  const file = formData.get("image");

  if (!file || typeof file === 'string') {
    return { success: false, message: "No image file provided in the form data.", error: "MISSING_FILE" };
  }

  if (!IMGBB_API_KEY) {
    return { success: false, message: "ImgBB API Key is missing or using the placeholder. Check your environment variables.", error: "MISSING_API_KEY" };
  }

  try {
    // 2. Convert the File (Blob/File) to a Base64 string
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString('base64');

    // 3. Prepare the ImgBB API request payload
    // ImgBB requires the image data and the key to be sent as URL-encoded parameters 
    // or multipart/form-data. Using standard fetch with Base64 is reliable.
    const apiUrl = `${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`;

    const apiFormData = new FormData();
    apiFormData.append('image', base64Image);

    // Optional: set a name/title if needed, ImgBB will generate one if missing
    apiFormData.append('name', file.name || 'uploaded-image');

    // 4. Execute the secure fetch call to ImgBB
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: apiFormData,
    });

    // 5. Check response status and parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("ImgBB API Error Response:", errorText);
      return {
        success: false,
        message: `ImgBB API failed with status ${response.status}.`,
        error: `API_ERROR_${response.status}`
      };
    }

    const data = await response.json();

    // 6. Check ImgBB's specific success property
    if (data.success && data.data && data.data.url) {
      return {
        success: true,
        message: "Image successfully uploaded to ImgBB.",
        url: data.data.url,
      };
    } else {
      console.error("ImgBB Response Data:", data);
      return {
        success: false,
        message: data.error?.message || "ImgBB upload failed with no clear error message.",
        error: data.error?.code || "UPLOAD_FAILURE"
      };
    }

  } catch (e) {
    const error = e as Error;
    console.error("Internal Server Action Error:", error);
    return {
      success: false,
      message: `An internal server error occurred: ${error.message}`,
      error: "INTERNAL_ERROR"
    };
  }
}
