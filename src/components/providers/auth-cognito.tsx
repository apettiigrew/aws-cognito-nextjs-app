"use client";

import { AppEnvironments } from "@/lib/app-environments";
import { CognitoAPI } from "@/lib/auth/cognito-api";
import { setUserAccessTokenCookie } from "@/lib/cookies/cookie-utils";

export default function ConfigureAuthCognitoApi() {
    // Listen to cognito access token updates and store in cookie
    CognitoAPI.registerAccessTokenEventListener(setUserAccessTokenCookie);

    // initlize cognito api
    CognitoAPI.init({
        hostedUIBaseUrl: `https://${process.env.NEXT_PUBLIC_OAUTH_DOMAIN}`,
        enableDebugging: process.env.NEXT_PUBLIC_APP_ENV !== AppEnvironments.production,
        enabledIdentityProviders: ["Google"],
        appClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    });

    return null;
}