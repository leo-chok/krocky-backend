const mongoose = require("mongoose");
const usersSchema = mongoose.Schema({
  authentification: {
    email: String,
    password: String,
    token: String,
  },
  infos: {
    username: String,
    level: Number,
    rank: String,
  },
  monsters: [String],
});
const User = mongoose.model("User", usersSchema);
module.exports = User;
