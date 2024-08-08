"use client";

import { AppEnvironments } from "@/lib/app-environments";
import { CognitoAPI } from "@/lib/auth/cognito-api";
import { setUserAccessTokenCookie } from "@/lib/cookies/cookie-utils";
import { useEffect } from "react";

interface Props {
    children: React.ReactNode;
}
export default function ConfigureAuthCognitoApi(props: Props) {
    const { children } = props;

    // Run once the component is mounted
    useEffect(() => {
        // Listen to cognito access token updates and store in cookie
        CognitoAPI.registerAccessTokenEventListener(setUserAccessTokenCookie);

        // initlize cognito api
        CognitoAPI.init({
            hostedUIBaseUrl: `https://${process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN}`,
            enableDebugging: process.env.NEXT_PUBLIC_APP_ENV !== AppEnvironments.production,
            enabledIdentityProviders: ["Google"],
            appClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string,
        });
    }, []);

    


    return children;
}