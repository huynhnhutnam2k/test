const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
    },
  },
  {
    timestamps: true,
    collection: "User",
  }
);

const collaboratorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
});

module.exports = {
  user: mongoose.model("Users", userSchema),
  collaborator: mongoose.model("Collaborators", collaboratorSchema),
};

// module.exports = mongoose.model('Users', userSchema)
