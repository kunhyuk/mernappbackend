const express = require('express');
const { singup, login, verifyToken, getuser } = require('../controllers/userController');

const router = express.Router();

router.post("/signup", singup)
router.post("/login", login)
router.get("/user", verifyToken, getuser)
module.exports = router