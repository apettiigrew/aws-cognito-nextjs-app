"use client";

import { ThirdPartyAuthorizeRedirectData } from "@/components/pages/third-party-authorize/third-party-authorize";
import { ICognitoUserSessionData } from "amazon-cognito-identity-js";
import { Amplify, type ResourcesConfig } from "aws-amplify";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue, setSessionStorageValue } from "../utils/storage-utils";
import { isValidUrl } from "../utils/url-utils";
import { AuhtorizeUrlBuildArguments, CognitoAuthorizeCodeForTokenErrorResponse, CognitoIdpTokenExchangeParams, CognitoIdpTokenExchangeResponse, CognitoIdpUserInfoResponse, GetUserInfoArgs } from "./cognito-api";

/** Allowed Social Identity Provider codes in Park API V1 */
export type SocialIdentityProviderCodes = "GOOGLE";


/**
 * Stores third party redirect data in session storage, because we can't attach it to the redirect url
 * @param successRedirectUrl The url to redirect to if third party authorize was successful
 * @param errorRedirectUrl THe url to redirect to if third party authorize was unsuccessful
 * @param preferredLocaleCode
 * @param signedUpDuring
 * @param socialIdpCode
 */
export function setThirdPartyAuthorizeRedirectData(
  successRedirectUrl: URL,
  errorRedirectUrl: URL,
  socialIdpCode: SocialIdentityProviderCodes,
): boolean {
  const data: ThirdPartyAuthorizeRedirectData = {
    successRedirectUrl: successRedirectUrl.toString(),
    errorRedirectUrl: errorRedirectUrl.toString(),
    socialIdpCode: socialIdpCode,
  };

  const json = JSON.stringify(data);
  return setLocalStorageValue(thirdPartyAuthorizeDataStorageKey, json);
}

export function clearThirdPartyAuthorizeRedirectData() {
  removeLocalStorageValue(thirdPartyAuthorizeDataStorageKey);
}

/** ptprd = The Park Third Party Redirect Data */
export const thirdPartyAuthorizeDataStorageKey = "tptprd";
/** Retrieves stored session data for third party auth redirect urls, because we can't attach it to the redirect url query, because not allowed by Cognito... */
export function getThirdPartyAuthorizeRedirectData() {
  const json = getLocalStorageValue(thirdPartyAuthorizeDataStorageKey);
  if (json === null)
    return null;

  const obj = JSON.parse(json) as ThirdPartyAuthorizeRedirectData;
  return obj;
}

/** See "identity_provider" request param of https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html#get-authorize-request-parameters */
export type COGNITO_IDENTITY_PROVIDERS = "Facebook" | "Google" | "LoginWithAmazon" | "SignInWithApple" | "COGNITO";

// #region API RESPONSE MODELS
/** https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html#post-token-positive-exchanging-authorization-code-for-tokens */
export type CognitoAuthorizeCodeForTokenSuccessResponse = {
  access_token: string,
  id_token: string,
  refresh_token: string,
  /** How to usen token in subsequent requests */
  token_type: "Bearer",
  /** Time till expiration in seconds. Example 3600 for 1 hour. */
  expires_in: 3600,
}


type BuildIdpSignInUrlArgs = {
  /** E.g. "Google" */
  provider: COGNITO_IDENTITY_PROVIDERS,
  /** The uri to redirect the user to after sign in (successful or not) */
  redirectUri: string,
  /** Scopes you expect the final token to have. Read more here: https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html#get-authorize-request-parameters */
  scopes?: string[],
}

// #region FEDERATED AUTH
type CognitoIdpSignInUrlBuildSuccess = {
  /** Was the build successful? */
  readonly success: true,
  /** Sign in url to redirect to */
  readonly url: string,
}

type CognitoIdpSignInUrlBuildFailed = {
  /** Was the build successful? */
  success: false,
  /** Error message string */
  readonly message: string,
}

