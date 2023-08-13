const User = require("../models/User");
const Note = require("../models/Note");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // return all data but the password from the model.
  // lean() in order to not attach extra methods (eg. save()) to the returned data.
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { username, password, email, roles } = req.body;

  // Confirm data. Will not require the roles since they are being required on the frontend in the /dash routes
  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate
  const duplicateUsername = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 }) // strength: 2 for example checks for case insensitivity as well during the duplicate check.
    .lean()
    .exec(); // exec() - returning a promise

    const duplicateEmail = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicateUsername) {
    return res.status(409).json({ message: "That username already exists" }); // conflict status
  }

  if (duplicateEmail) {
    return res.status(409).json({ message: "That email already exists" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  // Roles aren't being required, but can still check if roles are present
  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPwd, email }
      : { username, password: hashedPwd, email, roles };

  // create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, roles, active, password, email } = req.body;

  // confirm data
  if (
    !id ||
    !username ||
    !email ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec(); // no lean() - need the save() method from mongoose

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicateUsername = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

    const duplicateEmail = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow updates to the original user by not including the user that is currently being worked with for the duplicate state
  if (duplicateUsername && duplicateUsername._id.toString() !== id) {
    console.log("RACHED")
    // Confirmed to be a duplicate
    return res.status(409).json({ message: "That username already exists" });
  }

  if (duplicateEmail && duplicateEmail._id.toString() !== id) {
    // Confirmed to be a duplicate
    return res.status(409).json({ message: "That email already exists" });
  }

  user.username = username;
  user.email = email;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Do not delete user if they have notes
  const note = await Note.findOne({ user: id }).lean().exec();

  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `User ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
