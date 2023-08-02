const express = require("express");

const html = require("./routes/html");
const api = require("./routes/api");
const PORT = 3001;
// CREATE SERVER
const app = express();
// Middleware for json and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/", html);
app.use("/api", api);
//  START THE SERVER
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
