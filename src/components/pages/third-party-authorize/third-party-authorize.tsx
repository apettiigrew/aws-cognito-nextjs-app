"use client";

import { getQueryRecordFromUrl } from "@/hooks/use-window-query";
import { AppEnvironments } from "@/lib/app-environments";
import { clearThirdPartyAuthorizeRedirectData, CognitoAPI, getThirdPartyAuthorizeRedirectData } from "@/lib/auth/cognito-api";
import { CognitoAuthorizeCodeForTokenSuccessResponse, CognitoIdpTokenExchangeResponse, CognitoIdpUserInfoResponse } from "@/lib/auth/cognito-api-types";
import { SocialIdentityProviderCodes } from "@/lib/auth/social-identity";
import { getSessionStorageValue } from "@/lib/utils/storage-utils";
import { isValidUrl } from "@/lib/utils/url-utils";
import { CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, ICognitoUserSessionData } from "amazon-cognito-identity-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PageQuery = {
    code: string,
    state: string,
}

export function ThirdPartyAuthorizePage() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handler = new ThirdPartyAuthorizationHandler({ router: router });
            handler.handle();
        }
    }, [router]);

    return null;
}

type ConstructorArgs = {
    router: AppRouterInstance,
}

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
        // console.log("Redirect data:", this._redirectData);

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

        // Has to be exact same that was sent to the authorize request!
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_APP_URL}/third-party-authorize/`;

        const codeVerifierKey = `codeVerifier-${state}`;
        const codeVerifier = getSessionStorageValue(codeVerifierKey);
        if (codeVerifier === null) {
            // If code verifier key was not found in session storage
            // -> invalid redirect -> redirect to error page
            this.errorRedirect();
            return;
        }
        // console.log("Code verifier:", codeVerifier);
        // console.log("Code:", code);
        // console.log("Redirect URI:", redirectUri);
        // console.log("Client ID:", process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID);
        // console.log("Hosted UI Base URL:", process.env.NEXT_PUBLIC_OAUTH_DOMAIN_H);

        // Send the actual request
        CognitoAPI.requestIdpOauthToken({
            hostedUIBaseUrl: `${process.env.NEXT_PUBLIC_OAUTH_DOMAIN_H}`,
            clientId: `${process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID}`,
            redirectUri: redirectUri,
            code: code,
            codeVerifier: codeVerifier,
        }, this.onIdpTokenExchangeResponse);
    }

    private successRedirect() {
        this._router.replace(this._redirectData.successRedirectUrl);
    }

    /** Redirects to provided error url or sign-in in case it wasn't provided via url query */
    private errorRedirect() {
        // window.location.replace(this._redirectData.errorRedirectUrl);
        this._router.replace(this._redirectData.errorRedirectUrl);
    }

    private async onGetUserInfo(response: CognitoIdpUserInfoResponse) {
        if ("error" in response) {
            this.errorRedirect();
        } else {
            // console.log(`response: ${JSON.stringify(response)}`);
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
            CognitoAPI.idpSignInUser(
                userName,
                sessionData,
                response,
            );

            console.log("Redirect to success page");
            // Redirect to success page
            this.successRedirect();
        }
    }

    private onIdpTokenExchangeResponse(res: CognitoIdpTokenExchangeResponse) {

        if (res.success) {
            this._tokenSuccessData = res.responseData;
            CognitoAPI.idpGetUserInfo({
                accessToken: res.responseData.access_token,
                hostedUIBaseUrl: `${process.env.NEXT_PUBLIC_OAUTH_DOMAIN_H}`,
            }, this.onGetUserInfo);
        } else {
            this.errorRedirect();
        }
    }
}
