const mongoose = require("mongoose");

// @desc Users of your org. Different from normal users. Has access to specific resources and routes, with further authorization depending on assigned Role
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["User"],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
