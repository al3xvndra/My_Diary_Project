const bcrypt = require("bcrypt");

const hash = bcrypt.hashSync("difficultPasswordToGuess124", 10);

console.log(hash);
