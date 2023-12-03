class APIFeatures {
  /** Start Variables **/
  query: any;
  queryString: any;
  Model: any;
  length: Promise<number>;
  /** End Variables **/

  /** Start constructor **/
  constructor(query: any, queryString: any, Model: any) {
    this.query = query;
    this.queryString = queryString;
    this.Model = Model;
  }
  /** End constructor **/

  /** Start Methods **/
  filter() {
    const queryObj: any = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex|options|exists|ne)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    this.length = this.Model.countDocuments(this.query);
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.sort({createdAt: -1}).skip(skip).limit(limit);

    return this;
  }
  /** End Methods **/
}

export default APIFeatures;
