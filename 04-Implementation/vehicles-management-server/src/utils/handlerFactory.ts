// npm packages
import { Formidable } from "formidable";

// project imports
import { handleFormFields, handleFormFiles } from "./handlerFormData";
import catchAsync from "./catchAsync";
import AppError from "./AppError";
import APIFeatures from "./apiFeatures";

// interfaces and types
import { Response, NextFunction } from "express";
import { ICostumeRequest } from "../constans/Interfaces";
import { Model, PopulateOptions, Query } from "mongoose";
type ModelType = typeof Model;
type FilterFunction = (req: ICostumeRequest, res: Response) => any;
type HandleQueryFunction = (query: Query<any, any>) => Query<any, any>;
type HandleFormDataFunction = (formData: any, data: any) => Promise<void>;
type HandleUpdateFunction = (req: ICostumeRequest, data: any) => Promise<void>;
type DeleteOneFunction = (data: any) => Promise<void>;
type BlockActiveFunction = (data: any) => Promise<void>;

/** Start Functions **/
export const getAll = (
  Model: ModelType,
  filter: FilterFunction = () => ({}),
  handleQuery: HandleQueryFunction = (query) => query,
  populate?: PopulateOptions[]
) =>
  catchAsync(async (req: ICostumeRequest, res: Response) => {
    const query = handleQuery(Model.find(filter(req, res)));

    // EXECUTE QUERY
    const features = new APIFeatures(query, req.query, Model)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let data = features.query;
    if (populate) {
      populate.forEach((i) => (data = data.populate(i)));
    }
    data = await data.exec();
    const length = await features.length;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: data.length,
      length,
      data,
    });
  });

export const getOne = (Model: ModelType) =>
  catchAsync(
    async (req: ICostumeRequest, res: Response, next: NextFunction) => {
      let query = Model.findById(req.params.id);
      const data = await query;

      if (!data) {
        return next(new AppError("No document found with this Id", 404));
      }

      res.status(200).json({
        status: "success",
        data,
      });
    }
  );

export const createOne = (
  Model: ModelType,
  fun: HandleFormDataFunction = async () => {}
) =>
  catchAsync(
    async (req: ICostumeRequest, res: Response, next: NextFunction) => {
      // 1) Use formidable package to access Form Data in req
      const form = new Formidable({ multiples: true });
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) {
            next(err);
            return;
          }

          // 2) handle form data fields
          const formFields = await handleFormFields(fields);

          // 3) create a new query and check if there are any validation problems before store files
          const newModel = await Model.create(formFields);

          // 4) if those no problems, handle form data files and store it in cloud server
          const formFiles = await handleFormFiles(files, next);

          // 5) append the files in the query
          const data = await Model.findByIdAndUpdate(newModel._id, formFiles);

          // 6) function to add another before send response
          await fun(formFields, data);

          res.status(201).json({
            status: "success",
            message: "Created Successfully",
            data,
          });
        } catch (e) {
          next(e);
        }
      });
    }
  );

export const updateOne = (
  Model: ModelType,
  fun: HandleUpdateFunction = async () => {}
) =>
  catchAsync(
    async (req: ICostumeRequest, res: Response, next: NextFunction) => {
      // 1) Use formidable package to access Form Data in req
      const form = new Formidable({ multiples: true });
      form.parse(req, async (err: any, fields: any, files: any) => {
        try {
          if (err) {
            next(err);
            return;
          }

          // 2) handle form data fields
          const formFields = await handleFormFields(fields);

          // 3) update query and check if there are any validation problems before store files
          const updatedModel = await Model.findByIdAndUpdate(
            req.params.id,
            formFields,
            {
              new: true,
              runValidators: true,
            }
          );

          if (!updatedModel)
            return next(new AppError("No document found with this Id", 404));

          // 4) if those no problems, handle form data files and store it in cloud server
          let filesObj = {};
          Object.keys(files)
            .filter((i) => !!fields[i])
            .forEach((i) => (filesObj[i] = fields[i]));
          const formFiles = await handleFormFiles(files, next, filesObj);

          // 5) append the files in the query
          const data = await Model.findByIdAndUpdate(
            updatedModel._id,
            formFiles
          );

          // 6) function to add another before send response
          await fun(req, data);

          res.status(200).json({
            status: "success",
            data,
          });
        } catch (e) {
          next(e);
        }
      });
    }
  );

export const deleteOne = (
  Model: ModelType,
  fun: DeleteOneFunction = async () => {}
) =>
  catchAsync(
    async (req: ICostumeRequest, res: Response, next: NextFunction) => {
      const doc = await Model.findById(req.params.id);

      if (!doc) {
        return next(new AppError("No document found with this Id", 404));
      }

      await fun(doc);

      await Model.findByIdAndDelete(req.params.id);

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );

export const blockActiveOne = (
  Model: ModelType,
  fun: BlockActiveFunction = async () => {}
) =>
  catchAsync(async (req, res) => {
    const model = await Model.findById(req.params.id);

    if (model) {
      await Model.findByIdAndUpdate(model._id, {
        status: model.status === "ACTIVE" ? "BLOCK" : "ACTIVE",
      });
    }

    await fun(model);

    res.status(200).json({
      status: "success",
      message: `${
        model.status === "ACTIVE" ? "Blocked" : "Active"
      } Successfully`,
    });
  });
/** End Functions **/
