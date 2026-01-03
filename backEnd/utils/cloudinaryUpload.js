import cloudinary from "../config/cloudinary.config.js";

const handleUploadOnCloudinary = (buffer, folder = "Aurawear") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

export default handleUploadOnCloudinary;
