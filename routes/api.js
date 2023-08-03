const router = require("express").Router();

const { join } = require("path");
const { readFile, writeFile } = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

// GET THE PATH OF THE DATABASE
const databasePath = join(__dirname, "..", "db/db.json");

async function readDatabase() {
  return readFile(databasePath).then((data) => {
    return JSON.parse(data);
  });
}
// Save a note to the database
async function addToDatabase(newNote) {
  return readDatabase().then(async (notes) => {
    let newNotes = notes;
    newNotes.push(newNote);
    return writeFile(databasePath, JSON.stringify(newNotes)).then(() => {
      console.log("Add to File");
    });
  });
}
// Get all the notes
router.get("/notes", (req, res) => {
  console.info("Get request received");

  readDatabase()
    .then((notes) => {
      console.info("Success, sending notes");
      if (notes.length === 0) {
        return res.status(200).json([]);
      }
      return res.status(200).json(notes);
    })
    .catch((err) => {
      console.info("Failure, sending error");
      return res.status(500).json(err);
    });
});

router.post("/notes", (req, res) => {
  const { title, text } = req.body;
  if (!(title && text)) {
    console.info("Failure, title and text requirements");
    return res.status(400);
  }

  const newNote = {
    title,
    text,
    id: uuidv4(),
  };

  addToDatabase(newNote)
    .then(() => {
      console.info("Success, added note to database");
      return res.status(201);
    })
    .catch((err) => {
      console.info("Failure, could not save new note");
      return res.status(500).json(err);
    });
});

router.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    console.info("Failure, missing id param");
    return res.status(400);
  }
  //

  readDatabase().then((notes) => {
    // IF THE NOTE DOES NOT EXIST RETURN WITH AN ERROR STATUS
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) {
      return res.status(500).json("Note does not exist");
    }

    const newNotes = notes.length === 1 ? [] : notes.splice(index, 1);

    writeFile(databasePath, JSON.stringify(newNotes))
      .then(() => {
        console.info("Success, deleted note from the database");
        return res.status(201);
      })
      .catch((err) => {
        console.info("Failure, could not delete note");
        return res.status(500).json(err);
      });
  });
});

module.exports = router;

// jSON.stringify(newNotes);

// function stringify(obj) {
//   // turn obj into a string
//   // return string
// }
