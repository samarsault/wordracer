//
// DataStore for Instructor
// File Uploads
//
const { model, Schema } = require("mongoose");

module.exports = model(
  "Score",
  new Schema({
    // derived filename
    user: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    // Used to authenticate user in the background
    // Saved to browser, user doesn't need to be aware of it
    token: {
      type: String,
      unique: true
    },
	created: {
	  type: Date,
	  default: Date.now()
	}
  }),
  "uploads"
);

