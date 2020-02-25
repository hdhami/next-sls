import React from 'react';
import App from 'next/app';
import getConfig from 'next/config';

const {
    publicRuntimeConfig: { SSO_URL }
} = getConfig();
class NextSLS extends App {
    render() {
        const { Component, pageProps } = this.props;

        return <Component pageProps={pageProps} />;
    }
}

// eslint-disable-next-line no-unused-vars
NextSLS.getInitialProps = async appCtx => {
    appCtx.ctx.res.redirect(SSO_URL);
    return {};
};

export default NextSLS;
