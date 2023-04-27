const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
const { dbconn } = require("./utils/dbconnect");

const express = require("express");
const session = require("express-session");

const ApiRoutes = require("./routes/api");
const app = express();
app.set(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.end("Everything is working correctly");
});

app.use("/api", ApiRoutes);

process.on("SIGINT", () => {
  dbconn.close();
});

app.listen(80, () => {
  console.log("Server started at port 80. Click to visit http://localhost");
});
