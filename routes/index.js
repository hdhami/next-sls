const routes = require('next-routes');

module.exports = routes()
    .add('dasbhoard', '/dashboard', 'index')
    .add('sso', '/sso', 'redirect')
    .add('logout', '/logout', 'redirect');
