import { isValidUrl } from "@/lib/utils/url-utils";


interface Props {
    children: React.ReactNode;
}
export default function CheckForValidConfigurationValues(props: Props) {
    const { children } = props;

    if (!isValidUrl(process.env.NEXT_PUBLIC_APP_BASEURL)) {
        throw new Error("Invalid NEXT_PUBLIC_APP_BASEURL in env! Please make sure it is valid.");
    }

    if (typeof process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID !== "string") {
        throw new Error("Invalid NEXT_PUBLIC_COGNITO_USER_POOL_ID in env! Please make sure it is valid.");
    }

    if (typeof process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID !== "string") {
        throw new Error("Invalid NEXT_PUBLIC_COGNITO_CLIENT_ID in env! Please make sure it is valid.");
    }

    if (typeof process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN !== "string") {
        throw new Error("Invalid NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN in env! Please make sure it is valid.");
    }
    
    return children;
}