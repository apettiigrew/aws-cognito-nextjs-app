import { CognitoAccessTokenPayload } from "aws-jwt-verify/jwt-model";
import { NextRequest, NextResponse } from "next/server";
import { AppEnvironments } from "../app-environments";
import { COOKIE_USER_AUTH_TOKEN } from "../cookies/cookie-constants";
import { CognitoJwtVerifier } from "aws-jwt-verify";

/** Single AWS Congito JWK (JSON Web Key) object. Aka, public key data used to verify the incoming JWT (JSON Web Token) */
type JWK = {
	/** The kid is a hint that indicates which key was used to secure the JSON Web Signature (JWS) of the token. */
	kid: string,
	/** The alg header parameter represents the cryptographic algorithm that is used to secure the ID token. User pools use an RS256 cryptographic algorithm, which is an RSA signature with SHA-256. For more information on RSA, see RSA cryptography. */
	alg: "RS256" | string,
	/** The kty parameter identifies the cryptographic algorithm family that is used with the key, such as "RSA" in this example. */
	kty: "RSA" | string,
	/** The e parameter contains the exponent value for the RSA public key. It is represented as a Base64urlUInt-encoded value. */
	e: string,
	/** The n parameter contains the modulus value for the RSA public key. It is represented as a Base64urlUInt-encoded value. */
	n: string,
	/** The use parameter describes the intended use of the public key. For this example, the use value "sig" represents signature. */
	use: "sig" | string,
};

/** Success response model from the jwks.json request */
type JWKSSuccessResponse = {
	/** Available keys for verifying. In a very simple pool (like ours), there will be 2 keys: one for verifying access tokens and one for verifying id tokens.
	*
	* Look for a "kid" (key id) match in the JWT, before verifying the signature!
	*/
	keys: JWK[],
};

export async function authenticateAccountRouteRequest(request: NextRequest): Promise<NextResponse | null> {
	const accessTokenCookieValue = request.cookies.get(COOKIE_USER_AUTH_TOKEN);

	if (typeof accessTokenCookieValue === "undefined") {
		return buildRedirectToSignInResponse(request);
	}

	// Verifier that expects valid access tokens:
	const verifier = CognitoJwtVerifier.create({
		userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
		tokenUse: "access",
		clientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string, 
	});

	try {
		const payload = await verifier.verify(accessTokenCookieValue.value);
		console.log("Token is valid. Payload:", payload);
	} catch {
		console.error("Token is invalid. Redirecting to sign in page.");
		return buildRedirectToSignInResponse(request);
	}


	return null;
}

function buildRedirectToSignInResponse(request: NextRequest) {
	const url = new URL(`${request.nextUrl.origin}/login`, request.url);
	return NextResponse.redirect(url);
}

/**
 * Checks whether the current page GET request is being loaded in an Iframe from app.storyblok.com
 *
 * If so, we skip authentication, so that marketing can see & edit "authenticated" page content/copy in
 * the Storyblok preview mode.
 *
 * @param request The incoming http request
 * @returns True if loaded in iframe on app.storyblok.com, false if not.
 */
function checkIfLoadedInStoryblokPreviewIframe(request: NextRequest): boolean {
	// Check if __next_preview_data cookie is set
	const nextjsPreviewDataIsSet = request.cookies.get("__next_preview_data");
	if (typeof nextjsPreviewDataIsSet === "undefined")
		return false;

	// Check if destination is an iframe
	const destinationHeaderValue = request.headers.get("Sec-Fetch-Dest");
	if (destinationHeaderValue === null || destinationHeaderValue !== "iframe")
		return false;

	// Check if referer value is https://app.storyblok.com
	const refererValue = request.headers.get("referer");
	if (refererValue === null || refererValue !== "https://app.storyblok.com")
		return false;

	// Check if the requested fetch mode is "navigate"
	const modeHeaderValue = request.headers.get("Set-Fetch-Mode");
	if (modeHeaderValue === null || modeHeaderValue !== "navigate")
		return false;

	// Check if reqyest fetch site mode is set to "cross-site"
	const siteHeaderValue = request.headers.get("Set-Fetch-Site");
	if (siteHeaderValue === null || siteHeaderValue !== "cross-site")
		return false;

	// If none of the above failed, then the site is being loaded from Storyblok
	// in preview mode and we therefore skip auth, so that marketing can see and edit
	// authenticated pages in Storyblok.
	return true;
}

