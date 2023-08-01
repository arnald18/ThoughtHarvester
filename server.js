const express = require("express");
const path = require("path");

const PORT = 3001;

const app = express();
// Middleware for json and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//  START THE SERVER
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
