const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  accessLevel: String,
  joinedEvents: [String]
});

accountSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Account", accountSchema);
