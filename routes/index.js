const routes = require('next-routes');

module.exports = routes()
    .add('dasbhoard', '/', 'index')
    .add('sso', '/sso', 'redirect')
    .add('logout', '/logout', 'redirect');