export type CognitoIdpSignInUrlBuildResult = CognitoIdpSignInUrlBuildSuccess | CognitoIdpSignInUrlBuildFailed;
const scope: string[] = ["openid", "email", "profile"];
// const scope: string[] = ["openid", "email", "phone", "aws.cognito.signin.user.admin"];

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
    loginWith: {
      oauth: {
        domain: String(process.env.NEXT_PUBLIC_OAUTH_DOMAIN),
        // Ensure the scope matches the one in the Cognito User Pool
        scopes: scope,
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


/** Convert (utf16) string to a a hash (utf8) ArrayBuffer (aka Byte Array) */
export async function sha256(value: string): Promise<ArrayBuffer> {
  // JS strings are Utf16 -> convert to Utf8
  const utf8Encoded = new TextEncoder().encode(value);
  // Create a SHA-256 digest
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
  return await crypto.subtle.digest("SHA-256", utf8Encoded);
}

/** Generates a sha256 nonce (a one time number hash value) and return it
 * as a hex (Base16) string value.
 *
 * @returns A hexadecimal (Base16) nonce string.
 */
export async function generateNonce(): Promise<string> {
  const randomValue = crypto.getRandomValues(new Uint32Array(4)).toString();
  const hash = await sha256(randomValue);
  // convert buffer to byte array
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
  const byteArray = Array.from(new Uint8Array(hash));
  // Convert bytes to hex string (aka Base16)
  const nonce = byteArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
  return nonce;
}

export async function buildIdpSignInUrl(args: BuildIdpSignInUrlArgs, callback: (result: CognitoIdpSignInUrlBuildResult) => void) {
  const nonce = await generateNonce();
  const codeVerifier = await generateNonce();

  // Store unique value in session storage
  setSessionStorageValue(`codeVerifier-${nonce}`, codeVerifier);

  // Encrypt the verifier (AWS expects this to be SHA256)
  const hash = await sha256(codeVerifier);

  // Url encode the byte array
  const base64Encoded = base64EncodeByteArray(hash);

  const authorizeUrl = buildAuthorizeUrl({
    responseType: "code",
    provider: args.provider,
    clientId: `${process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID}`,
    state: nonce,
    redirect_uri: args.redirectUri,
    hostedUIBaseUrl: `https://${process.env.NEXT_PUBLIC_OAUTH_DOMAIN}`,
    code_challenge: base64Encoded,
    scope: scope.join(" "),
  });

  callback({ success: true, url: authorizeUrl });
}

/**
   * Request user info from hosted UI /oauth2/userInfo federation endpoint
   *
   * @param {GetUserInfoArgs} args Arguments to build request
   * @param {(resposne: CognitoIdpUserInfoResponse) => void} allback Callback on function result
   *
   * @read https://docs.aws.amazon.com/cognito/latest/developerguide/userinfo-endpoint.html
   */
export async function idpGetUserInfo(args: GetUserInfoArgs, callback: (response: CognitoIdpUserInfoResponse) => void) {

  if (!isValidUrl(args.hostedUIBaseUrl)) {
    const message = `idpGetUserInfo error: invalid value for argument hostedUIBaseUrl. Expected url, found: '${args.hostedUIBaseUrl}`;


    callback({
      error: "inavlid_function_arguments",
      error_description: message,
    });
    return;
  }

  const url = `${args.hostedUIBaseUrl}/oauth2/userInfo`;

  // Execute fetch request
  fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${args.accessToken}` },
  }).then(res => {
    return res.json() as Promise<CognitoIdpUserInfoResponse>;
  }).then(body => {
    callback(body);
  }).catch(reason => {
    const message = `idpGetUserInfo error: Something went wrong during fetch GET request.`;
    callback({
      error: "fetch_error",
      error_description: message,
    });
  });
}

/**
   * Use to exchange the received (idp) authorization code from cognito
   * for a cognito access token.
   *
   * @param {CognitoIdpTokenExchangeParams} args - Arguments to send along
   * @oaram {(res: CognitoIdpTokenExchangeResponse) => void} callback Will be called when done
   * @read https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
   */
export async function requestIdpOauthToken(args: CognitoIdpTokenExchangeParams, callback: (res: CognitoIdpTokenExchangeResponse) => void) {
  const url = args.hostedUIBaseUrl + "/oauth2/token/";

  const body: Record<string, string> = {};
  body["grant_type"] = "authorization_code";
  body["client_id"] = args.clientId;
  body["redirect_uri"] = args.redirectUri;
  body["code"] = args.code;

  if (typeof args.clientSecret === "string")
    body["client_secret"] = args.clientSecret;

  if (typeof args.codeVerifier === "string")
    body["code_verifier"] = args.codeVerifier;

  const entries = Object.entries(body);
  const bodyparts: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const encodedkey = encodeURIComponent(entry[0]);
    const encodedvalue = encodeURIComponent(entry[1] as string);
    bodyparts.push(encodedkey + "=" + encodedvalue);
  }
  const formBody = bodyparts.join("&");

  let response: Response;
  console.log("url: ", url);
  console.log("formBody: ", formBody);
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody,
  }).then(res => {
    response = res;
    return res.json();
  }).then(resBody => {
    if (response.status !== 200) {
      console.log("Then: Error during fetch request:", resBody);
      callback({
        success: false,
        responseData: resBody as CognitoAuthorizeCodeForTokenErrorResponse,
      });
    } else {
      callback({
        success: true,
        responseData: resBody as CognitoAuthorizeCodeForTokenSuccessResponse,
      });
    }
  }).catch(reason => {
    console.log("Catch: Error during fetch request:", reason);
    callback({
      success: false,
      responseData: { error: "unknown_error_type" },
    });
  });
}

/**
 * Builds a third party sign in url with provided parameters, to which you can redirect your users.
 *
 * @param args The arguments to build the url
 *
 * @read excellent article: https://advancedweb.hu/how-to-secure-the-cognito-login-flow-with-a-state-nonce-and-pkce/
 * @read AWS Cogntio docs: https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html#get-authorize-request-parameters
 *
 */
function buildAuthorizeUrl(args: AuhtorizeUrlBuildArguments): string {
  let url = args.hostedUIBaseUrl + "/oauth2/authorize";
  url += "?response_type=" + args.responseType;
  url += "&client_id=" + encodeURIComponent(args.clientId);
  url += "&redirect_uri=" + encodeURIComponent(args.redirect_uri);
  // url += "&redirect_uri=" + args.redirect_uri;

  if (typeof args.provider === "string")
    url += "&identity_provider=" + args.provider;

  if (typeof args.idpIdentifier === "string")
    url += "&idp_identifier=" + args.idpIdentifier;

  if (typeof args.state === "string")
    url += "&state=" + args.state;

  console.log(args.scope)
  if (typeof args.scope === "string")
    url += "&scope=" + encodeURIComponent(args.scope);

  // Make sure the code_challenge value is SHA-256 encrypted and Base64 encoded!
  if (typeof args.code_challenge === "string") {
    // Could be written as one line, but split it up for readability sake
    url += "&code_challenge_method=S256";
    // NOTE: don't urlEncode this value before the function!!
    url += "&code_challenge=" + urlEncodeBase64String(args.code_challenge);
    // Ucomment this one trigger an error message in the redirect response from Cognito
    // url += "&code=" + urlEncodeBase64String(args.code_challenge);
  }

  return url;
}

/** Url encodes any Base64 illegal characters ("/", "+" and "=")
 *
 * @param base64String Make sure it is a Base64 encoded string!
 *
 * @read Base64 table: https://media.geeksforgeeks.org/wp-content/uploads/20200520142906/1461.png
 * @read url reserved characters: https://developers.google.com/maps/url-encoding
*/
function urlEncodeBase64String(base64String: string) {
  // We replace these characters, because they are/could be part of
  // the base64 encoding result, but are not url safe.

  // Replace all "+" occurences with "-"
  let result = base64String.replace(/\+/g, "-");
  // Replace all "/" occurences with "_"
  result = result.replace(/\//g, "_");
  // Replace all "=" occurences with ""
  result = result.replace(/=+$/g, "");

  return result;
}


/** Base64 encodes byte array. Produces ascii output.
 *
 * @read Base64 table: https://media.geeksforgeeks.org/wp-content/uploads/20200520142906/1461.png
 */
function base64EncodeByteArray(buff: ArrayBuffer): string {
  let result = "";

  const byteArray = new Uint8Array(buff);
  for (let i = 0, length = byteArray.length; i < length; i++) {
    const byte = byteArray[i];
    const char = String.fromCharCode(byte);
    result += char;
  }

  // Convert binary chars to asccii
  // https://developer.mozilla.org/en-US/docs/Web/API/btoa
  // Ignore deprecation message -> Buffer alternative hasn't been
  // implemented long enough to use it. btoa is here for legacy support.
  const asccii = btoa(result);
  return asccii;
}



export async function idpSignInUser(userName: string, sessionData: ICognitoUserSessionData, userInfo: Record<string, any>) {
  setLocalStorageValue("idp-cognito-username", userName);
  setLocalStorageValue("idp-cognito-session", JSON.stringify(sessionData));
  setLocalStorageValue("idp-cognito-user-info", JSON.stringify(userInfo));
}
