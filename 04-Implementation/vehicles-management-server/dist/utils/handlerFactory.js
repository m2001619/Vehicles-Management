"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockActiveOne = exports.deleteOne = exports.updateOne = exports.createOne = exports.getOne = exports.getAll = void 0;
// npm packages
const formidable_1 = require("formidable");
// project imports
const handlerFormData_1 = require("./handlerFormData");
const catchAsync_1 = __importDefault(require("./catchAsync"));
const AppError_1 = __importDefault(require("./AppError"));
const apiFeatures_1 = __importDefault(require("./apiFeatures"));
/** Start Functions **/
const getAll = (Model, filter = () => ({}), handleQuery = (query) => query, populate) => (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = handleQuery(Model.find(filter(req, res)));
    // EXECUTE QUERY
    const features = new apiFeatures_1.default(query, req.query, Model)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    let data = features.query;
    if (populate) {
        populate.forEach((i) => (data = data.populate(i)));
    }
    data = yield data.exec();
    const length = yield features.length;
    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: data.length,
        length,
        data,
    });
}));
exports.getAll = getAll;
const getOne = (Model) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = Model.findById(req.params.id);
    const data = yield query;
    if (!data) {
        return next(new AppError_1.default("No document found with this Id", 404));
    }
    res.status(200).json({
        status: "success",
        data,
    });
}));
exports.getOne = getOne;
const createOne = (Model, fun = () => __awaiter(void 0, void 0, void 0, function* () { })) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Use formidable package to access Form Data in req
    const form = new formidable_1.Formidable({ multiples: true });
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                next(err);
                return;
            }
            // 2) handle form data fields
            const formFields = yield (0, handlerFormData_1.handleFormFields)(fields);
            // 3) create a new query and check if there are any validation problems before store files
            const newModel = yield Model.create(formFields);
            // 4) if those no problems, handle form data files and store it in cloud server
            const formFiles = yield (0, handlerFormData_1.handleFormFiles)(files, next);
            // 5) append the files in the query
            const data = yield Model.findByIdAndUpdate(newModel._id, formFiles);
            // 6) function to add another before send response
            yield fun(formFields, data);
            res.status(201).json({
                status: "success",
                message: "Created Successfully",
                data,
            });
        }
        catch (e) {
            next(e);
        }
    }));
}));
exports.createOne = createOne;
const updateOne = (Model, fun = () => __awaiter(void 0, void 0, void 0, function* () { })) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Use formidable package to access Form Data in req
    const form = new formidable_1.Formidable({ multiples: true });
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                next(err);
                return;
            }
            // 2) handle form data fields
            const formFields = yield (0, handlerFormData_1.handleFormFields)(fields);
            // 3) update query and check if there are any validation problems before store files
            const updatedModel = yield Model.findByIdAndUpdate(req.params.id, formFields, {
                new: true,
                runValidators: true,
            });
            if (!updatedModel)
                return next(new AppError_1.default("No document found with this Id", 404));
            // 4) if those no problems, handle form data files and store it in cloud server
            let filesObj = {};
            Object.keys(files)
                .filter((i) => !!fields[i])
                .forEach((i) => (filesObj[i] = fields[i]));
            const formFiles = yield (0, handlerFormData_1.handleFormFiles)(files, next, filesObj);
            // 5) append the files in the query
            const data = yield Model.findByIdAndUpdate(updatedModel._id, formFiles);
            // 6) function to add another before send response
            yield fun(req, data);
            res.status(200).json({
                status: "success",
                data,
            });
        }
        catch (e) {
            next(e);
        }
    }));
}));
exports.updateOne = updateOne;
const deleteOne = (Model, fun = () => __awaiter(void 0, void 0, void 0, function* () { })) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findById(req.params.id);
    if (!doc) {
        return next(new AppError_1.default("No document found with this Id", 404));
    }
    yield fun(doc);
    yield Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.deleteOne = deleteOne;
const blockActiveOne = (Model, fun = () => __awaiter(void 0, void 0, void 0, function* () { })) => (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = yield Model.findById(req.params.id);
    if (model) {
        yield Model.findByIdAndUpdate(model._id, {
            status: model.status === "ACTIVE" ? "BLOCK" : "ACTIVE",
        });
    }
    yield fun(model);
    res.status(200).json({
        status: "success",
        message: `${model.status === "ACTIVE" ? "Blocked" : "Active"} Successfully`,
    });
}));
exports.blockActiveOne = blockActiveOne;
/** End Functions **/
