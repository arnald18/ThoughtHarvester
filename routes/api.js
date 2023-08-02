const router = require("express").Router();

const { join } = require("path");
const { readFile, writeFile } = require("fs/promises");

// GET THE PATH OF THE DATABASE
const databasePath = join(__dirname, "..", "db/db.json");

async function readDatabase() {
  return readFile(databasePath).then((data) => {
    return JSON.parse(data);
  });
}

async function addToDatabase(newNote) {
  return readDatabase().then(async (notes) => {
    let newNotes = notes;
    newNotes.push(newNotes);
    return writeFile(databasePath, JSON.stringify(newNotes)).then(() => {
      console.log("Add to File");
    });
  });
}

router.get("/notes", (req, res) => {
  console.info("Get request received");
  readDatabase()
    .then((notes) => {
      console.info("Success, sending notes");
      return res.status(200).json(notes);
    })
    .catch((err) => {
      console.info("Failure, sending error");
      return res.status(500).json(err);
    });
});

module.exports = router;
