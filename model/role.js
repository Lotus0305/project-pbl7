const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    _id : mongoose.Schema.Types.String,
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["admin", "customer"],
    },
    permissions: [String],
  },
  { strict: true }
);

roleSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (!this._id) {
      const timestamp = Date.now().toString();
      const randomNum = Math.floor(Math.random() * 10000).toString();
      const id = timestamp + randomNum;
      this._id = "0" + id.toString();
    }
  }
  next();
});

const Role = mongoose.model("Role", roleSchema);

async function initializeRoles() {
  const count = await Role.countDocuments();
  if (count === 0) {
    try {
      await Role.create({
        name: "admin",
        permissions: [
          "create:account",
          "read:account",
          "update:account",
          "delete:account",
          "create:author",
          "read:author",
          "update:author",
          "delete:author",
          "create:category",
          "read:category",
          "update:category",
          "delete:category",
          "create:novel",
          "read:novel",
          "update:novel",
          "delete:novel",
        ],
      });
      await Role.create({
        name: "customer",
        permissions: [
          "read:account",
          "update:account",
          "read:author",
          "read:category",
          "read:novel",
        ],
      });
    } catch (error) {
      console.error("Failed to create roles", error);
    }
  }
}

initializeRoles();

module.exports = Role;
