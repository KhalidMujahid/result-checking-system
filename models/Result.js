const { model, Schema } = require("mongoose");

const ResultSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    course_code: Array,
    course_grade: Array,
  },
  { timestamps: true }
);

module.exports = model("Result", ResultSchema);
