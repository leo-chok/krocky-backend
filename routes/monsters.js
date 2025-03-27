const express = require("express");
const router = express.Router();
const Monster = require("../models/monster");
const User = require("../models/user")

// Route pour créer un monstre (adoption)
router.post("/adopt", async (req, res) => {
  try {
    const { userId, name, species } = req.body;

    if (!userId || !name || !species) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Vérifie si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const newMonster = new Monster({
      owner: userId,
      name,
      species,
    });

    await newMonster.save();

     // Ajoute l'ID du monstre à la liste des monstres de l'utilisateur
    user.monsters.push(newMonster._id);
    await user.save();

    res.status(201).json({ message: "Monstre adopté avec succès !", monster: newMonster });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Route pour nourrir un monstre
router.post("/:id/feed", async (req, res) => {
  try {
    const monster = await Monster.findById(req.params.id);
    if (!monster)
      return res.status(404).json({ message: "Monstre introuvable" });

    monster.hunger = Math.max(0, monster.hunger - 20); // Réduit la faim
    monster.lastFed = new Date();
    await monster.save();

    res.json({ message: `${monster.name} a été nourri ! 🍎`, monster });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Route pour laver un monstre
router.post("/:id/clean", async (req, res) => {
  try {
    const monster = await Monster.findById(req.params.id);
    if (!monster)
      return res.status(404).json({ message: "Monstre introuvable" });

    monster.hygiene = Math.min(100, monster.hygiene + 30); // Augmente l'hygiène
    await monster.save();

    res.json({ message: `${monster.name} est tout propre ! 🛁`, monster });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Route pour offrir un cadeau à un monstre
router.post("/:id/gift", async (req, res) => {
  try {
    const monster = await Monster.findById(req.params.id);
    if (!monster)
      return res.status(404).json({ message: "Monstre introuvable" });

    monster.mood = Math.min(100, monster.mood + 20); // Améliore l'humeur
    monster.attachment = Math.min(100, monster.attachment + 10); // Renforce l'attachement
    await monster.save();

    res.json({ message: `${monster.name} adore son cadeau ! 🎁`, monster });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
