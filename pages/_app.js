/* eslint-disable no-console */
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

NextSLS.getInitialProps = async appCtx => {
    // appCtx.ctx.res.redirect(SSO_URL);
    console.log('===SSO_URL=====', SSO_URL);
    console.log('=======cookie===========', appCtx.ctx.req.cookies);
    return {};
};

export default NextSLS;
