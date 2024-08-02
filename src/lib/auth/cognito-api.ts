import { ThirdPartyAuthorizeRedirectData } from "@/components/pages/third-party-authorize/third-party-authorize";
import { CognitoAccessToken, CognitoIdToken, CognitoUser, CognitoUserPool, CognitoUserSession, ICognitoUserAttributeData, ICognitoUserPoolData, ICognitoUserSessionData, NodeCallback, UserData } from "amazon-cognito-identity-js";
import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue, setSessionStorageValue } from "../utils/storage-utils";
import { isValidUrl } from "../utils/url-utils";
import { AuhtorizeUrlBuildArguments, AWSCognitoError, BuildIdpSignInUrlArgs, COGNITO_IDENTITY_PROVIDERS, CognitoAuthorizeCodeForTokenErrorResponse, CognitoAuthorizeCodeForTokenSuccessResponse, CognitoIdpSignInUrlBuildResult, CognitoIdpTokenExchangeParams, CognitoIdpTokenExchangeResponse, CognitoIdpUserInfoErrorResponse, CognitoIdpUserInfoResponse, CognitoUserExtended, CognitoUserState, GetUserInfoArgs } from "./cognito-api-types";
import { SocialIdentityProviderCodes } from "./social-identity";

type CognitoAPIInitConfig = {
	/** The id of the AWS cognito user pool */
	userPoolId: string,
	/** This app's client id to access the AWS Cognito user pool */
	appClientId: string,
	/** Cognito hosted UI base url. Necessary for building (third party) idp auth urls */
	hostedUIBaseUrl: string,
	/** Defines which identity providers are implemented/supported in the used user pool configuration */
	enabledIdentityProviders: COGNITO_IDENTITY_PROVIDERS[],
	/** Is debugging enabled? */
	enableDebugging: boolean,
};

/** Keeps track of all providers we have currently implemented. Set durig API init() function */
let enabledIdentityProviders: COGNITO_IDENTITY_PROVIDERS[] = [];

/** Cognito SDK user pool instance. See API init() function */
let userPool: CognitoUserPool;
/** Base url of the Cognito hosted ui. See init() function for more info */
let hostedUIBaseUrl: string;
/** This app's client id to access the AWS Cognito user pool */
let appClientId: string;
/** Is debugging allowed? */
let debuggingEnabled = false;

let state: CognitoUserState = {
	initialized: false,
	isFederatedUser: null,
	user: null,
	userSession: null,
	userData: {
		UserAttributes: null,
		PreferredMfaSetting: null,
		MFAOptions: [],
		UserMFASettingList: [],
		Username: null,
	},
};

export const scopes: string[] = ["openid", "email", "profile", "aws.cognito.signin.user.admin"];

type EventListener = (state: CognitoUserState) => void;
const eventListeners: EventListener[] = [];

type AccessTokenEventListener = (accesToken: CognitoAccessToken) => void;
const accessTokenEventListeners: AccessTokenEventListener[] = [];



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

/**
 * Clears third party authorize redirect data from session storage
 * 
 * @return void
 */
export function clearThirdPartyAuthorizeRedirectData() {
	removeLocalStorageValue(thirdPartyAuthorizeDataStorageKey);
}

/** aptprd = Third Party Redirect Data */
export const thirdPartyAuthorizeDataStorageKey = "aptprd";
/** Retrieves stored session data for third party auth redirect urls, because we can't attach it to the redirect url query, because not allowed by Cognito... */
export function getThirdPartyAuthorizeRedirectData() {
	const json = getLocalStorageValue(thirdPartyAuthorizeDataStorageKey);
	if (json === null)
		return null;

	const obj = JSON.parse(json) as ThirdPartyAuthorizeRedirectData;
	return obj;
}

/** Updates cognito user state and sends event to all subscribed listeners. */
function updateState() {
	state = { ...state };
	for (let i = 0; i < eventListeners.length; i++) {
		const listener = eventListeners[i];
		listener(state);
	}
}

