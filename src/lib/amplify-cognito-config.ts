"use client";

import { Amplify, type ResourcesConfig } from "aws-amplify";

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
    loginWith: {
      oauth:{
        domain: String(process.env.NEXT_PUBLIC_OAUTH_DOMAIN),
        scopes: ["email", "openid", "profile", "phone"],
        redirectSignIn: [
          "http://localhost:3000/dashboard",
        ],
        redirectSignOut: [
          "http://localhost:3000/login",
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
