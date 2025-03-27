const cron = require("node-cron");
const Monster = require("./models/monster");


// Tâche qui s'exécute toutes les heures (ex: réduire les stats des monstres)
cron.schedule("0 * * * *", async () => {
  console.log("Mise à jour des monstres...");
  try {
    const monsters = await Monster.find();
    const now = new Date();

    for (let monster of monsters) {
      // Calcul du temps écoulé depuis la dernière mise à jour
      const hoursElapsed = (now - monster.lastFed) / (1000 * 60 * 60); // En heures

      // Mise à jour des stats
      monster.hunger = Math.min(100, monster.hunger + hoursElapsed * 5); // Faim augmente
      monster.energy = Math.max(0, monster.energy - hoursElapsed * 3); // Énergie diminue
      monster.mood = Math.max(0, monster.mood - hoursElapsed * 2); // Humeur baisse
      monster.sociability = Math.max(0, monster.sociability - hoursElapsed * 1); // Devient plus solitaire

      await monster.save(); // Sauvegarde les modifications
    }

    console.log("Mise à jour terminée !");
  } catch (error) {
    console.error("Erreur dans le cron job :", error);
  }
});
