const { model, Schema } = require("mongoose");

const StudentSchema = new Schema(
  {
    fname: String,
    lname: String,
    matnumber: String,
    level: String,
    dept: String,
    courses: Array,
  },
  { timestamps: true }
);

module.exports = model("Student", StudentSchema);
