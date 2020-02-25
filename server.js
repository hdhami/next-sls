/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { PORT, NODE_ENV } = process.env;
const port = parseInt(PORT, 10) || 3000;
const dev = NODE_ENV !== 'production';
const app = next({ dev });
const routes = require('./routes');
const ssoCallbackApi = require('./api/user/details');

const router = routes.getRequestHandler(app, props => {
    const { req, res, route, query } = props;
    app.render(req, res, route.page, query);
});

app.prepare()
    .then(() => {
        const server = express()
            .use(cors())
            .use(cookieParser())
            .use(ssoCallbackApi);

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
