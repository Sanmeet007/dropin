const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
const { dbconn } = require("./utils/dbconnect");

const express = require("express");
const session = require("express-session");

const ApiRoutes = require("./routes/api");
const AppRoutes = require("./routes/app");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    maxAge: 8.64e7,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  let login = false;
  const action = req.query.action;
  if (action === "login") login = true;
  if (req.session.user) {
    return res.render("index", {
      user: req.session.user,
      login,
    });
  } else {
    return res.render("index", {
      user: null,
      login,
    });
  }
});

app.use("/app", AppRoutes);
app.use("/api", ApiRoutes);

process.on("SIGINT", () => {
  dbconn.close();
});

app.listen(80, () => {
  console.log("Server started at port 80. Click to visit http://localhost");
});
