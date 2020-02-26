/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors')({ origin: true });

const server = express();

server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({ extended: true }));

server.use(cors);
server.use(passport.initialize());
server.use(passport.session());

const auth = require('./auth')(passport);

server.post(
    '/api/user/details1',
    auth.authenticate('saml', { failureRedirect: '/authentication/failure', failureFlash: true }),
    (req, res) => {
        console.log('=============user profile=============', req.user);
        return res.redirect('/qwerty');
    }
);

server.listen(3000, err => {
    if (err) {
        throw new Error(err);
    }
    console.log(`Server running at https://localhost:${3000}`);
});
