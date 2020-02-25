/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const SamlStrategy = require('passport-saml').Strategy;
const getConfig = require('next/config').default;

module.exports = passport => {
    const {
        publicRuntimeConfig: { SAML_ENTRYPOINT, SAML_ISSUER, SAML_CERT }
    } = getConfig();

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
                console.log('Succesfully Profile', profile);

                if (!profile.email) {
                    return done(new Error('No email found'), null);
                }

                process.nextTick(() => {
                    console.log('process.nextTick', profile);
                    findByEmail(profile.email, (err, user) => {
                        if (err) {
                            return done(err);
                        }
                        if (!user) {
                            users.push(profile);
                            return done(null, profile);
                        }
                        console.log('Ending Method for profiling');
                        return done(null, user);
                    });
                });
                return done(null, null);
            }
        )
    );

    passport.protected = (req, res, next) => {
        console.log(req.isAuthenticated());

        if (req.isAuthenticated()) {
            return next();
        }

        return res.redirect('/redirect');
    };

    return passport;
};
