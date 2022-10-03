const { connect } = require("mongoose");

// connect DB
connect("mongodb://localhost/Result-Processing")
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error));
