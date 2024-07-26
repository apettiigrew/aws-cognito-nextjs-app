import { AWSCognitoCommonError } from "@/lib/auth/cognito-api";
import { WarningIcon } from "../../icons/icons";
import styles from "./message-banner.module.scss";


export type SigninErrorTypes = AWSCognitoCommonError | "Unknown" | null;

interface ErrorMessageBannerProps {
    errorCode: SigninErrorTypes;
    state: "error" | "success" | "warning";
}
export function MessageBanner(props: ErrorMessageBannerProps) {
    const { errorCode } = props;
    let message = "";
    console.log(errorCode);
    if (errorCode === null || errorCode === undefined) {
        return null;
    }

    switch (errorCode) {
        case "NotAuthorizedException":
            message = "Incorrect credentials, please try again"
            break;
        case "LimitExceededException":
            message = "Too many attempts, please try again later"
            break;

        case "CodeMismatchException":
            message = "Incorrect code, please use a valid code"
            break;

        case "ExpiredCodeException":
            message = "Code has expired, please request a new one"
            break;
        case "InvalidPasswordException":
            message = "Password does not meet requirements"
            break;

        case "Unknown":
        default:
            message = "Something went wrong please try again later"
    }

    return (
        <div className={styles["error-banner"]}>
            <WarningIcon />
            <p>{message}</p>
        </div>
    )
}