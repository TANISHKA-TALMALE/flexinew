const mongoose = require('mongoose');
const Datastore = require('nedb-promises');
const path = require('path');
const fs = require('fs');

const useMongo = !!process.env.MONGODB_URI;

let User;

if (useMongo) {
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  User = mongoose.models.User || mongoose.model('User', userSchema);

  async function findByEmail(email) {
    return User.findOne({ email }).lean();
  }

  async function findById(id) {
    return User.findById(id).lean();
  }

  async function createUser({ name, email, passwordHash }) {
    const doc = await User.create({ name, email, passwordHash });
    return doc.toObject();
  }

  module.exports = { findByEmail, findById, createUser, User };
} else {
  const dataDir = path.join(__dirname, '..', 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const users = Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true });
  users.ensureIndex({ fieldName: 'email', unique: true }).catch(() => {});

  async function findByEmail(email) {
    return users.findOne({ email });
  }

  async function findById(id) {
    return users.findOne({ _id: id });
  }

  async function createUser({ name, email, passwordHash }) {
    const doc = await users.insert({ name, email, passwordHash, createdAt: new Date() });
    return doc; // already a plain object
  }

  module.exports = { findByEmail, findById, createUser };
}