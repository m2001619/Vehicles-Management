// npm packages
import cloudinary from "cloudinary";

// project imports
import { config } from "../config/config";

// interfaces
import { NextFunction } from "express";

/** Start Variables **/
const { cloud_name, api_key, api_secret } = config.cloudinary;
cloudinary.v2.config({
  cloud_name,
  api_key,
  api_secret,
});
/** End Variables **/

/** Start Functions **/
export const getImageUrl = async (filePath: string, next: NextFunction) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    next(error);
  }
};
/** End Functions **/
