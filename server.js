const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const PORT = process.env.PORT || 3001;
const app = express();

// importing database
require("./config/db");

// middlewares
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// session
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: "This is a secret text session",
  })
);

// route import
app.use("/", require("./route/router"));

app.listen(PORT, () => console.log("Server running on port..", PORT));
