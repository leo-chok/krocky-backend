const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://admin:702RuSsDniWVQh6K@cluster0.9owmt.mongodb.net/tamagotchi";
mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
