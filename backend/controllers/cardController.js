const { createCard, listCardsByUser, findById, updateCard, deleteCard } = require('../models/Card');

async function create(req, res) {
  try {
    const { title, fields, style, logoDataUrl } = req.body;
    if (!title || !fields) return res.status(400).json({ message: 'Title and fields required' });
    const card = await createCard({ userId: req.user.id, title, fields, style, logoDataUrl });
    return res.status(201).json(card);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function list(req, res) {
  try {
    const cards = await listCardsByUser(req.user.id);
    return res.json(cards);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function get(req, res) {
  try {
    const card = await findById(req.params.id);
    if (!card || card.userId !== req.user.id) return res.status(404).json({ message: 'Not found' });
    return res.json(card);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function update(req, res) {
  try {
    const existing = await findById(req.params.id);
    if (!existing || existing.userId !== req.user.id) return res.status(404).json({ message: 'Not found' });
    const card = await updateCard(req.params.id, req.body);
    return res.json(card);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function remove(req, res) {
  try {
    const existing = await findById(req.params.id);
    if (!existing || existing.userId !== req.user.id) return res.status(404).json({ message: 'Not found' });
    await deleteCard(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { create, list, get, update, remove };