const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
const { dbconn } = require("./utils/dbconnect");

const express = require("express");
const session = require("express-session");

const ApiRoutes = require("./routes/api");
const AppRoutes = require("./routes/app");
const WebsiteRoutes = require("./routes/static");

const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    secure: false,
    saveUninitialized: true,
    maxAge: 8.64e7,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", WebsiteRoutes);
app.use("/app", AppRoutes);
app.use("/api", ApiRoutes);

process.on("SIGINT", () => {
  dbconn.close();
});

app.listen(80, () => {
  console.log(
    `Server started at port ${PORT}. Click to visit ${
      process.env.HOST_ADDR + ":" + process.env.PORT
    }`
  );
});
