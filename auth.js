/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const SamlStrategy = require('passport-saml').Strategy;

module.exports = passport => {
    const { SAML_ENTRYPOINT, SAML_ISSUER, SAML_CERT } = process.env;

    const users = [];

    function findByEmail(email, fn) {
        for (let i = 0, len = users.length; i < len; i += 1) {
            const user = users[i];
            if (user.email === email) {
                return fn(null, user);
            }
        }
        return fn(null, null);
    }

    // Passport session setup.
    // To support persistent login sessions, Passport needs to be able to
    // serialize users into and deserialize users out of the session.  Typically,
    // this will be as simple as storing the user ID when serializing, and finding
    // the user by ID when deserializing.
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((id, done) => {
        findByEmail(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(
        new SamlStrategy(
            {
                issuer: SAML_ISSUER,
                path: '/api/user/details',
                entryPoint: SAML_ENTRYPOINT,
                cert: SAML_CERT
            },
            (profile, done) => {
                if (!profile.email) {
                    return done(new Error('No email found'), null);
                }

                return done(null, profile);
            }
        )
    );

    passport.protected = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }

        return res.redirect('/redirect');
    };

    return passport;
};
