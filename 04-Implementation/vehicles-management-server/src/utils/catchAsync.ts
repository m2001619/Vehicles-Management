// express
import { Response, NextFunction } from "express";

// interfaces
import {ICostumeRequest} from "../constans/Interfaces";

/** Start Functions **/
const asyncHandler = (
  fn: (req: ICostumeRequest, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: ICostumeRequest, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
};
/** End Functions **/

export default asyncHandler;
