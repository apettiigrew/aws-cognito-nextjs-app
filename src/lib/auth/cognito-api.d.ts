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
    "UserNotFoundException"
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

/** https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html#API_InitiateAuth_Errors */
export type AWSInitiateAuthError = AWSCognitoError<AWSCognitoInitiateAuthErrorCodes | AWSCognitoCommonErrorCodes>;