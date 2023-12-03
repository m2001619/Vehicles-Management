// models
import ContentModel from "../models/contentModel";

// project imports
import { getAll, updateOne } from "../utils/handlerFactory";

/** Start Routes Functions **/
export const getContent = getAll(ContentModel);
export const updateContent = updateOne(ContentModel);
/** End Routes Functions **/
