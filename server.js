const express = require("express");
const ApiRoutes = require("./routes/api");
const app = express();

app.set(express.static("public"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.end("Everything is working correctly");
});

app.use("/api", ApiRoutes);

app.listen(80, () => {
  console.log("Server started at port 80. Click to visit http://localhost");
});