function updateStateUserData(userData: Pick<UserData, "Username" | "UserAttributes">) {

	const {
		UserAttributes,
		Username,
	} = userData;

	state.userData = {
		...state.userData,
		UserAttributes: Array.isArray(UserAttributes) ? UserAttributes : null,
		Username: typeof Username === "string" ? Username : null,
	};
}

/** Fire event message to all registered cognito access token update listeners */
function fireAccessTokenUpdatedEvent(newAccessToken: CognitoAccessToken) {
	for (let i = 0, length = accessTokenEventListeners.length; i < length; i++)
		accessTokenEventListeners[i](newAccessToken);
}

/** Helper function to check if active user's id token was issued by a federated (third party) idep (identity provider) */
function checkIfFederatedUser(idToken: CognitoIdToken) {
	const payload: CognitoIdTokenPayload = idToken.decodePayload() as CognitoIdTokenPayload;
	return Array.isArray(payload.identities);
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

	if (typeof args.scope === "string")
		url += "&scope=" + encodeURIComponent(args.scope);

	// Make sure the code_challenge value is SHA-256 encrypted and Base64 encoded!
	if (typeof args.code_challenge === "string") {
		url += "&code_challenge_method=S256";
		// NOTE: do not url encode this value before the function
		url += "&code_challenge=" + urlEncodeBase64String(args.code_challenge);
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


export class CognitoAPI {
	static init(config: CognitoAPIInitConfig) {
		if (typeof window === "undefined") {
			console.log("Cognito can only run in the browser!");
			return;
		}

		hostedUIBaseUrl = config.hostedUIBaseUrl;
		debuggingEnabled = config.enableDebugging === true || false;
		enabledIdentityProviders = Array.isArray(config.enabledIdentityProviders) ? config.enabledIdentityProviders : [];
		appClientId = config.appClientId;

		const poolData: ICognitoUserPoolData = {
			UserPoolId: config.userPoolId,
			ClientId: config.appClientId,
		};
		userPool = new CognitoUserPool(poolData);

		// Check if the user has a saved session in this browser
		const savedUser: CognitoUserExtended | null = userPool.getCurrentUser() as CognitoUserExtended;

		// If no saved user -> state is initialized -> return
		if (savedUser === null) {
			state.initialized = true;
			updateState();
			return;
		}

		state.user = savedUser;

		savedUser.getSession((error: Error | null, session: CognitoUserSession | null) => {
			// Normal user get data
			function onGetUserData(err?: AWSCognitoError | null, userData?: Pick<UserData, "Username" | "UserAttributes">) {
				if (typeof err !== "undefined" && err !== null) {
					console.error("onGetUserData error:", err);
					state.initialized = true;
					updateState();
				} else if (typeof userData !== "undefined" && userData !== null) {
					updateStateUserData(userData);
					state.initialized = true;
					updateState();
				}
			}

			// Federated user get data
			function onGetUserInfo(res: CognitoIdpUserInfoResponse) {
				if (typeof (res as CognitoIdpUserInfoErrorResponse).error === "string") {
					console.error("onGetUserInfoError:", res);
					state.initialized = true;
					updateState();
				} else {
					console.log("on Get User Info response:", res);

					// Convert response object to attributes
					// https://docs.aws.amazon.com/cognito/latest/developerguide/userinfo-endpoint.html#get-userinfo-response-sample
					const entries = Object.entries(res);
					const attributes: ICognitoUserAttributeData[] = [];
					for (let i = 0; i < entries.length; i++) {
						const entry = entries[i];
						const key = entry[0];
						const value = entry[1];
						attributes.push({ Name: key, Value: value });
					}

					const newUserdata: UserData = {
						MFAOptions: state.userData.MFAOptions as [],
						PreferredMfaSetting: state.userData.PreferredMfaSetting as string,
						UserMFASettingList: state.userData.UserMFASettingList,
						UserAttributes: attributes,
						Username: savedUser?.getUsername() || "",
					};

					console.log("newUserData:", newUserdata);

					updateStateUserData(newUserdata);
					state.initialized = true;
					updateState();
				}
			}

			if (session !== null && typeof session !== "undefined") {
				state.userSession = session;
				const valid = session.isValid();

				console.log("Loaded existing user session:", session);
				console.log("Existing session is valid:", valid);

				// If existing user (session) is valid -> fetch user data
				if (state.user !== null && session.isValid()) {
					// Fire access token update event
					fireAccessTokenUpdatedEvent(session.getAccessToken());
					// Check if user is federated
					state.isFederatedUser = checkIfFederatedUser(session.getIdToken());
					console.log("Is federated user:", state.isFederatedUser);

					if (!state.isFederatedUser) {
						state.user.getUserData(onGetUserData as NodeCallback<Error, UserData>);
					} else {
						CognitoAPI.idpGetUserInfo({
							hostedUIBaseUrl: hostedUIBaseUrl,
							accessToken: session.getAccessToken().getJwtToken(),
						}, onGetUserInfo);
					}
				} else {
					// Else, call update state with invalid session
					state.initialized = true;
					updateState();
				}
			} else if (error !== null) {
				console.error("onGetUserSession error:", error);
				// logError("onGetUserSession json:", JSON.stringify(error));
				state.initialized = true;
				updateState();
			}

		});
	}

	/**
   * Request user info from hosted UI /oauth2/userInfo federation endpoint
   *
   * @param {GetUserInfoArgs} args Arguments to build request
   * @param {(resposne: CognitoIdpUserInfoResponse) => void} allback Callback on function result
   *
   * @read https://docs.aws.amazon.com/cognito/latest/developerguide/userinfo-endpoint.html
   */
	static idpGetUserInfo(args: GetUserInfoArgs, callback: (response: CognitoIdpUserInfoResponse) => void) {

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
	 * Set sign-in user session through session and user data
	 * received from a (third party) idp (identity provider).
	 *
	 * @read https://docs.aws.amazon.com/cognito/latest/developerguide/federation-endpoints.html
	 */
	static idpSignInUser(userName: string, sessionData: ICognitoUserSessionData, userInfo: Record<string, any>) {
		const user = new CognitoUser({ Username: userName, Pool: userPool }) as CognitoUserExtended;
		state.user = user;
		state.isFederatedUser = true;

		const userSession = new CognitoUserSession(sessionData);
		state.userSession = userSession;
		user.setSignInUserSession(userSession);

		// Fire Cognito Access Token event
		fireAccessTokenUpdatedEvent(userSession.getAccessToken());

		// Convert response from /oauth2/userInfo to user attributes
		const entries = Object.entries(userInfo);
		const attributes: ICognitoUserAttributeData[] = [];
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			attributes.push({ Name: entry[0], Value: entry[1] });
		}

		const newUserdata: Pick<UserData, "Username" | "UserAttributes"> = {
			UserAttributes: attributes,
			Username: userName,
		};

		updateStateUserData(newUserdata);
		updateState();
	}


	/** Register a new listener to trigger each time a new Cognito Access Token is granted */
	static registerAccessTokenEventListener(listener: AccessTokenEventListener) {
		accessTokenEventListeners.push(listener);
	}

	static async buildIdpSignInUrl(args: BuildIdpSignInUrlArgs, callback: (result: CognitoIdpSignInUrlBuildResult) => void) {
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
			scope: scopes.join(" "),
		});

		callback({ success: true, url: authorizeUrl });
	}


	/**
	   * Use to exchange the received (idp) authorization code from cognito
	   * for a cognito access token.
	   * 
	   * @param {CognitoIdpTokenExchangeParams} args - Arguments to send along
	   * @oaram {(res: CognitoIdpTokenExchangeResponse) => void} callback Will be called when done
	   * @read https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
	   */
	static requestIdpOauthToken(args: CognitoIdpTokenExchangeParams, callback: (res: CognitoIdpTokenExchangeResponse) => void) {
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

		fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: formBody,
		}).then(res => {
			response = res;
			return res.json();
		}).then(resBody => {
			if (response.status !== 200) {

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

			callback({
				success: false,
				responseData: { error: "unknown_error_type" },
			});
		});
	}
}

