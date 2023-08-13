const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // ref to the User model (A note is assigned to a user)
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// a seperate collection called "Counter" will be created with the ticket id.
if (!mongoose.models.Note) {
  noteSchema.plugin(AutoIncrement, {
    inc_field: "ticket",
    id: "ticketNums",
    start_seq: 500,
  });
}

module.exports = mongoose.models.Note || mongoose.model("Note", noteSchema);
