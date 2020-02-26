/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const next = require('next');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

const server = express();
server.use(cors()).use(cookieParser());
const { PORT, NODE_ENV } = process.env;
const port = parseInt(PORT, 10) || 3000;
const dev = NODE_ENV !== 'production';
const app = next({ dev });
const routes = require('./routes');

const SESSION_SECRET = 'qwerty_qwerty';

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: SESSION_SECRET,
        cookie: {
            httpOnly: true
        }
    })
);
server.use(passport.initialize());
server.use(passport.session());

const auth = require('./auth')(passport);

const router = routes.getRequestHandler(app, props => {
    const { req, res, route, query } = props;
    app.render(req, res, route.page, query);
});

app.prepare()
    .then(() => {
        server.post(
            '/api/user/details',
            auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
            (req, res) => {
                console.log('=============user profile=============', req.user);
                // console.log('=====passport=====', req.session.passport);

                return res.redirect('/');
            }
        );

        server.get('/', auth.protected, (req, res) => res.redirect('/abcd'));

        server.get('*', router);

        server.listen(port, err => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${port}`);
        });
    })
    .catch(ex => {
        console.log(ex.stack);
        process.exit(1);
    });
