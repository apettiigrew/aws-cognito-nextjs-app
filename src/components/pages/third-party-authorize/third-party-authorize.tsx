"use client";

import { getQueryRecordFromUrl } from "@/hooks/use-window-query";
import { AppEnvironments } from "@/lib/app-environments";
import { clearThirdPartyAuthorizeRedirectData, CognitoAuthorizeCodeForTokenSuccessResponse, getThirdPartyAuthorizeRedirectData, SocialIdentityProviderCodes } from "@/lib/auth/amplify-cognito-config";
import { CognitoIdpTokenExchangeResponse, CognitoIdpUserInfoResponse } from "@/lib/auth/cognito-api";
import { isValidUrl } from "@/lib/utils/url-utils";
import { CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, ICognitoUserSessionData } from "amazon-cognito-identity-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PageQuery = {
    code: string,
    state: string,
}

export function ThirdPartyAuthorizePage() {
    const router = useRouter();

    if (typeof window === "undefined")
        throw new Error("This component should never be server-rendered!");

    useEffect(() => {
        const handler = new ThirdPartyAuthorizationHandler({ router: router });
        handler.handle();
    }, [router]);

    return null;
}

type ConstructorArgs = {
    router: AppRouterInstance,
}

/** aptprd = Third Party Redirect Data */
export const thirdPartyAuthorizeDataStorageKey = "aptprd";

export type ThirdPartyAuthorizeRedirectData = {
    successRedirectUrl: string,
    errorRedirectUrl: string,
    socialIdpCode: SocialIdentityProviderCodes,
}


class ThirdPartyAuthorizationHandler {
    private _router: AppRouterInstance;
    private _redirectData!: ThirdPartyAuthorizeRedirectData;
    private _tokenSuccessData: CognitoAuthorizeCodeForTokenSuccessResponse | null = null;

    constructor(args: ConstructorArgs) {
        this._router = args.router;

        const redirectData = getThirdPartyAuthorizeRedirectData();

        if (redirectData === null) {
            console.error("No redirect data set!!");
            args.router.push("/");
            return;
        }

        this._redirectData = redirectData;

        // Clear redirect data from session storage
        if (process.env.NEXT_PUBLIC_APP_ENV === AppEnvironments.production)
            clearThirdPartyAuthorizeRedirectData();

        // Bindings
        this.handle = this.handle.bind(this);
        this.successRedirect = this.successRedirect.bind(this);
        this.errorRedirect = this.errorRedirect.bind(this);
        this.onGetUserInfo = this.onGetUserInfo.bind(this);
        this.onIdpTokenExchangeResponse = this.onIdpTokenExchangeResponse.bind(this);
    }

    async handle() {
        const windowQuery = getQueryRecordFromUrl<PageQuery>();

        // First check our base url is actually set...
        if (!isValidUrl(process.env.NEXT_PUBLIC_BASE_APP_URL)) {
            console.error("Invalid NEXT_PUBLIC_APP_BASEURL in env! Please make sure it is valid.");
            this.errorRedirect();
            return;
        }

        if (typeof process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID !== "string") {
            console.error("Invalid NEXT_PUBLIC_COGNITO_APP_CLIENT_ID in env! Please make sure it is valid.");
            this.errorRedirect();
        }

        if (typeof process.env.NEXT_PUBLIC_OAUTH_DOMAIN_H !== "string") {
            console.error("Invalid NEXT_PUBLIC_COGNITO_HOSTED_UI_BASE_URL in env! Please make sure it is valid.");
            this.errorRedirect();
        }

        // Get code from search params
        const code = windowQuery.code;
        if (typeof code !== "string") {
            // No code -> not a valid redirect -> redirect to login with error
            this.errorRedirect();
            return;
        }

        // Get state variable to build code verifier session key
        const state = windowQuery.state;
        if (state === null) {
            // No state -> not a valid redirect -> redirect to login with error
            this.errorRedirect();
            return;
        }
        const requestBody = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
            code: code,
            redirect_uri: `${origin}/api/auth/callback`
        })

        // Get tokens
        const res = await fetch(`${process.env.NEXT_PUBLIC_OAUTH_DOMAIN_H}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': authorizationHeader
            },
            body: requestBody
        })

        const data = await res.json()
        console.log(data)

        // if (!res.ok) {
        // 	throw new Error(data.error_description)
        // }

    }

    private successRedirect() {
        // window.location.replace(this._redirectData.successRedirectUrl);
        this._router.replace(this._redirectData.successRedirectUrl);
    }

    /** Redirects to provided error url or sign-in in case it wasn't provided via url query */
    private errorRedirect() {
        // window.location.replace(this._redirectData.errorRedirectUrl);
        this._router.replace(this._redirectData.errorRedirectUrl);
    }

    private async onGetUserInfo(response: CognitoIdpUserInfoResponse) {
        // Debugging
        // console.log("res:", response);

        if ("error" in response) {
            this.errorRedirect();
        } else {
            // Get "sub" (aka username) from /oauth2/userInfo response
            const userName = response["sub"];

            // Build session from /oauth2/token response
            const data = this._tokenSuccessData as CognitoAuthorizeCodeForTokenSuccessResponse;
            const sessionData: ICognitoUserSessionData = {
                IdToken: new CognitoIdToken({ IdToken: data.id_token }),
                AccessToken: new CognitoAccessToken({ AccessToken: data.access_token }),
                RefreshToken: new CognitoRefreshToken({ RefreshToken: data.refresh_token }),
            };

            // Set current browser sign in session with received data
            // CognitoAPI.idpSignInUser(
            // 	userName,
            // 	sessionData,
            // 	response,
            // );

            // Redirect to success page
            this.successRedirect();
        }
    }

    private onIdpTokenExchangeResponse(res: CognitoIdpTokenExchangeResponse) {
        // Debugging
        // console.log(res);

        if (res.success) {
            this._tokenSuccessData = res.responseData;
            // CognitoAPI.idpGetUserInfo({
            // 	accessToken: res.responseData.access_token,
            // 	hostedUIBaseUrl: process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI_BASE_URL,
            // }, this.onGetUserInfo);
        } else {
            this.errorRedirect();
        }
    }
}
