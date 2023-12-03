// mongoose
import mongoose, { Model } from "mongoose";

// project imports
import { config } from "../config/config";

// interfaces
import { IContent } from "../constans/Interfaces";
import { Schema } from "mongoose";

/** Start Schema **/
const contentSchema: Schema<IContent> = new Schema(
  {
    adminLogo: String,
    appLogo: String,
    adminTitle: String,
    appTitle: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
/** End Schema **/

/** Start Mongoose Functions **/
const Content: Model<IContent> = mongoose.model<IContent>(
  "Content",
  contentSchema
);
/** End Mongoose Functions **/

export default Content;

/** Start Handler Functions **/
// Create Default Content
mongoose
  .model("Content", contentSchema)
  .findOne()
  .then(async (data) => {
    if (data) {
      console.log("Default content already created.");
    } else {
      try {
        await mongoose
          .model("Content", contentSchema)
          .create(config.contentData);
        console.log("Default content created successfully");
      } catch (e) {
        console.log("Error create default content");
        console.log(e);
      }
    }
  })
  .catch(() => console.log("Error create default content"));
/** End Mongoose Functions **/
