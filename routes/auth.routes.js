const express = require('express');
const router = express.Router();
const {
  checkIfEmailAlreadyRegistered,
  signUp,
  logIn,
} = require('../controllers/auth.controller');

const upload = require('../middlewares/multer');

router.post('/signup', checkIfEmailAlreadyRegistered, signUp);
router.post('/login', logIn);

module.exports = router;