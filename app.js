const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

//Cấu hình view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
console.log(">> ENV SESSION_SECRET:", process.env.SESSION_SECRET);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
console.log("SESSION_SECRET =", process.env.SESSION_SECRET);

// Routes
require("./routes/listRoutes")(app);
module.exports = app;