type ParsedJWT = {
	header: CognitoJWTHeader,
	payload: CognitoJWTPayload,
	signature: string,
};

type JWTParseSuccessResult = {
	success: true,
	jwt: ParsedJWT,
	headerBase64: string,
	payloadBase64: string,
	signatureBase64: string,
};

type JWTParseFailedResult = {
	success: false,
};

type JWTParseResult = JWTParseSuccessResult | JWTParseFailedResult;

/**
 * Attempts to parse JWT into it's individual parts
 * @param jwt The JWT string
 * @returns The parse result
 */
function parseJWT(jwt: string): JWTParseResult {
	// Split token parts
	const parts = jwt.split(".");
	if (parts.length !== 3)
		return { success: false };

	// Read: https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/
	// Decode individual parts
	const headerBase64 = parts[0];
	const headerbuffer = Buffer.from(headerBase64, "base64");
	const headerString = headerbuffer.toString("ascii");
	const headerValue = JSON.parse(headerString) as CognitoJWTHeader;
	// console.log("JWT Header value:", headerValue);

	const payloadBase64 = parts[1];
	const payloadBuffer = Buffer.from(payloadBase64, "base64");
	const payloadString = payloadBuffer.toString("ascii");
	const payloadValue = JSON.parse(payloadString) as CognitoJWTPayload;
	// console.log("JWT Payload value:", payloadValue);

	const signatureBase64 = parts[2];
	// console.log("Signature base64:", signatureBase64);

	return {
		success: true,
		jwt: {
			header: headerValue,
			payload: payloadValue,
			signature: signatureBase64,
		},
		headerBase64: headerBase64,
		payloadBase64: payloadBase64,
		signatureBase64: signatureBase64,
	};
}

/**
 * Finds matching Jason Web Key from Cognito pool based on the JWT header
 *
 * @param {ParsedJWT} jwt The Parsed JSON Web Token
 * @param {JWK[]} keys The valid public keys from our cognito user pool
 * @returns {JWK | null} Found key of null
 */
function findMatchingKey(jwt: ParsedJWT, keys: JWK[]): JWK | null {
	const keyId = jwt.header.kid;
	const algorithm = jwt.header.alg;

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		// Check if key:
		// - Has the same key id
		// - Used the same algorithm for signing
		// - Is used for signing
		if (key.kid === keyId && key.alg === algorithm && key.use === "sig")
			return key;
	}

	return null;
}

/**
 * Verifies basic token information according to Cognito doc recoomendations
 *
 * @param {CognitoAccessTokenPayload} payload The JWT payload
 * @param {string} userPoolBaseUrl The base url of our Congito User Pool
 * @returns {boolean} True if valid, false if not
 */
function verifyBasicJWTPayload(
	payload: CognitoAccessTokenPayload,
	userPoolBaseUrl: string,
	userPoolAppClientId: string,
): boolean {
	// Verify if it actually was issued by our user pool
	if (payload.iss !== userPoolBaseUrl) {
		console.log(`Issuer '${payload.iss}' did not match user pool base url '${userPoolBaseUrl}'`);
		return false;
	}

	// Verify that the app client id is the equal
	if (payload.client_id !== userPoolAppClientId) {
		console.log(`client id '${payload.client_id}' does not match user pool client id: '${userPoolAppClientId}'`);
		return false;
	}

	// Verify token hasn't expired
	// UTC milliseconds
	const utcNowMS = Date.now();
	// Transform to Epoch Unix Timestamp, aka convert to seconds
	const utcNowSeconds = Math.round(utcNowMS / 1000);
	// Debugging if you want to confirm
	// console.log("utcNow:", utcNowSeconds);
	// console.log("utcNow string:", new Date().toUTCString());
	if (payload.exp <= utcNowSeconds) {
		console.log(`Token is expired. Timestamp: ${payload.exp}`);
		return false;
	}

	return true;
}
