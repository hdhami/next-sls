require('dotenv').config();

module.exports = {
    webpack: (config, { isServer }) => {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
            // eslint-disable-next-line no-param-reassign
            config.node = {
                fs: 'empty'
            };
        }

        return config;
    },
    publicRuntimeConfig: {
        SSO_URL: process.env.SSO_URL,
        SAML_ISSUER: process.env.SAML_ISSUER,
        SAML_CERT: process.env.SAML_CERT.replace(/\\n/g, '\n'),
        SAML_PROTOCOL: process.env.SAML_PROTOCOL,
        SAML_ENTRYPOINT: process.env.SAML_ENTRYPOINT,
        PORT: process.env.PORT,
        APP_BASE_URL: process.env.APP_BASE_URL
    }
};
