// project imports
import { getImageUrl } from "./storageCloud";

// interfaces
import { Fields, Files } from "formidable";
import { NextFunction } from "express";

/** Start Functions **/
export const handleFormFields = async (fields: Fields) => {
  const fieldsObj = {};

  Object.keys(fields).forEach((el) => {
    try {
      fieldsObj[el] = JSON.parse(fields[el][0]);
    } catch (e) {
      fieldsObj[el] = fields[el][0];
    }
  });

  return fieldsObj;
};

export const handleFormFiles = async (
  files: Files,
  next: NextFunction,
  filesObj: object = {}
) => {
  for (const key of Object.keys(files)) {
    if (files[key].length > 1) {
      for (const file of files[key]) {
        filesObj[key].push(await getImageUrl(file.filepath, next));
      }
    } else {
      filesObj[key] = await getImageUrl(files[key][0].filepath, next);
    }
  }

  return filesObj;
};
/** End Functions **/
