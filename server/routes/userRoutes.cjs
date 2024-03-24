const express = require('express');
const router = express.Router();
const routes = require('../controlers//userControler.cjs');

router.get('/', routes.getUser);
router.post('/login', routes.loginUser);
router.post('/sign_up', routes.signUp)

module.exports = router;