"use client";

import { Amplify, type ResourcesConfig } from "aws-amplify";
import { scopes } from "./cognito-api";
/**
 * Amplify configuration for Cognito
 * 
 * Primarily used for the users that are logging with username and password
 * @read https://docs.amplify.aws/react/build-a-backend/auth/
 */
export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
    loginWith: {
      oauth: {
        domain: String(process.env.NEXT_PUBLIC_OAUTH_DOMAIN),
        // Ensure the scope matches the one in the Cognito User Pool
        scopes: scopes,
        redirectSignIn: [
          `${process.env.NEXT_PUBLIC_BASE_APP_URL}/dashboard/`,
        ],
        redirectSignOut: [
          `${process.env.NEXT_PUBLIC_BASE_APP_URL}/login/`,
        ],
        responseType: "code",
      }
    }
  },
};

Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true }
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
