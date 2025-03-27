var express = require("express");
var router = express.Router();
const User = require("../models/user");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/all", (req, res) => {
  User.find()
    .select("infos")
    .then((data) => {
      if (data) {
        res.json({ result: true, ListUsers: data });
      } else {
        res.json({ result: false, Error: "Pas de données" });
      }
    });
});

// Route pour Signup
router.post("/signup", (req, res) => {
  // Destructuration du req.body
  const { email, password } = req.body;

  //Vérification si l'email n'est pas déjà enregistré
  User.findOne({ "authentification.email": email }).then((data) => {
    if (!data) {
      // Hashage du password et attribution d'un token
      const hash = bcrypt.hashSync(password, 10);
      const token = uid2(32);

      // Creation User
      const newUser = new User({
        authentification: {
          email: email,
          password: hash,
          token: token,
        },
        infos: {
          username: "Monster Trainer Junior",
          level: 1,
          rank: 1,
        },
        monsters: [],
      });

      //Sauvegarde de l'utilisateur avec résult
      newUser
        .save()
        .then((data) => {
          res.json({ result: true, newUser: data.authentification.token });
        })
        .catch((error) => {
          res.json({ result: false, info: String(error) });
        });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// Route de Signin (Vérification utilisateur)
router.post("/signin", (req, res) => {
  // Destructuration du req.body
  const { email, password } = req.body;

  // Recherche par email
  User.findOne({ "authentification.email": email }).then((data) => {
    if (data && bcrypt.compareSync(password, data.authentification.password)) {
      res.json({ result: true, userToken: data.authentification.token });
    } else if (data) {
      res.json({ result: false, info: "Authentification failed" });
    } else {
      res.json({ result: false, info: "User doesn't exist" });
    }
  });
});

// Route mise à jour Username
router.post("/update/:token", (req, res) => {
  const username = req.body.username;
  const token = req.params.token;

  User.updateOne(
    { "authentification.token": token },
    { "infos.username": username }
  ).then((data) => {
    if (data) {
      res.json({ result: true, message: "Username updated : " + username });
    } else {
      res.json({ result: false, message: "User not found" });
    }
  });
});

// Route mise à jour Level
router.post("/update/level/:token", (req, res) => {
  const token = req.params.token;

  User.updateOne(
    { "authentification.token": token },
    { $inc: { "infos.level": 1 } }
  ).then((data) => {
    if (data) {
      res.json({ result: true, message: "User level up!" });
    } else {
      res.json({ result: false, message: "User not found" });
    }
  });
});

module.exports = router;
