import Document from "../schema/documentSchema.js";

// return document if it exists else create a new document
export const getDocument = async (id) => {
  if (id === null) return;

  const document = await Document.findById(id);

  if (document) return document; // if document exists, return the document

  // otherwise create a new document
  return await Document.create({ _id: id, data: "" }); // create document with id and empty data, id from url
};
