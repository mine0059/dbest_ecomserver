const express = require('express');
const router = express.Router();

const { getUsers, getUserById, updateUser } = require('../controllers/users.controller');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

module.exports = router;