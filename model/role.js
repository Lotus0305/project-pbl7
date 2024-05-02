const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['admin', 'customer'],
  },
  permissions: [String],
});

const Role = mongoose.model("Role", roleSchema);

async function initializeRoles() {
  const count = await Role.countDocuments();
  if (count === 0) {
    try {
      await Role.create({ name: 'admin', permissions: [
      'create:account', 'read:account', 'update:account', 'delete:account',
      'create:author', 'read:author', 'update:author', 'delete:author',
      'create:category', 'read:category', 'update:category', 'delete:category',
      'create:comic', 'read:comic', 'update:comic', 'delete:comic'] 
    });
      await Role.create({ name: 'customer', permissions: [
      'read:account', 'update:account',
      'read:author',
      'read:category',
      'read:comic']
    });
    } catch (error) {
      console.error("Failed to create roles", error);
    }
  }
}

initializeRoles();

module.exports = Role;