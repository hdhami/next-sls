/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const { PORT, NODE_ENV, OKTA_DOMAIN, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, APP_BASE_URL } = process.env;
const port = parseInt(PORT, 10) || 3000;
const dev = NODE_ENV !== 'production';
const app = next({ dev });
const routes = require('./routes');

const router = routes.getRequestHandler(app, props => {
    const { req, res, route, query } = props;
    app.render(req, res, route.page, query);
});

const oidc = new ExpressOIDC({
    issuer: `${OKTA_DOMAIN}/oauth2/default`,
    client_id: `${CLIENT_ID}`,
    client_secret: `${CLIENT_SECRET}`,
    redirect_uri: `${REDIRECT_URI}`,
    appBaseUrl: `${APP_BASE_URL}`,
    scope: 'openid profile'
});

app.prepare()
    .then(() => {
        express()
            .use(cookieParser())
            .use(
                session({
                    secret: 'this should be secure',
                    resave: true,
                    saveUninitialized: false
                })
            )
            .use(oidc.router)
            .use(router)
            .listen(port, err => {
                if (err) throw err;
                console.log(`> Ready on http://localhost:${port}`);
            });
    })
    .catch(ex => {
        console.log(ex.stack);
        process.exit(1);
    });
