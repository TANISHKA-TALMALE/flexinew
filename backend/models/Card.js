const mongoose = require('mongoose');
const Datastore = require('nedb-promises');
const path = require('path');
const fs = require('fs');

const useMongo = !!process.env.MONGODB_URI;

if (useMongo) {
  const cardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    title: { type: String, required: true },
    fields: { type: Object, required: true },
    style: { type: Object },
    logoDataUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  cardSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
  });

  const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);

  async function createCard({ userId, title, fields, style, logoDataUrl }) {
    const doc = await Card.create({ userId, title, fields, style, logoDataUrl });
    return doc.toObject();
  }

  async function listCardsByUser(userId) {
    return Card.find({ userId }).sort({ updatedAt: -1 }).lean();
  }

  async function findById(id) {
    return Card.findById(id).lean();
  }

  async function updateCard(id, updates) {
    updates.updatedAt = new Date();
    const doc = await Card.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    return doc;
  }

  async function deleteCard(id) {
    await Card.findByIdAndDelete(id);
    return { success: true };
  }

  module.exports = {
    createCard,
    listCardsByUser,
    findById,
    updateCard,
    deleteCard,
    Card,
  };
} else {
  const dataDir = path.join(__dirname, '..', 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const cards = Datastore.create({ filename: path.join(dataDir, 'cards.db'), autoload: true });

  async function createCard({ userId, title, fields, style, logoDataUrl }) {
    const doc = await cards.insert({ userId, title, fields, style, logoDataUrl, createdAt: new Date(), updatedAt: new Date() });
    return doc;
  }

  async function listCardsByUser(userId) {
    return cards.find({ userId }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async function findById(id) {
    return cards.findOne({ _id: id });
  }

  async function updateCard(id, updates) {
    updates.updatedAt = new Date();
    await cards.update({ _id: id }, { $set: updates });
    return findById(id);
  }

  async function deleteCard(id) {
    await cards.remove({ _id: id }, {});
    return { success: true };
  }

  module.exports = {
    createCard,
    listCardsByUser,
    findById,
    updateCard,
    deleteCard,
  };
}