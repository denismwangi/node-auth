const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/home', authController.isLoggedIn, (req, res) => {
    //console.log(req.name);
    if (req.user) {
      res.render("home", { user: req.user });
    } else {
      res.redirect("/login");
    }
});



module.exports = router;