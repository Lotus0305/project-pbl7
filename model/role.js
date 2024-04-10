const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [String],
});

const Role = mongoose.model("Role", roleSchema);

async function initializeRoles() {
  const count = await Role.countDocuments();
  if (count === 0) {
    try {
      await Role.create({ name: 'admin', permissions: [] });
      await Role.create({ name: 'user', permissions: [] });
    } catch (error) {
      console.error("Failed to create roles", error);
    }
  }
}

initializeRoles();

module.exports = Role;