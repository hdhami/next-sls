import React from 'react';
import App from 'next/app';

class NextSLS extends App {
    render() {
        const { Component, pageProps } = this.props;

        return <Component pageProps={pageProps} />;
    }
}

// eslint-disable-next-line no-unused-vars
NextSLS.getInitialProps = async appCtx => {
    // const isAuthenticatedUser = false;
    // const {
    //     ctx: { res: redirect }
    // } = appCtx;
    // console.log('redirect=====>');
    return {};
};

export default NextSLS;
