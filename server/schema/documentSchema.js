import mongoose from "mongoose";

const documentSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  // title: String,
});

const document = mongoose.model("document", documentSchema); // create a model from schema, collection name is "document"

export default document;
