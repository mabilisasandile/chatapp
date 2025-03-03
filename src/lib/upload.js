import axios from "axios";
import { toast } from "react-toastify";

const uploadImageToCloudinary = async (file, cloudName, uploadPreset) => {
  if (!file || !cloudName || !uploadPreset) {
    throw new Error("Missing required parameters: file, cloudName, or uploadPreset.");
  }

  // Create a FormData object
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  try {
    // Upload the image to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Return the secure URL of the uploaded image
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    toast.error("Failed to upload image to Cloudinary.");
  }
};

export default uploadImageToCloudinary;