
import { CognitoAccessToken } from "amazon-cognito-identity-js";
import { COOKIE_USER_AUTH_TOKEN } from "./cookie-constants";
import Cookies, { CookieGetOptions } from "universal-cookie";
import { AppEnvironments } from "../app-environments";

/** Global instance of {@link Cookies} */
export const globalCookies = new Cookies();

export function getCookie(key: string, options?: CookieGetOptions) {
	return globalCookies.get<string>(key, options);
}

/**
 * Sets the Cognito Access Token in http cookies to sent along with each request
 * @param accessToken The Cognito Access Token
 */
export function setUserAccessTokenCookie(accessToken: CognitoAccessToken) {
	// Get cookie expiry datetime from actual access token expiry
	const expiresAtUnix = accessToken.getExpiration();
	const cookieExpiryDate = new Date(expiresAtUnix * 1000);

	const isLocalDev = process.env.NEXT_PUBLIC_APP_ENV === AppEnvironments.local;
	const jwtToken = accessToken.getJwtToken();

	globalCookies.set(
		COOKIE_USER_AUTH_TOKEN,
		jwtToken,
		{
			expires: cookieExpiryDate,
			secure: !isLocalDev,
			sameSite: "lax",
			path: "/",
			domain: location.hostname,
		}
	);
}

export function clearCustomerAccessTokenCookie() {
	const isLocalDev = process.env.NEXT_PUBLIC_APP_ENV === AppEnvironments.local;
	const cookieExpiryDate = new Date();
	globalCookies.remove(
		COOKIE_USER_AUTH_TOKEN,
		{
			expires: cookieExpiryDate,
			secure: !isLocalDev,
			path: "/",
			sameSite: "lax",
			domain: location.hostname,
		}
	);
}
