const mongoose = require("mongoose");

const monsterSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Clé étrangère vers l'utilisateur
  name: { type: String, required: true },
  species: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Date d’adoption

  // États du monstre
  energy: { type: Number, default: 100, min: 0, max: 100 }, // Vie
  hunger: { type: Number, default: 0, min: 0, max: 100 }, // 0 = repu, 100 = affamé
  mood: { type: Number, default: 100, min: 0, max: 100 }, // 0 = triste, 100 = heureux
  hygiene: { type: Number, default: 100, min: 0, max: 100 }, // 0 = sale, 100 = propre
  health: { type: Number, default: 100, min: 0, max: 100 }, // 0 = malade, 100 = en pleine forme
  sociability: { type: Number, default: 100, min: 0, max: 100 }, // 0 = solitaire, 100 = sociable
  sleep: { type: Number, default: 100, min: 0, max: 100 }, // 0 = épuisé, 100 = bien reposé
  attachment: { type: Number, default: 50, min: 0, max: 100 }, // 0 = indifférent, 100 = très attaché

  lastFed: { type: Date, default: Date.now }, // Pour gérer la faim
  lastPlayed: { type: Date, default: Date.now }, // Pour gérer l’humeur
  lastWashed: { type: Date, default: Date.now }, // Pour gérer l’hygiène
  lastSlept: { type: Date, default: Date.now }, // Pour gérer le sommeil
});

module.exports = mongoose.model("Monster", monsterSchema);
