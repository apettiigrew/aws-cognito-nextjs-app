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
    userPoolId: String(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID),
    loginWith: {
      oauth: {
        // This should not include any protocol just the domain name.
        domain: String(process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN),
        // Ensure the scope matches the one in the Cognito User Pool
        scopes: scopes,
        redirectSignIn: [
          `${process.env.NEXT_PUBLIC_APP_BASEURL}/dashboard/`,
        ],
        redirectSignOut: [
          `${process.env.NEXT_PUBLIC_APP_BASEURL}/login/`,
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
  // enable cookies for state storage
  { ssr: true }
);

// Ensure to call this compnent early in the applicaiton.
export default function AmplifyCognitoConfig() {
  // This component require no ui elements.
  return null;
}



