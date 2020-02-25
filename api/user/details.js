const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');

const router = express.Router();

router.use(bodyParser.json());
router.use(passport.initialize());
router.use(passport.session());
const auth = require('../../auth')(passport);

router.post(
    '/api/user/details',
    auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    (req, res) => {
        res.redirect('/');
    }
);

module.exports = router;
