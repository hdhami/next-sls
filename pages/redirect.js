import React, { useEffect } from 'react';
import getConfig from 'next/config';

const {
    publicRuntimeConfig: { SSO_URL }
} = getConfig();

const Login = () => {
    useEffect(() => {
        window.location = SSO_URL;
    }, []);

    return (
        <div>
            <p>Welcome to Okta Login</p>
            <p>Redirecting to OKTA</p>
        </div>
    );
};

export default Login;
