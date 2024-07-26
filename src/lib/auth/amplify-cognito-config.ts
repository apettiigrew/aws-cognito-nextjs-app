"use client";

import { Amplify, type ResourcesConfig } from "aws-amplify";


export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
    loginWith: {
      oauth: {
        domain: String(process.env.NEXT_PUBLIC_OAUTH_DOMAIN),
        // Ensure the scope matches the one in the Cognito User Pool
        scopes: ["openid", "phone", "email", "aws.cognito.signin.user.admin"],
        redirectSignIn: [
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        ],
        redirectSignOut: [
          `${process.env.NEXT_PUBLIC_APP_URL}/login`,
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
