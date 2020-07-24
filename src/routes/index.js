const { Router } = require("express");
const router = Router();

const User = require("../models/User");
const Tutorial = require("../models/Tutorial");

//const tutorials = require("../controllers/tutorialcontroller/tutorialcontroller.js");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => res.send("hello world"));

// Create a new Tutorial
router.post("/tuto", (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
});

router.get("/tutos", (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Tutorial.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});

router.get("/published", (req, res) => {
  Tutorial.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});

// Retrieve a single Tutorial with id
router.get("/tuto/:id", (req, res) => {
  {
    const id = req.params.id;

    Tutorial.findById(id)
      .then((data) => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + id });
        else res.send(data);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + id });
      });
  }
});

// Update a Tutorial with id
router.put("/tuto/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
});

router.delete("/tuto/:id",(req, res) =>{
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
});

/*
// Delete a Tutorial with id

// Create a new Tutorial
router.delete("/tutos", tutorials.deleteAll);
*/

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  //  Es lo mismo que escribir email:email
  const newUser = new User({ email, password });
  await newUser.save();

  const token = jwt.sign(
    {
      _id: newUser._id,
    },
    "secretKey"
  );

  res.status(200).json({ token });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(401).send("The email doesn't exist");
  if (user.password !== password) return res.status(401).send("wrond password");

  const token = jwt.sign({ _id: user._id }, "secretKey");

  res.status(200).json({ token });
});

router.get("/tasks", (req, res) => {
  res.json([
    {
      _id: 1,
      name: "taskOne",
      description: "lrem",
      date: "2020-07-23T18:11:09.229Z",
    },
    {
      _id: 2,
      name: "taskOne",
      description: "lrem",
      date: "2020-07-23T18:11:09.229Z",
    },
    {
      _id: 3,
      name: "taskOne",
      description: "lrem",
      date: "2020-07-23T18:11:09.229Z",
    },
  ]);
});

router.get("/private-tasks", verifyToken, (req, res) => {
  res.json([
    {
      _id: "1",
      name: "task one",
      description: "asdadasd",
      date: "2019-11-06T15:50:18.921Z",
    },
    {
      _id: "2",
      name: "task two",
      description: "asdadasd",
      date: "2019-11-06T15:50:18.921Z",
    },
    {
      _id: "3",
      name: "task three",
      description: "asdadasd",
      date: "2019-11-06T15:50:18.921Z",
    },
  ]);
});

router.get("/profile", verifyToken, (req, res) => {
  res.send(req.userId);
});
module.exports = router;

async function verifyToken(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send("Unauhtorized Request");
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === "null") {
      return res.status(401).send("Unauhtorized Request");
    }

    const payload = await jwt.verify(token, "secretKey");
    if (!payload) {
      body - parser;
      return res.status(401).send("Unauhtorized Request");
    }
    req.userId = payload._id;
    next();
  } catch (e) {
    //console.log(e)
    return res.status(401).send("Unauhtorized Request");
  }
}
