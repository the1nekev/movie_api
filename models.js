const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Holds required info to add a movie to db
 * @param {string} Title - movie title
 * @param {string} Description - movie description
 * @param {Object} Genre - has name and description
 * @param {Object} Director - Name, Bio, Birthday(Date), Death(Date)
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birthday: Date,
    Death: Date,
  },
  //Take Actors out for now
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

/**
 * Holds required info for creating users
 * @param {string} Username
 * @param {string} Password
 * @param {string} Email
 * @param {Date} Birthday
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

//Creation of Models
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

//Model Exports
module.exports.Movie = Movie;
module.exports.User = User;
