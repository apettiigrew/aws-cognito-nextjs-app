
/** https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html#API_InitiateAuth_Errors */
type AWSCognitoInitiateAuthErrorCodes =
    "ForbiddenException" |
    "InternalErrorException" |
    "InvalidLambdaResponseException" |
    "InvalidParameterException" |
    "InvalidSmsRoleAccessPolicyException" |
    "InvalidSmsRoleTrustRelationshipException" |
    "InvalidUserPoolConfigurationException" |
    "NotAuthorizedException" |
    "PasswordResetRequiredException" |
    "ResourceNotFoundException" |
    "TooManyRequestsException" |
    "UnexpectedLambdaException" |
    "UserLambdaValidationException" |
    "UserNotConfirmedException" |
    "UserNotFoundException" |
    "UsernameExistsException"
    ;

// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ConfirmForgotPassword.html#API_ConfirmForgotPassword_Errors
type AWSCognitoConfirmForgotPasswordErrorCodes =
    "CodeMismatchException" |
    "ExpiredCodeException" |
    "LimitExceededException" |
    "InvalidPasswordException"
    ;

/** https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/CommonErrors.html */
type AWSCognitoCommonErrorCodes =
    "AccessDeniedException" |
    "IncompleteSignature" |
    "InternalFailure" |
    "InvalidAction" |
    "InvalidClientTokenId" |
    "InvalidParameterCombination" |
    "InvalidParameterValue" |
    "InvalidQueryParameter" |
    "MalformedQueryString" |
    "MissingAction" |
    "MissingAuthenticationToken" |
    "MissingParameter" |
    "NotAuthorized" |
    "OptInRequired" |
    "RequestExpired" |
    "ServiceUnavailable" |
    "ThrottlingException" |
    "ValidationError" |
    "NetworkError"
    ;

export class AWSCognitoError<T = string> extends Error {
    /** The error name. */
    name: T;
    /** The error code. */
    code: T;
    /** Optional included status code */
    statusCode?: number;

    constructor(message: string | null);
}

/** https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html#get-authorize-request-parameters */
export type AuhtorizeUrlBuildArguments = {
    /** The AWS Cognito hosted ui domain. Either a AWS generated domain (https://xxxxxxxxxx.eu-central-1.amazoncognito.com) or a custom domain name by us. */
    hostedUIBaseUrl: string,
    /** The response type. Must be code or token.
     *
     * A successful request with a response_type of code returns an authorization code grant. An authorization code grant is a code parameter that Amazon Cognito appends to your redirect URL. Your app can exchange the code with the Token endpoint for access, ID, and refresh tokens. As a security best practice, and to receive refresh tokens for your users, use an authorization code grant in your app.
     *
     * A successful request with a response_type of token returns an implicit grant. An implicit grant is an ID and access token that Amazon Cognito appends to your redirect URL. An implicit grant is less secure because it exposes tokens and potential identifying information to users. You can deactivate support for implicit grants in the configuration of your app client.
     */
    responseType: "code" | "token",
    /** The Client ID.
     *
     * The value of client_id must be the ID of an app client in the user pool where you make the request. Your app client must support sign-in by Amazon Cognito local users or at least one third-party IdP.
     */
    clientId: string,
    /** Add this parameter to bypass the hosted UI and redirect your user to a provider sign-in page. The value of the identity_provider parameter is the name of the identity provider (IdP) as it appears in your user pool.
     *
     * - For social providers, you can use the identity_provider values Facebook, Google, LoginWithAmazon, and SignInWithApple.
     * - For Amazon Cognito user pools, use the value COGNITO.
     * - For SAML 2.0 and OpenID Connect (OIDC) identity providers (IdPs), use the name that you assigned to the IdP in your user pool.
     *
     * E.g. for google, use "Google"
     */
    provider?: COGNITO_IDENTITY_PROVIDERS,
    /** Add this parameter to redirect to a provider with an alternative name for the identity_provider name. You can enter identifiers for your SAML 2.0 and OIDC IdPs from the Sign-in experience tab of the Amazon Cognito console. */
    idpIdentifier?: string,
    /** Uri to redirect after login. code= (and optional status=) search params will be apended to it if successful, otherwise it will be the error(s) (messages) instead.
     *
     * **NOTE:** Has to be whitelisted in the AWS Cognito pool settings!
    */
    redirect_uri: string,
    /**
     * When your app adds a state parameter to a request, Amazon Cognito returns its value to your app when the /oauth2/authorize endpoint redirects your user.
     *
     * Add this value to your requests to guard against CSRF attacks.
     *
     * You can't set the value of a state parameter to a URL-encoded JSON string. To pass a string that matches this format in a state parameter, encode the string to Base64, then decode it in your app.
     *
     * Optional but recommended.
     */
    state?: string,
    /** Can be a combination of any system-reserved scopes or custom scopes that are associated with a client. Scopes must be separated by spaces. System reserved scopes are openid, email, phone, profile, and aws.cognito.signin.user.admin. Any scope used must be associated with the client, or it will be ignored at runtime.
     *
     * If the client doesn't request any scopes, the authentication server uses all scopes that are associated with the client.
     *
     * An ID token is only returned if openid scope is requested. The access token can be only used against Amazon Cognito user pools if aws.cognito.signin.user.admin scope is requested. The phone, email, and profile scopes can only be requested if openid scope is also requested. These scopes dictate the claims that go inside the ID token.
     */
    scope?: string,
    /**
     * **ALWAYS** SHA-256 encrypt and then Base64 encode this value! It is the only supported encryption by AWS Cognito!
     *
     * The challenge that you generated from the code_verifier.
     *
     * Required only when you specify a code_challenge_method parameter.
     */
    code_challenge?: string,
    /** The method that you used to generate the challenge. The PKCE RFC defines two methods, S256 and plain; however, Amazon Cognito authentication server supports only S256. */
    // code_challenge_method?: "S256",
    /** A random value that you can add to the request. The nonce value that you provide is included in the ID token that Amazon Cognito issues. To guard against replay attacks, your app can inspect the nonce claim in the ID token and compare it to the one you generated. For more information about the nonce claim, see ID token validation in the OpenID Connect standard. */
    // nonce?: string,
};

