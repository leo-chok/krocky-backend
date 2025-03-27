import connection from '../models/connection'
import Monster from "../../models/monster";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  await connection(); // Connexion à MongoDB

  try {
    console.log("Mise à jour des monstres...");
    const monsters = await Monster.find();
    const now = new Date();

    for (let monster of monsters) {
      const hoursElapsed = (now - monster.lastFed) / (1000 * 60 * 60);

      monster.hunger = Math.min(100, monster.hunger + hoursElapsed * 5);
      monster.energy = Math.max(0, monster.energy - hoursElapsed * 3);
      monster.mood = Math.max(0, monster.mood - hoursElapsed * 2);
      monster.sociability = Math.max(0, monster.sociability - hoursElapsed * 1);

      await monster.save();
    }

    console.log("Mise à jour terminée !");
    res.status(200).json({ message: "Cron job exécuté avec succès !" });
  } catch (error) {
    console.error("Erreur dans le cron job :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
