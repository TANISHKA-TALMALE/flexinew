const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { create, list, get, update, remove } = require('../controllers/cardController');

const router = express.Router();

router.use(protect);

router.post('/', create);
router.get('/', list);
router.get('/:id', get);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;