/** Response types for requests sent to hosted UI /oauth2/userInfo endpoint */
export type CognitoIdpUserInfoResponse = CognitoIdpUserInfoSuccessResponse | CognitoIdpUserInfoErrorResponse;

/** https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html#post-token-negative */
export type CognitoAuthorizeCodeForTokenErrorResponse = {
    /** Unique error code */
    error: "invalid_request" | "invalid_client" | "invalid_grant" | "unauthorized_client" | "unsupported_grant_type" | "unknown_error_type";
}


/** Idp Token echange response */
export type CognitoIdpTokenExchangeResponse = CognitoIdpTokenExchangeSuccess | CognitoIdpTokenExchangeError;

/** Params to request a token from the /oauth2/token endpoint
 *
 * @read https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
 */
type CognitoIdpTokenExchangeParams = {
    /** The AWS Cognito hosted ui domain. Either a AWS generated domain (https://xxxxxxxxxx.eu-central-1.amazoncognito.com) or a custom domain name by us. */
    hostedUIBaseUrl: string,
    /** Used grant type to exchange for token. Must be authorization_code or refresh_token or client_credentials. You can request an access token for a custom scope from the token endpoint when, in the app client, the requested scope is enabled, you have configured a client secret, and you have allowed client_credentials grants. */
    // grantType: "authorization_code",
    /** The ID of an app client in your user pool. You must specify the same app client that authenticated your user.
    *
    * Required if the client is public and does not have a secret, or with client_secret if you want to use client_secret_post authorization.
    */
    clientId: string,
    /** The client secret for the app client that authenticated your user. Required if your app client has a client secret and you did not send an Authorization header. */
    clientSecret?: string,
    /** Must be the same redirect_uri that was used to get authorization_code in /oauth2/authorize.
    *
    * Required only if grant_type is authorization_code.
    */
    redirectUri: string,
    /** Received authorization code */
    code: string,
    /** The proof that this exchange started from our domain. */
    codeVerifier?: string,
};

/** https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html#API_InitiateAuth_Errors */
export type AWSInitiateAuthError = AWSCognitoError<AWSCognitoInitiateAuthErrorCodes | AWSCognitoCommonErrorCodes>;
export type AWSInitiateAuthError = AWSCognitoError<AWSCognitoInitiateAuthErrorCodes | AWSCognitoCommonErrorCodes>;
export type AWSCognitoCommonError = AWSCognitoConfirmForgotPasswordErrorCodes | AWSCognitoInitiateAuthErrorCodes | AWSCognitoCommonErrorCodes;
